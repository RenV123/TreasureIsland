import { GameObject, DrawTypes } from './gameObject.js';
import { getRandomNr } from '../Helpers/helperlib.js';

export class Wall extends GameObject {
  color = '#f3722c';
  type = DrawTypes.IMG;

  constructor(x, y, width, height) {
    super(x, y, width, height);

    this.imgSrc = `./img/tile-wall-${getRandomNr(1, 4)}.webp`;
  }
}
