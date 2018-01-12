import {DisplaySymbol} from './displaySymbol.js';

class Tile extends DisplaySymbol {
  constructor(template) {
    super(template);
    this.name = template.name;
  }
}

export let TILES = {
  NULLTILE: new Tile({name: 'nulltile', chr:'$'}),
  WALL: new Tile({name: 'wall', chr: '#'}),
  FLOOR: new Tile({name: 'floor', chr: '.'}),
}
