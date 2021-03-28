/**
 * A function that generates a random number between a range.
 * @param {number} min The minimum range of the random nr.
 * @param {number} max The maximum range of the random nr.
 */
export function getRandomNr(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function colorShade(col, amt) {
  col = col.replace(/^#/, '');
  if (col.length === 3)
    col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2];

  let [r, g, b] = col.match(/.{2}/g);
  [r, g, b] = [
    parseInt(r, 16) + amt,
    parseInt(g, 16) + amt,
    parseInt(b, 16) + amt,
  ];

  r = Math.max(Math.min(255, r), 0).toString(16);
  g = Math.max(Math.min(255, g), 0).toString(16);
  b = Math.max(Math.min(255, b), 0).toString(16);

  const rr = (r.length < 2 ? '0' : '') + r;
  const gg = (g.length < 2 ? '0' : '') + g;
  const bb = (b.length < 2 ? '0' : '') + b;

  return `#${rr}${gg}${bb}`;
}

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
export function shuffleArray(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

export class PathWayFinder {
  constructor(gameboard, whiteListedTiles) {
    this._gameboard = gameboard;
    this._whiteListedTiles = whiteListedTiles;
  }

  findShortestPath(pointA, pointB) {
    let tilePointA = this._gameboard.getTile(pointA.x, pointA.y).pos;

    let pathWayData = {
      listOfCheckedSpots: [tilePointA], //all spots on the board that the algorithm checked
      activePaths: [[tilePointA]], //all currently checked spots
      goodPaths: [], //paths that find their way to the treasurehunter are added here.
      badPaths: [], //paths that lead to dead end go here. (for debugging)
    };
    this._findPathRecursive(pathWayData, pointB);
    return pathWayData;
  }

  canFindPathBetweenPoints(pointA, pointB) {
    let pathwayData = this.findShortestPath(pointA, pointB);
    return pathwayData.goodPaths.length > 0;
  }

  _findPathRecursive(pathWayData, targetPoint) {
    //Iterate in reverse over every pathway as we are replacing them with new ones.
    let newActivePaths = [];
    while (pathWayData.activePaths.length > 0) {
      let pathway = pathWayData.activePaths.pop();

      if (pathway && pathway.length > 0) {
        let pos = pathway[pathway.length - 1];

        //Get all available surrounding tiles of this pos
        let tileArr = [
          this._gameboard.getTile(pos.x + 1, pos.y),
          this._gameboard.getTile(pos.x - 1, pos.y),
          this._gameboard.getTile(pos.x, pos.y + 1),
          this._gameboard.getTile(pos.x, pos.y - 1),
        ];

        let isDeadEnd = true;
        tileArr.forEach((tile) => {
          if (
            tile &&
            this._whiteListedTiles.includes(tile.constructor.name) &&
            !pathWayData.listOfCheckedSpots.includes(tile.pos)
          ) {
            isDeadEnd = false;

            //Found path to the treasureHunter
            if (tile.pos.equals(targetPoint)) {
              pathWayData.goodPaths.push([...pathway, tile.pos]);
            } else {
              //Keep looking
              pathWayData.listOfCheckedSpots.push(tile.pos);
              newActivePaths.push([...pathway, tile.pos]);
            }
          }
        });
        if (isDeadEnd) {
          pathWayData.badPaths.push(pathway);
        }
      } else console.error('Found undefined or empty pathway.');
    }
    pathWayData.activePaths = newActivePaths;
    if (
      pathWayData.activePaths.length > 0 &&
      pathWayData.goodPaths.length == 0
    ) {
      this._findPathRecursive(pathWayData, targetPoint);
    }
    //Sort by length to get the shortest path
    else if (pathWayData.goodPaths.length > 0) {
      pathWayData.goodPaths.sort((pathA, pathB) => {
        return pathA.length > pathB.length;
      });
    }
  }
}
