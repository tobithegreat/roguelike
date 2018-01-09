import {TILES} from './tile.js';
import {init2DArray} from './util.js';
class Map {
  constructor(xdim, ydim) {
    this.xdim = xdim || 1;
    this.ydim = ydim || 1;
    this.tileGrid = init2DArray(this.xdim, this.ydim, TILES.NULLTILE);
  }

  render(display, camera_x, camera_y) {
    for (let xi = 0; xi < this.xdim; xi++) {
      for (let yi = 0; yi < this.ydim; yi++) {
        this.tileGrid[xi][yi].render(display,cx,cy);
        cy++;
      }
      cx++;
    }
  }
}
