/* eslint-disable camelcase */

import Issue from './issue';

class JoinsWithoutIndex extends Issue {
  constructor({ Select_full_join, Uptime }) {
    super('Joins without Index');
    if (Select_full_join > 0) this.display = true;
    this.message = `${((Select_full_join / Uptime) * 3600).toFixed(2)} / h -- Add suitable indexes!`;
  }
}

export default JoinsWithoutIndex;
