import ROT from 'rot-js';
import {TILES} from './tile.js';
import {init2DArray, uniqueID} from './util.js';
import {DATASTORE} from './datastore.js';


export class Map {
  constructor(xdim, ydim, mapType) {
    this.state = {};
    this.state.xdim = xdim || 1;
    this.state.ydim = ydim || 1;
    this.state.mapType = mapType || 'basic types';
    //this.tileGrid = init2DArray(this.xdim, this.ydim, TILES.NULLTILE);
    this.state.setupRngState = ROT.RNG.getState();
    this.tileGrid = TILE_GRID_GENERATOR[mapType](xdim, ydim, this.state.setupRngState);
    this.state.id = uniqueID('map');

    console.dir(this);
  }

  build() {
      this.tileGrid = TILE_GRID_GENERATOR['basic types'](xdim, ydim, this.state.setupRngState);
  }

  getID() {
    return this.id;
  }

  getXDim() {
    return this.state.xdim;
  }

  getYDim() {
    return this.state.ydim;
  }

  getMapType() {
    return this.state.mapType;
  }

  getRngState() {
    return this.state.setupRngState;
  }

  setID(newID) {
    this.id = newID;
  }

  setXDim(newx) {
    this.state.xdim = newx;
  }

  setYDim(newy) {
    this.state.ydim = newy;
  }

  setMapType(newMap) {
    this.state.mapType = newMap;
  }

  setRngState(newRNG) {
    this.state.setupRngState = newRNG;
  }

  render(display, camera_map_x, camera_map_y) {
    console.log("RENDER");
    let cx = 0;
    let cy = 0;
    let xstart = camera_map_x - Math.trunc(display.getOptions().width / 2);
    let xend = xstart + display.getOptions().width;
    let ystart = camera_map_y - Math.trunc(display.getOptions().height / 2);
    let yend = ystart + display.getOptions().height;

    for (let xi = xstart; xi < xend; xi++) {
      for (let yi = xstart; yi < yend; yi++) {
        this.getTile(xi,yi).render(display,cx,cy);
        cy++;
      }
      cx++;
      cy = 0;
    }
  }

  toJSON() {
    return JSON.stringify(this.state);
  }

  getTile(mapx, mapy) {
    if ((mapx < 0) || (mapx > this.state.xdim - 1) || (mapy < 0) || (mapy > this.state.ydim - 1)) {
      return TILES.NULLTILE;
    }
    return this.tileGrid[mapx][mapy];
  }
}

let TILE_GRID_GENERATOR = {
   'basic types': function(xd,yd, rngState) {
     let tg = init2DArray(xd,yd,TILES.NULLTILE);
     let gen = new ROT.Map.Cellular(xd, yd, { connected: true });
     let origRngState = ROT.RNG.getState();
     ROT.RNG.setState(rngState);
     gen.randomize(.49);
     gen.create();

    gen.connect(function(x,y,isWall) {
      tg[x][y] = (isWall || x==0 || y==0 || x==xd-1 || y==yd-1) ? TILES.WALL : TILES.FLOOR;
    });

    ROT.RNG.setState(origRngState);
     console.log(tg);
     return tg;
   }
 }

 export function MapMaker(mapData) {
   let m = new Map(mapData.xdim, mapData.ydim, mapData.mapType);
   if (mapData.id) {
     m.setID(mapData.ID);
   }

   DATASTORE.MAPS[m.getID()] = m;

   if (mapData.setupRngState) {
     m.setRngState(mapData.setupRngState);
   }

   return m;
 }
