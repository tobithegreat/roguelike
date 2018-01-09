import {DisplaySymbol} from './displaySymbol.js';

class Tile extends DisplaySymbol {
  constructor(name, chr, fg, bg) {
    super(chr,fg,bg);
    this.name = name;
  }
}

let TILES = {
  NULLTILE: new Tile('nulltile',' '),
  WALL: new Tile('wall', '#');
  FLOOR: new Tile('floor', '.');
}
