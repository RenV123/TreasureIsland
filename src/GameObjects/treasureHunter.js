import {GameObject} from "./gameObject.js";

export class TreasureHunter extends GameObject {
  color = 'darkgreen';
  lives = 3;

  constructor(x, y, width, height, lives) {
    super(x, y, width, height);
    this.lives = lives;
  }
}
