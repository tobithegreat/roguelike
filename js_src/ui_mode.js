class UIMode {
  constructor() {
    console.log("created "+this.constructor.name);

  }
  enter() {
    console.log("entering "+this.constructor.name);
  }

  exit() {
    console.log("exiting "+this.constructor.name);
  }

  handleInput() {
    console.log("");
  }

  render(display) {
    display.drawText(2,2,"rendering "+this.constructor.name);
  }

}

export class StartUpMode extends UIMode {
  constructor() {
    super();
  }
}
