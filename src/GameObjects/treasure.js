import { GameObject, DrawTypes } from './gameObject.js';

export class Treasure extends GameObject {
  color = '#f9c74f';
  type = DrawTypes.IMG;
  scoreValue = 25;

  constructor(x, y, width, height) {
    super(x, y, width, height);

    this.imgSrc = './img/tile-treasure-1.webp';
  }
}
