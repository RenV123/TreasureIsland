import {GameObject} from "./gameObject.js";

export class Treasure extends GameObject {
  color = 'gold';

  constructor(x, y, width, height) {
    super(x, y, width, height);
  }
}
