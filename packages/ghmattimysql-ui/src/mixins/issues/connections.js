/* eslint-disable camelcase */

import Issue from './issue';

class ConnectionIssue extends Issue {
  constructor({ Connections, Uptime }) {
    super('Connections');
    if ((Connections / Uptime) > 0.25) this.display = true;
    this.message = `
      ${((Connections / Uptime) * 3600).toFixed(2)} / h --
      Too many connections per hour, increase wait_timeout.`;
  }
}

export default ConnectionIssue;
