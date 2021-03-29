import { GameObject, DrawTypes } from './gameObject.js';

export class Treasure extends GameObject {
  color = '#f9c74f';
  type = DrawTypes.IMG;

  constructor(x, y, width, height) {
    super(x, y, width, height);

    this.imgSrc = './img/tile-treasure-1.webp';
  }
}
