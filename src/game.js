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

    //Create the image manager as a global variable so it can be accessed from anywhere.
    Window.IMAGE_MANAGER = new ImageManager();

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
      this._onTreasureCollected,
      this._onTreasureHunterLivesDecreased,
      3
    );
    this._enemy = new Enemy(this._gameboard, this._treasureHunter);

    this._gameboard.placeTreasureHunterAndEnemy(
      this._treasureHunter,
      this._enemy
    );
    this.bindEvents();

    this._isGameOver = false;
  }

  bindEvents = () => {
    //Is touch supported?
    this.touch =
      'ontouchstart' in window ||
      (window.DocumentTouch && _instanceof(document, DocumentTouch));

    document.addEventListener('keydown', this.callbacks.keydown, false);
    document.addEventListener(
      'keyup',
      this.callbacks.resetKeyButtonStates,
      false
    );
    this.touch
      ? document.addEventListener(
          'touchend',
          this.callbacks.resetKeyButtonStates,
          false
        )
      : document.addEventListener(
          'mouseup',
          this.callbacks.resetKeyButtonStates,
          false
        );

    Array.from(
      document.querySelectorAll('#game-buttons-container button')
    ).forEach((button) => {
      this.touch
        ? button.addEventListener(
            'touchstart',
            this.callbacks.keyButtonDown,
            false
          )
        : button.addEventListener(
            'mousedown',
            this.callbacks.keyButtonDown,
            false
          );
    });
  };
  unbindEvents = () => {
    document.removeEventListener('keydown', this.callbacks.keydown, false);
    document.removeEventListener(
      'keyup',
      this.callbacks.resetKeyButtonStates,
      false
    );
    Array.from(
      document.querySelectorAll('#game-buttons-container button')
    ).forEach((button) => {
      this.touch
        ? button.removeEventListener(
            'touchstart',
            this.callbacks.keyButtonDown,
            false
          )
        : button.removeEventListener(
            'mousedown',
            this.callbacks.keyButtonDown,
            false
          );
    });
    this.touch
      ? document.removeEventListener(
          'touchend',
          this.callbacks.resetKeyButtonStates,
          false
        )
      : document.removeEventListener(
          'mouseup',
          this.callbacks.resetKeyButtonStates,
          false
        );
  };

  _keyButtonDown = (e) => {
    let button = e.currentTarget;
    if (button) {
      button.style.background = `no-repeat center/cover url('./img/${button.id}-pressed.webp')`;
    }

    //continue moving every x ms;
    if (!this._moveTimerId) {
      this._move(button.dataset.key);
      this._moveTimerId = setInterval(this._move, 100, button.dataset.key);
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
    if (!this._isGameOver) {
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
    } else {
      this.restartGame();
    }
  };

  _move = (key) => {
    if (!this._isGameOver) {
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
        this._enemy.move();
        this._drawGame();
      }
    } else {
      this.restartGame();
    }
  };

  /**
   * Draws gameObject on the canvas
   * @param gameObject
   * @private
   */
  _drawGameObject = (gameObject) => {
    this._context.fillStyle = gameObject?.color ?? 'pink'; //We use to pink in case a color isn't set.

    switch (gameObject.type) {
      case DrawTypes.IMG:
        let image = Window.IMAGE_MANAGER.loadImage(gameObject.imgSrc);
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
        console.error(`Drawtype not defined: ${gameObject.toString()}`);
    }

    //Debug
    if (window.DEBUG_MODE) {
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
   * TODO: move this code to the gameboard class.
   * @private
   */
  _drawBoard = () => {
    //draw background same as grass
    if (this._gameboard.tiles.length > 0) {
      this._gameboard.tiles.forEach((tilesRow) => {
        tilesRow.forEach((tile) => {
          //FIXME: we assume the tile dimensions don't exceed canvas dimensions
          this._drawGameObject(tile);
        });
      });
    }
    if (window.DEBUG_MODE) {
      let grassColor = new Grass().color;
      this._gameboard.tiles.forEach((tilesRow) => {
        tilesRow.forEach((tile) => {
          //FIXME: we assume the tile dimensions don't exceed canvas dimensions
          if (tile instanceof Grass) {
            tile.color = grassColor;
          }
        });
      });
    }
  };

  /**
   * Responsible for drawing all UI elements to the screen
   */
  _drawUI = () => {
    this._treasureHunter.drawUI(
      this._context,
      this.canvasWidth,
      this.canvasHeight
    );
  };

  _drawGameOver = () => {
    this._context.fillStyle = 'black';
    this._context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    this._context.fillStyle = 'white';
    this._context.font = '50px sans serif'; //TODO: find a nice font
    this._context.textAlign = 'center';
    this._context.fillText(
      'GAME OVER!',
      this.canvasWidth / 2,
      this.canvasHeight / 2 - 25 //25 = half the font size
    );

    this._context.font = '16px sans serif'; //TODO: find a nice font
    this._context.fillText(
      'Press any key to restart...',
      this.canvasWidth / 2,
      this.canvasHeight / 2 + 50 //50 = font size
    );
  };

  _drawGame = () => {
    if (!this._isGameOver) {
      this._drawBoard();
      this._drawGameObject(this._treasureHunter);
      this._drawGameObject(this._enemy);
      this._drawUI();
    } else {
      this._drawGameOver();
    }
  };

  _gameOver = () => {
    this._isGameOver = true;
  };

  /**
   * Called when the treasurehunter collects treasure.
   */
  _onTreasureCollected = (treasureTile) => {
    this._gameboard.collectTreasureTile(treasureTile);
  };

  /**
   * Called when the treasurehunter lives are decreased.
   * @param {Number} lives
   */
  _onTreasureHunterLivesDecreased = (lives) => {
    if (lives === 0) {
      this._gameOver();
    }
  };

  _onAllTreasureCollected = () => {
    this.restartGame();
  };

  restartGame = () => {
    this._treasureHunter.reset();
    this._gameboard.generateBoard();
    this._gameboard.placeTreasureHunterAndEnemy(
      this._treasureHunter,
      this._enemy
    );
    this._isGameOver = false;
    this._drawGame();
  };

  startGame = () => {
    Window.IMAGE_MANAGER.loadListOfImages(
      [
        './img/tile-grass-1.webp',
        './img/tile-grass-2.webp',
        './img/tile-grass-3.webp',
        './img/tile-grass-4.webp',
        './img/tile-wall-1.webp',
        './img/tile-wall-2.webp',
        './img/tile-wall-3.webp',
        './img/tile-treasure-1.webp',
        './img/tile-treasurehunter-1.webp',
        './img/tile-enemy-1.webp',
      ],
      () => {
        this._drawGame();
      }
    );
  };
}

const game = new Game(context, canvas.width, canvas.height);
game.startGame();
