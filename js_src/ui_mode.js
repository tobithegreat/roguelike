import {Message} from './message.js';
import {DisplaySymbol} from './displaySymbol.js';
import {MapMaker} from './Map.js';
import {DATASTORE} from './datastore.js';

class UIMode {
  constructor(thegame) {
    console.log("created "+this.constructor.name);
    this.game = thegame;
  }
  enter() {
    console.log("entering "+this.constructor.name);
    Message.send("entering "+this.constructor.name);
  }

  exit() {
    Message.clear();
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
    this.game.switchMode('persistence');
    }
    return true;
  }

}
export class PlayMode extends UIMode {
  constructor(thegame) {
    super(thegame);
    this.state = {
      mapId: '',
      camera_map_x: '',
      camera_map_y: '',
    };
  }

  enter() {
    Message.send("entering PLAY");
    if (!this.state.mapID) {
      let m = MapMaker(10,10);
      this.state.mapID = m.getID();
      m.build();

    }
    this.state.camerax = 0;
    this.state.cameray = 0;
    this.cameraSymbol = new DisplaySymbol('@', '#eb4');
  }

  toJSON() {
    return JSON.stringify(this.state);
  }

  restoreFromState(stateData) {
    console.log("restoring play state from: ");
    console.dir(stateData);
    this.state = stateData;
  }



  render(display) {
    display.clear();
    display.drawText(1,1,"game play");
    display.drawText(1,2,"press Enter to win");
    display.drawText(1,3,"press Escape to lose");
    DATASTORE.MAPS[this.state.mapID].render(display,this.state.camerax,this.state.cameray);
    this.cameraSymbol.render(display, display.getOptions().width/2, display.getOptions().height/2);
  }


  handleInput(eventType, evt) {
    if (eventType == 'keyup') {
      if (evt.key == "h") {
        console.dir(this);
        this.game.switchMode('win');
      }
      else if (evt.key == '7') {
        this.moveCamera(-1, -1);
        return true;
      }
      else if (evt.key == '3') {
        this.moveCamera(1,1);
        return true;
      }
    }
    return true;
  }

  moveCamera(dx,dy) {
    this.state.camerax += dx;
    this.state.cameray += dy;
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


export class PersistenceMode extends UIMode {
  enter() {
    super.enter();
    console.log("game in persistence");
  }

  render(display) {
    display.clear();
    display.drawText(3,2,"N for new game");
    display.drawText(3,3,"S to save game");
    display.drawText(3,4,"L to load previously saved game");
    display.drawText(3,5,"ESC to end game");
  }

  handleInput(eventType, evt) {
    if (eventType == 'keyup') {

      if (evt.key == "N".toLowerCase()) {
        //this.game.setupNewGame();
        this.game.switchMode('play');
        console.dir("New Game");
        return true;
      }
      else if (evt.key == "S".toLowerCase()) {
        this.handleSave();
        console.dir("Save Game");
        return true;
      }
      else if (evt.key == "L".toLowerCase()) {
        this.handleRestore();

        return true;
      }
      else if (evt.key == "Escape") {
        console.dir("End Game");
        return true;
      }
    }
    return true;
  }

  handleSave() {
    if (!this.localStorageAvailable()) {
      return false;
    }
    window.localStorage.setItem('bbsavegame', JSON.stringify(DATASTORE));
    Message.send("Game Saved");
  }

  handleRestore() {
    console.log("load game");
    if (!this.localStorageAvailable()) {
      return false;
    }
    let restorationString = window.localStorage.getItem('bbsavegame');
    Message.send("Game Loaded. Restoration String is: " + restorationString);

    let state = JSON.parse(restorationString);
    clearDataStore();
    DATASTORE.GAME = this.game;
    DATASTORE.ID_SEQ = state.ID_SEQ;
    this.game.fromJSON(state.GAME);

    for (let mapID in state.MAPS) {
      let mapData = JSON.parse(state.MAPS[mapID]);

      DATASTORE.MAPS[mapID] = MapMaker(mapData);
      DATASTORE.MAPS[mapID].build();
    }

    console.log('post load');
    console.dir(DATASTORE);
  }

  localStorageAvailable() {
    try {
      var x = '__storage_test__';
      window.localStorage.setItem( x, x);
      window.localStorage.removeItem(x);
      return true;
    }
    catch(e) {
      Message.send('Sorry, no local data storage is available for this browser so game save/load is not possible');
      return false;
    }
  }


}
