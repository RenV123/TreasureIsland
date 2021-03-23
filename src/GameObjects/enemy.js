import { Vector2D } from '../Helpers/vector2D.js';
import { GameObject, DrawTypes } from './gameObject.js';

export class Enemy extends GameObject {
  type = DrawTypes.CIRCLE;
  color = '#F94144';
  whiteListedTiles = ['Grass'];

  constructor(gameboard, treasureHunter, x, y, width, height) {
    super(x, y, width, height);
    this._gameboard = gameboard;
    this._treasureHunter = treasureHunter;
  }

  moveToTreasureHunter() {
    let distance = Vector2D.subtract(this._treasureHunter.pos, this.pos);
    if (distance.length() > 1) {
      let direction = Vector2D.divide(distance, distance.length());
      direction = new Vector2D(
        direction.x > 0 ? Math.ceil(direction.x) : Math.floor(direction.x),
        direction.y > 0 ? Math.ceil(direction.y) : Math.floor(direction.y)
      );
      let canMoveHorizontallyForward = this._canMoveOnTile(
        this.x + direction.x,
        this.y
      );
      let canMoveVerticallyForward = this._canMoveOnTile(
        this.x,
        this.y + direction.y
      );
      if (canMoveHorizontallyForward && canMoveVerticallyForward) {
        if (Math.abs(distance.x) >= Math.abs(distance.y)) {
          this.x += direction.x;
        } else {
          this.y += direction.y;
        }
      } else if (canMoveHorizontallyForward) {
        this.x += direction.x;
      } else if (canMoveVerticallyForward) {
        this.y += direction.y;
      }
    }
  }

  _canMoveOnTile(x, y) {
    let tile = this._gameboard.getTile(x, y);
    return this.whiteListedTiles.includes(tile.constructor.name);
  }
}
