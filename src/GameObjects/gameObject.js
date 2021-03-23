import { Vector2D } from '../Helpers/vector2D.js';
/**
 * Since there's no enums in JS.
 */
export const DrawTypes = Object.freeze({
  RECT: Symbol('rect'),
  CIRCLE: Symbol('circle'),
  IMG: Symbol('img'),
});

export class GameObject {
  constructor(x, y, width, height) {
    this.type = DrawTypes.RECT;
    this.pos = new Vector2D(x, y);
    this.width = width;
    this.height = height;
  }
  get x() {
    return this.pos.x;
  }
  set x(value) {
    this.pos.x = value;
  }

  get y() {
    return this.pos.y;
  }
  set y(value) {
    this.pos.y = value;
  }
}
