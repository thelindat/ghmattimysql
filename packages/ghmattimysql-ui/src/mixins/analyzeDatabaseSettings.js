import connections from './issues/connections';
import fullTableScans from './issues/fullTableScans';
import joinsWithoutIndex from './issues/joinsWithoutIndex';
import keyBuffer from './issues/keyBuffer';
import outOfQueryCache from './issues/outOfQueryCache';
import queriesPerSecond from './issues/queriesPerSecond';

const issueAnalyzers = [
  connections,
  fullTableScans,
  joinsWithoutIndex,
  keyBuffer,
  outOfQueryCache,
  queriesPerSecond,
];

function analyzeDbSettings(status, variables) {
  const issues = [];
  issueAnalyzers.forEach((Issue) => {
    const msg = (new Issue(status, variables)).issue;
    if (msg) issues.push(msg);
  });
  return issues;
}

export default analyzeDbSettings;
