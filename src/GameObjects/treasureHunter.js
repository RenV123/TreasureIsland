import { GameObject, DrawTypes } from './gameObject.js';

export class TreasureHunter extends GameObject {
  type = DrawTypes.IMG;
  color = '#4d908e';
  lives = 3;
  whiteListedTiles = ['Grass', 'Treasure'];
  amountOfTreasureCollected = 0;

  constructor(gameboard, onTreasureCollected, x, y, width, height, lives) {
    super(x, y, width, height);
    this.lives = lives;
    this._gameboard = gameboard;
    this._onTreasureCollected = onTreasureCollected;
    this.imgSrc = './img/tile-treasurehunter-1.webp';
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
      this.x = tile.x;
      this.y = tile.y;
      if (tile.constructor.name == 'Treasure') {
        this.amountOfTreasureCollected++;
        this._onTreasureCollected(tile);
      }
      return true;
    }
    return false;
  }

  _canMoveOnTile(tile) {
    return tile && this.whiteListedTiles.includes(tile.constructor.name);
  }
}
