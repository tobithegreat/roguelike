// A base class that defines all entities in the game
import {DisplaySymbol} from './displaySymbol.js';
import {uniqueID} from './util.js';
import {DATASTORE} from './datastore.js';

export class Entity extends DisplaySymbol {
  constructor(template) {
    super(template);
    this.name = template.name;
    this.state = {};
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

  toJSON() {
    return JSON.stringify(this.state);
  }




}
