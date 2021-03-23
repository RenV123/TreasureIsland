import { GameObject } from './gameObject.js';

export class Wall extends GameObject {
  color = '#f3722c';

  constructor(x, y, width, height) {
    super(x, y, width, height);
  }
}
