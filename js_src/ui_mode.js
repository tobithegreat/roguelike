import {Message} from './message.js';
import {DisplaySymbol} from './displaySymbol.js';
import {MapMaker} from './Map.js';
import {DATASTORE, clearDataStore} from './datastore.js';
import {EntityFactory} from './entity-template.js';
import {SCHEDULER,TIME_ENGINE,initTiming} from './timing.js';

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
     this.game.switchMode('play');
    }
    return true;
  }


  render(display) {
    display.clear();
    display.drawText(2,2,"rendering "+this.constructor.name);
  }

  renderAvatar(display) {
    display.clear();
  }

}

export class StartUpMode extends UIMode {
  enter() {
    super.enter();
  }

  render(display) {
    display.clear();
    display.drawText(1,1,"game starting");
    display.drawText(1,2,"press any key to play");
  }

  handleInput(eventType, evt) {
    if (eventType == 'keyup') {
    this.game.switchMode('persistence');
    }
    return true;
  }

}
export class PlayMode extends UIMode {
  constructor(thegame) {
    super(thegame);
    this.state = {
      mapID: '',
      camera_map_x: '',
      camera_map_y: '',
      avatarID: ''
    };
  }

  setupNewGame() {
    initTiming();
    console.log("TIMING");
    let a = EntityFactory.create('avatar');
    let m = MapMaker({
      xdim: 40,
      ydim: 40});
    m.addEntityAtRandomPos(a);
    this.state.mapID = m.getID();
    Message.send("building the map...");
    this.game.renderMessage();
    this.state.camera_map_x = 0;
    this.state.camera_map_y = 0;

    this.state.avatarID = a.getID();

    this.moveCameraToAvatar();

    // Populate map with moss
    for (let i = 0; i < 10; i++) {
      let t = EntityFactory.create('moss');
      m.addEntityAtRandomPos(t);
    }

    let key = EntityFactory.create('key');
    m.addEntityAtRandomPos(key);
    console.log("DONE");
  }

  enter() {
    this.game.isPlaying = true;

    Message.send("entering PLAY");
    if (this.state.mapID === '') {
      console.log("SETUP");
      this.game.setupNewGame();
    }
    console.dir(this.state);
    // console.dir(TIME_ENGINE);
    // TIME_ENGINE.unlock();
  }



    //this.cameraSymbol = new DisplaySymbol({chr:'@', fg:'#eb4'});


  toJSON() {
    return JSON.stringify(this.state);
  }

  restoreFromState(stateData) {
    console.log("restoring play state from: ");
    this.state = JSON.parse(stateData);
  }



  render(display) {
    display.clear();
    display.drawText(1,1,"game play");
    display.drawText(1,2,"press Enter to win");
    display.drawText(1,3,"press Escape to lose");
    DATASTORE.MAPS[this.state.mapID].render(display,this.state.camera_map_x,this.state.camera_map_y);
  }


  handleInput(eventType, evt) {
    if (eventType == 'keyup') {
      let avatarMoved = false;

      if (evt.key == "h") {
        this.game.switchMode('win');
      }
      else if (evt.key == 'p') {
        this.game.switchMode('persistence');
        return true;
      }


      // MOVEMENT WITH NUMPAD KEYS
      else if (evt.key == '4' || evt.key == 'a') {
        this.moveAvatar(-1,0);
        return true;
      }
      else if (evt.key == '7') {
        this.moveAvatar(-1, -1);
        return true;
      }
      else if (evt.key == '8' || evt.key == 'w') {
        this.moveAvatar(0, -1);
        return true;
      }
      else if (evt.key == '9') {
        this.moveAvatar(1, -1);
        return true;
      }
      else if (evt.key == '6' || evt.key == 'd') {
        this.moveAvatar(1, 0);
        return true;
      }
      else if (evt.key == '3') {
        this.moveAvatar(1,1);
        return true;
      }
      else if (evt.key == '2' || evt.key == 's') {
        this.moveAvatar(0, 1);
        return true;
      }
      else if (evt.key == '1') {
        this.moveAvatar(-1, 1);
        return true;
      }

    }
    return false;
  }

  moveAvatar(dx,dy) {
    //this.state.camera_map_x += dx;
    //this.state.camera_map_y += dy;
    if (this.getAvatar().tryWalk(dx,dy)) {
      //this.getAvatar().moveBy(dx,dy);
      console.log("move");
      this.moveCameraToAvatar();
      return true;
    }
      console.log("don't move");
    return false;
  }

  moveCameraToAvatar() {
    this.state.camera_map_x = this.getAvatar().getX();
    this.state.camera_map_y = this.getAvatar().getY();
  }

  getAvatar() {
    return DATASTORE.ENTITIES[this.state.avatarID];
  }

  renderAvatar(display) {
    display.clear();
    display.drawText(0,0,"Avatar");
    display.drawText(0,2,"time: " + this.getAvatar().getTime());
    display.drawText(0,4,"Your HP: " + this.getAvatar().getCurHp());
    //display.drawText(0,4,"loc:" + this.getAvatar().getPos());
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
    if (window.localStorage.getItem('bbsavegame')) {
      this.game.hasSaved = true;
      console.log("BBSAVED");
    }
  }

  render(display) {
    display.clear();
    display.drawText(3,2,"N for new game");
    display.drawText(3,3,"S to save game");
    display.drawText(3,4,"R to resume a current game");
    display.drawText(3,5,"L to load previously saved game");
    display.drawText(3,6,"ESC to end game");
  }

  handleInput(eventType, evt) {
    if (eventType == 'keyup') {

      if (evt.key == "n") {
        this.game.setupNewGame();
        this.game.switchMode('play');
        return true;
      }
      else if (evt.key == "s") {
        this.handleSave();
        this.game.switchMode('play');
        return true;
      }
      else if (evt.key == "l") {
        this.handleRestore();

        return true;
      }
      else if (evt.key == "r") {
        Message.send("Resume Game");
        this.game.switchMode("play");
        return true;
      }
      else if (evt.key == "Escape") {
        return true;
      }

    }
    return false;
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

    for (let mapID in state.MAPS) {
      let mapData = JSON.parse(state.MAPS[mapID]);

      DATASTORE.MAPS[mapID] = MapMaker(mapData);
      DATASTORE.MAPS[mapID].build();
    }

    for (let savedEntityId in state.ENTITIES) {
      let entState = JSON.parse(state.ENTITIES[savedEntityId]);
      console.log("templateName: " + entState.templateName);
      EntityFactory.create(entState.templateName,entState);
    }

    this.game.fromJSON(state.GAME);

    this.game.switchMode('play');

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
