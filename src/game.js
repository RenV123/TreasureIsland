import { Grass } from './GameObjects/grass.js';
import { TreasureHunter } from './GameObjects/treasureHunter.js';
import { GameBoard } from './gameBoard.js';
import { DrawTypes } from './GameObjects/gameObject.js';
import { Enemy } from './GameObjects/enemy.js';
import { ImageManager } from './Helpers/imageManager.js';

const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');

//TODO: find a better way to declare global variables.
window.DEBUG_MODE = false;

class Game {
  constructor(
    context,
    canvasWidth,
    canvasHeight,
    rows = 20,
    columns = 20,
    treasureCount = 3,
    wallCount = 120
  ) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this._context = context;
    this.callbacks = {
      keydown: this._keydown.bind(this),
      keyButtonDown: this._keyButtonDown.bind(this),
      resetKeyButtonStates: this._resetKeyButtonStates.bind(this),
    };

    this._imageManager = new ImageManager();

    this._gameboard = new GameBoard(
      canvasWidth,
      canvasHeight,
      rows,
      columns,
      treasureCount,
      wallCount,
      this._onAllTreasureCollected
    );

    this._treasureHunter = new TreasureHunter(
      this._gameboard,
      this._onTreasureCollected
    );
    this._enemy = new Enemy(this._gameboard, this._treasureHunter);

    this._gameboard.placeTreasureHunterAndEnemy(
      this._treasureHunter,
      this._enemy
    );
    this.bindEvents();
  }

  bindEvents = () => {
    document.addEventListener('keydown', this.callbacks.keydown, false);
    document.addEventListener(
      'mouseup',
      this.callbacks.resetKeyButtonStates,
      false
    );
    document.addEventListener(
      'touchend',
      this.callbacks.resetKeyButtonStates,
      false
    );
    document.addEventListener(
      'keyup',
      this.callbacks.resetKeyButtonStates,
      false
    );

    Array.from(
      document.querySelectorAll('#game-buttons-container button')
    ).forEach((button) => {
      button.addEventListener('mousedown', this.callbacks.keyButtonDown, false);
      button.addEventListener(
        'touchstart',
        this.callbacks.keyButtonDown,
        false
      );
    });
  };
  unbindEvents = () => {
    document.removeEventListener('keydown', this.callbacks.keydown, false);
    document.removeEventListener(
      'mouseup',
      this.callbacks.resetKeyButtonStates,
      false
    );
    document.removeEventListener(
      'touchend',
      this.callbacks.resetKeyButtonStates,
      false
    );

    Array.from(
      document.querySelectorAll('#game-buttons-container button')
    ).forEach((button) => {
      button.removeEventListener(
        'mousedown',
        this.callbacks.keyButtonDown,
        false
      );
      button.removeEventListener(
        'touchstart',
        this.callbacks.keyButtonDown,
        false
      );
    });
  };

  _keyButtonDown = (e) => {
    let button = e.currentTarget;
    if (button) {
      button.style.background = `no-repeat center/cover url('./img/${button.id}-pressed.webp')`;
    }

    //continue moving every x ms;
    if (!this._moveTimerId) {
      this._moveTimerId = setInterval(this._move, 50, button.dataset.key);
    }
  };

  _resetKeyButtonStates = () => {
    if (this._moveTimerId) {
      clearInterval(this._moveTimerId);
      this._moveTimerId = undefined;
    }
    Array.from(
      document.querySelectorAll('#game-buttons-container button')
    ).forEach((button) => {
      button.style.background = `no-repeat center/cover url('./img/${button.id}.webp')`;
    });
  };

  _keydown = (e) => {
    let button = document.querySelector(
      `#game-buttons-container button[data-key="${e.key}"]`
    );
    if (button) {
      button.style.background = `no-repeat center/cover url('./img/${button.id}-pressed.webp')`;
    }

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'ArrowDown':
      case 'ArrowUp':
        e.preventDefault();
        this._move(e.key);
        break;
      case 'd':
        e.preventDefault();
        if (e.ctrlKey) {
          window.DEBUG_MODE = !window.DEBUG_MODE;
          this._drawGame();
        }
    }
  };

  _move = (key) => {
    let treasureHunterMoved = false;
    switch (key) {
      case 'ArrowLeft':
        treasureHunterMoved = this._treasureHunter.moveLeft();
        break;
      case 'ArrowRight':
        treasureHunterMoved = this._treasureHunter.moveRight();
        break;
      case 'ArrowDown':
        treasureHunterMoved = this._treasureHunter.moveDown();
        break;
      case 'ArrowUp':
        treasureHunterMoved = this._treasureHunter.moveUp();
        break;
    }
    if (treasureHunterMoved) {
      this._enemy.moveToTreasureHunter();
      this._drawGame();
    }
  };

  /**
   * Draws gameObject on the canvas
   * @param gameObject
   * @private
   */
  _drawGameObject = (gameObject) => {
    this._context.fillStyle = gameObject?.color ?? 'pink';

    switch (gameObject.type) {
      case DrawTypes.IMG:
        let image = this._imageManager.loadImage(gameObject.imgSrc);
        if (image?.complete) {
          this._context.drawImage(
            image,
            gameObject.x * gameObject.width,
            gameObject.y * gameObject.height,
            gameObject.width,
            gameObject.height
          );
          if (!DEBUG_MODE) break;
        }
      // else fallback on drawrect
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
      default:
        console.log(`Drawtype not defined: ${gameObject.toString()}`);
    }

    //Debug
    if (this.DEBUG_MODE) {
      this._context.fillStyle = 'white';
      this._context.fillText(
        gameObject.pos.toString(),
        gameObject.x * gameObject.width + 10,
        gameObject.y * gameObject.height + 10,
        gameObject.width,
        gameObject.height
      );
    }
  };

  /**
   * Draws all the tiles of the board on the canvas
   * @private
   */
  _drawBoard = () => {
    //draw background same as grass
    if (this._gameboard.tiles.length > 0) {
      /* this._context.fillStyle = new Grass().color;
      this._context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);*/

      this._gameboard.tiles.forEach((tilesRow) => {
        tilesRow.forEach((tile) => {
          //FIXME: we assume the tile dimensions don't exceed canvas dimensions
          //if (tile.constructor.name !== 'Grass') {
          //Don't render the grass tiles for now.
          this._drawGameObject(tile);
          //}
        });
      });

      //Temporary debug code
      let grassColor = new Grass().color;
      this._gameboard.tiles.forEach((tilesRow) => {
        tilesRow.forEach((tile) => {
          //FIXME: we assume the tile dimensions don't exceed canvas dimensions
          if (tile.constructor.name === 'Grass') {
            tile.color = grassColor;
          }
        });
      });
    }
  };

  _drawGame = () => {
    this._drawBoard();
    this._drawGameObject(this._treasureHunter);
    this._drawGameObject(this._enemy);
  };
  /**
   * Called when the treasurehunter collects treasure.
   */
  _onTreasureCollected = (treasureTile) => {
    this._gameboard.collectTreasureTile(treasureTile);
  };

  _onAllTreasureCollected = () => {
    this._gameboard.generateBoard();
    this._gameboard.placeTreasureHunterAndEnemy(
      this._treasureHunter,
      this._enemy
    );
    this._drawBoard();
  };

  startGame = () => {
    this._drawGame();
  };
}

const game = new Game(context, canvas.width, canvas.height);
game.startGame();
