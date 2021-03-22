import {GameObject} from "./gameObject.js";

export class Grass extends GameObject {
  color = 'green';

  constructor(x, y, width, height) {
    super(x, y, width, height);
  }
}
