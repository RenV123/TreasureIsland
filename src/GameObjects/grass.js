import { GameObject } from './gameObject.js';

export class Grass extends GameObject {
  color = '#90be6d';

  constructor(x, y, width, height) {
    super(x, y, width, height);
  }
}
