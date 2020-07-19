/* eslint-disable camelcase */

import Issue from './issue';

class KeyBuffer extends Issue {
  constructor({ Key_blocks_used }, { key_buffer_size }) {
    super('Key Buffer Size Used');
    const keyBufferUsed = (Key_blocks_used * 1024) / key_buffer_size;
    if (keyBufferUsed < 0.05 || keyBufferUsed > 0.8) this.display = true;
    this.message = `
      ${(keyBufferUsed).toFixed(2)}% --
      The key buffer usage is either very low, or too high; you can adjust the key_buffer_size.`;
  }
}

export default KeyBuffer;
