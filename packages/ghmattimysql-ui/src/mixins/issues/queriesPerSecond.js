/* eslint-disable camelcase */

import Issue from './issue';

class QueriesPerSecond extends Issue {
  constructor({ Questions, Queries, Uptime }) {
    super('Queries per Second');
    if (Questions / Uptime > 2000 || Queries / Uptime > 3000) this.display = true;
    this.message = `
      ${(Questions / Uptime).toFixed(2)} / s or ${(Queries / Uptime).toFixed(2)} / s --
      Too many queries per second, it might be stressing the server.`;
  }
}

export default QueriesPerSecond;
