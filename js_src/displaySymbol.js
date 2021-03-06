import {Color} from './color.js';

export class DisplaySymbol {
  constructor(template) {
    this.chr = template.chr || ' ';
    this.fg = template.fg || Color.FG;
    this.bg = template.bg || Color.BG;
  }

  render(display, console_x, console_y) {
    display.draw(console_x, console_y, this.chr, this.fg, this.bg);
  }
}
