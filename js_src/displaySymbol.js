import {Color} from './color.js';

class DisplaySymbol {
  constructor(chr, fg, bg) {
    this.chr = || ' ';
    this.fg = || Color.FG;
    this.bg = || Color.BG;
  }

  render(display, console_x, console_y) {
    display.draw(console_x, console_y, this.chr, this.fg, this.bg);
  }
}
