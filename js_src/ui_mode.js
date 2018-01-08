import {GameMessage} from './message.js';

class UIMode {
  constructor(thegame) {
    console.log("created "+this.constructor.name);
    this.game = thegame;
  }
  enter() {
    console.log("entering "+this.constructor.name);
    GameMessage.send("entering "+this.constructor.name);
  }

  exit() {
    console.log("exiting "+this.constructor.name);
  }

  handleInput(eventType, evt) {
    if (eventType == 'keyup') {
      console.dir(this);
     this.game.switchMode('play');
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
    this.game.switchMode('play');
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
      if (evt.key == "h") {
        console.dir(this);
        this.game.switchMode('win');
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

  render(display) {
    display.clear();
    display.drawText(1,1,"game win");
    display.drawText(1,2,"YOU WON");
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
