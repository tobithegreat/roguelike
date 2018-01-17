import {DisplaySymbol} from './displaySymbol.js';

class Tile extends DisplaySymbol {
  constructor(template) {
    super(template);
    this.name = template.name;
    this.transparent = template.transparent || false;
    this.passable = template.passable || false;
  }

  isImpassable() {
    return !this.passable;
  }

  isPassable() {
    return this.passable;
  }

  setPassable(newVal) {
    this.passable = newVal;
  }

  isOpaque() {
    return !this.transparent;
  }

  isTransparent() {
    return this.transparent;
  }

  setPassable(newVal) {
    this.passable = newVal;
  }

  setTransparent(newVal) {
    this.transparent = newVal;
  }






  isA(name) {
    return this.name == name;
  }


}



export let TILES = {
  NULLTILE: new Tile({name: 'nulltile', chr:'$', transparent:false, passable:false}),
  WALL: new Tile({name: 'wall', chr: '#', transparent:false, passable:false}),
  FLOOR: new Tile({name: 'floor', chr: '.', transparent:true, passable:true}),
}
