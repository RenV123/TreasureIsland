/**
 * Since there's no enums in JS.
 */
export const DrawTypes = Object.freeze({
  RECT:   Symbol("rect"),
  CIRCLE:  Symbol("circle"),
  IMG: Symbol("img")
});

export class GameObject {
  constructor(x, y, width, height) {
    this.type = DrawTypes.RECT;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
