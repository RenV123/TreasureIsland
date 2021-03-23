import { GameObject, DrawTypes } from './gameObject.js';

export class TreasureHunter extends GameObject {
  type = DrawTypes.CIRCLE;
  color = 'darkgreen';
  lives = 3;
  amountOfTreasureCollected = 0;
  whiteListedTiles = ['Grass', 'Treasure'];

  constructor(
    gameboard,
    onTreasureCollected,
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
    this._onTreasureCollected = onTreasureCollected;
  }

  moveLeft() {
    let tile = this._gameboard.getTile(this.x - 1, this.y);
    return this._moveToTile(tile);
  }

  moveRight() {
    let tile = this._gameboard.getTile(this.x + 1, this.y);
    return this._moveToTile(tile);
  }

  moveUp() {
    let tile = this._gameboard.getTile(this.x, this.y - 1);
    return this._moveToTile(tile);
  }

  moveDown() {
    let tile = this._gameboard.getTile(this.x, this.y + 1);
    return this._moveToTile(tile);
  }

  _moveToTile(tile) {
    if (this._canMoveOnTile(tile)) {
      if (tile.constructor.name == 'Treasure') {
        this.amountOfTreasureCollected++;
        this._onTreasureCollected(tile);
      }
      this.x = tile.x;
      this.y = tile.y;
      return true;
    }
    return false;
  }

  _canMoveOnTile(tile) {
    return this.whiteListedTiles.includes(tile.constructor.name);
  }
}
