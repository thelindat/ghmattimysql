import {
  createPool, Pool, PoolConnection, QueryOptions, QueryError, PoolOptions,
} from 'mysql2/promise';
import Logger from '../logger';
import Profiler from '../profiler';

function formatVersion(versionString: string) {
  let versionPrefix = 'MariaDB';
  const version = versionString;
  if (version[0] === '5' || version[0] === '8') {
    versionPrefix = 'MySQL';
  }
  return { versionPrefix, version };
}

class MySQL {
  pool: Pool;

  logger: Logger;

  profiler: Profiler;

  formatQuery: any;

  constructor(mysqlConfig: PoolOptions | string, profiler: Profiler, logger: Logger) {
    this.pool = null;
    this.profiler = profiler;
    this.logger = logger;
    this.formatQuery = (sql: QueryOptions): string => `${sql.sql} : ${JSON.stringify(sql.values)}`;

    if (typeof mysqlConfig === 'object') {
      this.pool = createPool(mysqlConfig);
    } else {
      this.logger.error(`Unexpected configuration of type ${typeof mysqlConfig} received.`);
    }

    this.pool.query('SELECT VERSION()').then(result => {
      const formattedVersion = formatVersion(result[0][0]['VERSION()']);
      profiler.setVersion(formattedVersion);
      this.logger.success('Database server connection established.');
    }).catch(error => {
      this.logger.error(error.message);
    })
  }

  execute(sql: QueryOptions, invokingResource: string, connection?: PoolConnection) {
    return new Promise((resolve, reject) => {
      const start = process.hrtime();
      const db = connection || this.pool;

      db.query(sql).then(result => {
        this.profiler.profile(process.hrtime(start), this.formatQuery(sql), invokingResource);
        resolve(result);
      }).catch(error => {
        reject(error)
        this.profiler.profile(process.hrtime(start), this.formatQuery(sql), invokingResource);
        if (connection) {
          this.logger.info(`[${invokingResource}] A (possible deliberate) error happens on transaction for query "${this.formatQuery(sql)}": ${error.message}`, { tag: this.profiler.version });
        } else {
          this.logger.error(`[${invokingResource}] An error happens for query "${this.formatQuery(sql)}": ${error.message}`, { tag: this.profiler.version });
        }
      })
    })
  }

  onTransactionError(error: QueryError, connection: PoolConnection, callback) {
    connection.rollback().then(() => {
      this.logger.error(error.message);
      callback(false);
    });
  }

  beginTransaction(callback) {
    this.pool.getConnection().then(connection => {
      connection.beginTransaction().then(() => {
        callback(connection)
      }).catch(err => {
        this.onTransactionError(err, connection, callback);
      });
    })
    this.pool.getConnection().catch(err => {
      this.logger.error(err.message);
      callback(false);
      return
    })
  }

  commitTransaction(promises: Promise<unknown>[], connection: PoolConnection, callback) {
    Promise.all(promises).then(() => {
      connection.commit()
      .then(() => {
        callback(true);
      })
      .catch(commitError => {
        this.onTransactionError(commitError, connection, callback);
        callback(false);
      })

      // Otherwise catch the error from the execution
    }).catch((executeError) => {
      this.onTransactionError(executeError, connection, callback);
    }).then(() => {
      // terminate connection
      connection.release();
    });
  }
}

export default MySQL;
