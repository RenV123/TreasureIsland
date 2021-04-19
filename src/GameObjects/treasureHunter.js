import { GameObject, DrawTypes } from './gameObject.js';

export class TreasureHunter extends GameObject {
  type = DrawTypes.IMG;
  color = '#4d908e';
  maxLives = 3;
  lives = 3;
  whiteListedTiles = ['Grass', 'Treasure'];
  heartImgSrc = './img/heart.webp';
  amountOfTreasureCollected = 0;

  constructor(
    gameboard,
    onTreasureCollected,
    onLivesDecreased,
    lives,
    x,
    y,
    width,
    height
  ) {
    super(x, y, width, height);
    this.lives = lives;
    this.maxLives = lives;
    this._gameboard = gameboard;
    this._onTreasureCollected = onTreasureCollected;
    this._onLivesDecreased = onLivesDecreased;
    this.imgSrc = './img/tile-treasurehunter-1.webp';
  }

  /*
  Resets lives, treasure counter to the default 
  */
  reset() {
    this.lives = this.maxLives;
    this.amountOfTreasureCollected = 0;
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

  decreaseLives() {
    if (this.lives > 0) {
      this.lives--;
    }
    this._onLivesDecreased(this.lives);
  }

  /**
   *
   * @param {CanvasRenderingContext2D} context The 2d canvas context used to draw to the canvas.
   * @param {Number} canvasWidth The width in pixels of the canvas
   * @param {Number} canvasHeight The height in pixels of the canvas
   */
  drawUI(context, canvasWidth, canvasHeight) {
    let image = Window.IMAGE_MANAGER.loadImage(this.heartImgSrc);
    let padding = 5;
    for (let i = 0; i < this.lives; i++) {
      context.drawImage(
        image,
        canvasWidth - (image.width + padding) * (this.maxLives - i),
        padding,
        image.width,
        image.height
      );
    }
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
