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
    this.tileGrid = TILE_GRID_GENERATOR['basic types'](this.state.xdim, this.state.ydim, this.state.setupRngState);
    this.state.id = uniqueID('map');
    this.state.entityIDToMapPos = {};
    this.state.mapPostoEntityID = {};

    console.dir(this);
  }

  build() {
      this.tileGrid = TILE_GRID_GENERATOR['basic types'](this.state.xdim, this.state.ydim, this.state.setupRngState);
  }

  getID() {
    return this.state.id;
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
    this.state.id = newID;
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

  updateEntityPosition(ent, newMapX, newMapY) {
    let oldPos = this.state.entityIDToMapPos[ent.getID()];
    delete this.state.mapPostoEntityID[oldPos];
    ent.setX(newMapX);
    ent.setY(newMapY);
    this.state.mapPostoEntityID[`${newMapX},${newMapY}`] = ent.getID();

    this.state.entityIDToMapPos[ent.getID()] = `${newMapX},${newMapY}`;
  }

  extractEntity(ent) {
    delete this.state.mapPostoEntityID[this.state.entityIDToMapPos[ent.getID()]];
    delete this.state.entityIDToMapPos[ent.getID()];
    return ent;
  }

  addEntityAt(ent, mapX, mapY) {
    let pos = `${mapX},${mapY}`;
    this.state.entityIDToMapPos[ent.getID()] = pos;
    this.state.mapPostoEntityID[pos] = ent.getID();
    ent.setMapID(this.getID());
    ent.setX(mapX);
    ent.setY(mapY);
  }

  addEntityAtRandomPos(ent) {
    let openPos = this.getRandomOpenPosition();
    let p = openPos.split(',');
    this.addEntityAt(ent, p[0], p[1]);
  }

  getRandomOpenPosition() {
    let x = Math.trunc(ROT.RNG.getUniform() * this.state.xdim);
    let y = Math.trunc(ROT.RNG.getUniform() * this.state.ydim);

    if (this.isPositionOpen(x,y)) {
      return `${x},${y}`;
    }
    return this.getRandomOpenPosition();
  }

  isPositionOpen(mapx, mapy) {
    if (this.tileGrid[mapx][mapy].isA('floor')) {
      return true;
    }
    return false;
  }

  getTargetPositionInfo(x,y) {
    let info = {
      entity: '',
      tile: this.getTile(x,y),
    };
    let entID = this.state.mapPostoEntityID[`${x},${y}`];
    console.dir("ENTID: " + entID);
    if (entID) {
      info.entity = DATASTORE.ENTITIES[entID];
    }

    return info;
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
      for (let yi = ystart; yi < yend; yi++) {
        let pos = `${xi},${yi}`;
        if (this.state.mapPostoEntityID[pos]) {
          DATASTORE.ENTITIES[this.state.mapPostoEntityID[pos]].render(display,cx,cy);
        } else {
          this.getTile(xi,yi).render(display,cx,cy);
        }

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
     gen.randomize(.10);
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
