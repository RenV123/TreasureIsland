import { GameObject } from './gameObject.js';

export class Treasure extends GameObject {
  color = '#f9c74f';

  constructor(x, y, width, height) {
    super(x, y, width, height);
  }
}
