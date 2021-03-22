import { GameObject, DrawTypes } from './gameObject.js';

export class TreasureHunter extends GameObject {
  type = DrawTypes.CIRCLE;
  color = 'darkgreen';
  lives = 3;
  amountOfTreasureCollected = 0;
  whiteListedTiles = ['Grass', 'Treasure'];

  constructor(
    gameboard,
    x,
    y,
    width,
    height,
    lives,
    amountOfTreasureToCollect
  ) {
    super(x, y, width, height);
    this.lives = lives;
    this._gameboard = gameboard;
    this._amountOfTreasureToCollect = amountOfTreasureToCollect;
  }

  moveLeft() {
    if (this._canMove(this.x - 1, this.y)) {
      this.x--;
      return true;
    }
    return false;
  }

  moveRight() {
    if (this._canMove(this.x + 1, this.y)) {
      this.x++;
      return true;
    }
    return false;
  }

  moveUp() {
    if (this._canMove(this.x, this.y - 1)) {
      this.y--;
      return true;
    }
    return false;
  }

  moveDown() {
    if (this._canMove(this.x, this.y + 1)) {
      this.y++;
      return true;
    }
    return false;
  }

  _canMove(x, y) {
    let tile = this._gameboard.getTile(x, y);

    return this.whiteListedTiles.includes(tile.constructor.name);
  }
}
