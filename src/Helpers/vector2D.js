/*
Taken from: https://gist.github.com/winduptoy/a1aa09c3499e09edbd33
I've changed the syntax to use class instead.
Also this: https://github.com/sebleedelisle/JSTouchController/blob/master/js/Vector2.js

Simple 2D JavaScript Vector Class

Hacked from evanw's lightgl.js
https://github.com/evanw/lightgl.js/blob/master/src/vector.js

*/

export class Vector2D {
  constructor(x, y) {
    this.x = x ?? 0;
    this.y = y ?? 0;
  }
  toString(decPlaces) {
    decPlaces = decPlaces || 3;
    let scalar = Math.pow(10, decPlaces);
    return (
      '[' +
      Math.round(this.x * scalar) / scalar +
      ', ' +
      Math.round(this.y * scalar) / scalar +
      ']'
    );
  }

  negative() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }
  add(v) {
    if (v instanceof Vector2D) {
      this.x += v.x;
      this.y += v.y;
    } else {
      this.x += v;
      this.y += v;
    }
    return this;
  }
  subtract(v) {
    if (v instanceof Vector2D) {
      this.x -= v.x;
      this.y -= v.y;
    } else {
      this.x -= v;
      this.y -= v;
    }
    return this;
  }
  multiply(v) {
    if (v instanceof Vector2D) {
      this.x *= v.x;
      this.y *= v.y;
    } else {
      this.x *= v;
      this.y *= v;
    }
    return this;
  }
  divide(v) {
    if (v instanceof Vector2D) {
      if (v.x != 0) this.x /= v.x;
      if (v.y != 0) this.y /= v.y;
    } else {
      if (v != 0) {
        this.x /= v;
        this.y /= v;
      }
    }
    return this;
  }
  equals(v) {
    return this.x == v.x && this.y == v.y;
  }
  dot(v) {
    return this.x * v.x + this.y * v.y;
  }
  cross(v) {
    return this.x * v.y - this.y * v.x;
  }
  length() {
    return Math.sqrt(this.dot(this));
  }
  normalize() {
    return this.divide(this.length());
  }
  min() {
    return Math.min(this.x, this.y);
  }
  max() {
    return Math.max(this.x, this.y);
  }
  toAngles() {
    return -Math.atan2(-this.y, this.x);
  }
  angleTo(a) {
    return Math.acos(this.dot(a) / (this.length() * a.length()));
  }
  toArray(n) {
    return [this.x, this.y].slice(0, n || 2);
  }
  clone() {
    return new Vector2D(this.x, this.y);
  }
  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }
}

/* STATIC METHODS */
Vector2D.negative = function (v) {
  return new Vector2D(-v.x, -v.y);
};
Vector2D.add = function (a, b) {
  if (b instanceof Vector2D) return new Vector2D(a.x + b.x, a.y + b.y);
  else return new Vector2D(a.x + b, a.y + b);
};
Vector2D.subtract = function (a, b) {
  if (b instanceof Vector2D) return new Vector2D(a.x - b.x, a.y - b.y);
  else return new Vector2D(a.x - b, a.y - b);
};
Vector2D.multiply = function (a, b) {
  if (b instanceof Vector2D) return new Vector2D(a.x * b.x, a.y * b.y);
  else return new Vector2D(a.x * b, a.y * b);
};
Vector2D.divide = function (a, b) {
  if (b instanceof Vector2D) return new Vector2D(a.x / b.x, a.y / b.y);
  else return new Vector2D(a.x / b, a.y / b);
};
Vector2D.equals = function (a, b) {
  if (!a || !b) return false;
  return a.x == b.x && a.y == b.y;
};
Vector2D.dot = function (a, b) {
  return a.x * b.x + a.y * b.y;
};
Vector2D.cross = function (a, b) {
  return a.x * b.y - a.y * b.x;
};
