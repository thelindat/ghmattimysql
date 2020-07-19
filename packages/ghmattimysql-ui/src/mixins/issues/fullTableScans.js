/* eslint-disable camelcase */

import Issue from './issue';

class FullTableScans extends Issue {
  constructor({ Com_select, Select_scan, Uptime }) {
    super('Full Table Scan');
    if (Select_scan > 0.05 * Com_select) this.display = true;
    this.message = `
      ${((Select_scan / Uptime) * 3600).toFixed(2)} / h --
      ${(100 * (Select_scan / Com_select)).toFixed(2)}% of Selects are without an Index --
      Add suitable indexes and optimize queries.`;
  }
}

export default FullTableScans;
