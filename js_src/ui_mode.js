class UIMode {
  constructor(thegame) {
    console.log("created "+this.constructor.name);
    this.game = thegame;
  }
  enter() {
    console.log("entering "+this.constructor.name);
  }

  exit() {
    console.log("exiting "+this.constructor.name);
  }

  handleInput(eventType, evt) {
    if (eventType == 'keyup') {
      console.dir(this);
     this.game.curMode = new PlayMode(this);
    }
    return true;
  }

  render(display) {
    display.drawText(2,2,"rendering "+this.constructor.name);
  }

}

export class StartUpMode extends UIMode {
  enter() {
    super.enter();
    console.log("game starting");
  }

  render(display) {
    display.clear();
    display.drawText(1,1,"game starting");
    display.drawText(1,2,"press any key to play");
  }

  handleInput(eventType, evt) {
    if (eventType == 'keyup') {
      console.dir(this);
     this.game.curMode = new PlayMode(this);
    }
    return true;
  }

}
export class PlayMode extends UIMode {
  enter() {
    super.enter();
    console.log("game playing");
  }

  render(display) {
    display.clear();
    display.drawText(1,1,"game play");
    display.drawText(1,2,"press Enter to win");
    display.drawText(1,3,"press Escape to lose");
  }

  handleInput(eventType, evt) {
    if (eventType == 'keyup') {
      if (String.fromCharCode(evt.key) == "h") {
        this.game.curMode = new WinMode(this);
      }
    }
    return true;
  }

}
export class WinMode extends UIMode {
  enter() {
    super.enter();
    console.log("game win");
  }

  render() {
    display.clear();
    this.display.drawText(1,1,"game win");
    this.display.drawText(1,1,"YOU WON");
  }

  handleInput(inputType, inputData) {
  }
}

export class LoseMode extends UIMode {
  enter() {
    super.enter();
    console.log("game lose");
  }

  render() {
    this.display.drawText(1,1,"game lost");
    this.display.drawText(1,1,"YOU LOST");
  }

  handleInput(inputType, inputData) {
  }
}