import { Grass } from './GameObjects/grass.js';
import { TreasureHunter } from './GameObjects/treasureHunter.js';
import { GameBoard } from './gameBoard.js';
import { DrawTypes } from './GameObjects/gameObject.js';

const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');

class Game {
  constructor(
    context,
    canvasWidth,
    canvasHeight,
    rows = 15,
    columns = 15,
    treasureCount = 3,
    wallCount = 10
  ) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this._context = context;
    this._gameboard = new GameBoard(
      canvasWidth,
      canvasHeight,
      rows,
      columns,
      treasureCount,
      wallCount
    );
    this.callbacks = {
      keydown: this._keydown.bind(this),
    };
    this._treasureHunter = new TreasureHunter(
      this._gameboard,
      this._onTreasureCollected
    );
    this.bindEvents();
  }

  bindEvents = () => {
    document.addEventListener('keydown', this.callbacks.keydown, false);
  };
  unbindEvents = () => {
    document.addEventListener('keydown', this.callbacks.keydown, false);
  };

  _keydown = (e) => {
    e.preventDefault();

    switch (e.key) {
      case 'ArrowLeft':
        this._treasureHunter.moveLeft();
        break;
      case 'ArrowRight':
        this._treasureHunter.moveRight();
        break;
      case 'ArrowDown':
        this._treasureHunter.moveDown();
        break;
      case 'ArrowUp':
        this._treasureHunter.moveUp();
        break;
    }

    this._drawGame();
  };

  /**
   * Draws gameObject on the canvas
   * @param gameObject
   * @private
   */
  _drawGameObject = (gameObject) => {
    this._context.fillStyle = gameObject?.color ?? 'pink';

    switch (gameObject.type) {
      case DrawTypes.RECT:
        this._context.fillRect(
          gameObject.x * gameObject.width,
          gameObject.y * gameObject.height,
          gameObject.width,
          gameObject.height
        );
        break;
      case DrawTypes.CIRCLE:
        this._context.beginPath();
        this._context.arc(
          gameObject.x * gameObject.width + gameObject.width / 2,
          gameObject.y * gameObject.height + gameObject.height / 2,
          gameObject.width / 2,
          0,
          Math.PI * 2,
          false
        );
        this._context.fill();
        break;
      case DrawTypes.IMG:
        break;
      default:
        console.log(`Drawtype not defined: ${gameObject.toString()}`);
    }
  };

  /**
   * Draws all the tiles of the board on the canvas
   * @private
   */
  _drawBoard = () => {
    //draw background same as grass
    if (this._gameboard.tiles.length > 0) {
      this._context.fillStyle = new Grass().color;
      this._context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

      this._gameboard.tiles.forEach((tilesRow) => {
        tilesRow.forEach((tile) => {
          //FIXME: we assume the tile dimensions don't exceed canvas dimensions
          if (tile.constructor.name !== 'Grass') {
            //Don't render the grass tiles for now.
            this._drawGameObject(tile);
          }
        });
      });
    }
  };

  _drawGame = () => {
    this._drawBoard();
    this._drawGameObject(this._treasureHunter);
  };

  /**
   * Pick a random grass tile to place the treasurehunter
   * @private
   */
  _placeTreasureHunter = () => {
    let tile = this._gameboard.getRandomFreeSpotOnBoard();
    this._treasureHunter.x = tile.x;
    this._treasureHunter.y = tile.y;
    this._treasureHunter.width = tile.width;
    this._treasureHunter.height = tile.height;
  };

  /**
   * Called when the treasurehunter collects treasure.
   */
  _onTreasureCollected = (treasureTile) => {
    this._gameboard.collectTreasureTile(treasureTile);
  };

  startGame = () => {
    this._placeTreasureHunter();
    this._drawGame();
  };
}

const game = new Game(context, canvas.width, canvas.height);
game.startGame();
