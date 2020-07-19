/* eslint-disable camelcase */

import Issue from './issue';

class OutOfQueryCache extends Issue {
  constructor({ Qcache_lowmem_prunes, Uptime }) {
    super('Query Cache Prunes');
    if (Qcache_lowmem_prunes > 0) this.display = true;
    this.message = `
      ${(Qcache_lowmem_prunes / Uptime).toFixed(2)} / s --
      You are running out of Query Cache, increase query_cache_size.`;
  }
}

export default OutOfQueryCache;
