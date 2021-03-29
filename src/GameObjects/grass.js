import { GameObject, DrawTypes } from './gameObject.js';
import { getRandomNr } from '../Helpers/helperlib.js';

export class Grass extends GameObject {
  color = '#90be6d';
  type = DrawTypes.IMG;

  constructor(x, y, width, height) {
    super(x, y, width, height);

    this.imgSrc = `./img/tile-grass-${getRandomNr(1, 5)}.webp`;
  }
}
