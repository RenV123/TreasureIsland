import {GameObject} from "./gameObject.js";

export class Wall extends GameObject {
  color = 'brown';

  constructor(x, y, width, height) {
    super(x, y, width, height);
  }
}
