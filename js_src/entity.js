// A base class that defines all entities in the game
import {MixableSymbol} from './mixable_symbol.js';
import {uniqueID} from './util.js';
import {DATASTORE} from './datastore.js';

export class Entity extends MixableSymbol {
  constructor(template) {
    super(template);
    this.name = template.name;

    this.state.x = 0;
    this.state.y = 0;
    this.state.mapID = 0;
    this.state.id = uniqueID();
  }

  getName() {
    return this.state.name;
  }

  setName(name) {
    this.state.name = name;
  }
  getX() {
    return this.state.x;
  }

  setX(newX) {
    this.state.x = newX;
  }

  getY() {
    return this.state.y;
  }

  setY(newY) {
    this.state.y = newY;
  }

  getMapID() {
    return this.state.mapID;
  }

  setMapID(newInfo) {
    this.state.mapID = newInfo;
  }

  getMap() {
    return DATASTORE.MAPS[this.state.mapID];
  }

  getID() {
    return this.state.id;
  }

  setID(newID) {
    this.state.id = newID;
  }

  destroy() {
    //remove from map
    //remove from datastore
    this.getMap().extractEntity(this);
    delete DATASTORE[this.getID()];
  }

  moveBy(dx,dy) {

    let newX = this.state.x*1 + dx*1;
    let newY = this.state.y*1 + dy*1;

    if (this.getMap().isPositionOpen(newX, newY)) {
      this.state.x += newX;
      this.state.y += newY;
      this.getMap().updateEntityPosition(this, this.state.x, this.state.y);
      return true;
    }
      return false;
  }

  toJSON() {
    return JSON.stringify(this.state);
  }




}
