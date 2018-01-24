import ROT from 'rot-js';
import * as U from './util.js';
import {StartUpMode, PersistenceMode, PlayMode, WinMode, LoseMode} from './ui_mode.js';
import {Message} from './message.js';
import {DATASTORE} from './datastore.js';

export let Game = {
  modes: {
    start: '',
    persistence: '',
    play: '',
    win: '',
    lose: ''
  },

  curMode: '',
  display: {
    SPACING: 1.1,
    main: {
      w: 80,
      h: 24,
      o: null
    },
    avatar: {
      w: 20,
      h: 24,
      o: null
    },
    message: {
      w: 100,
      h: 6,
      o: null
    }
  },

  init: function() {

    //this._randomSeed = 76250;
    console.log("using random seed "+this._randomSeed);


    this.display.main.o = new ROT.Display({
      width: this.display.main.w,
      height: this.display.main.h,
      spacing: this.display.SPACING
    });

    this.display.message.o = new ROT.Display({
      width: this.display.message.w,
      height: this.display.message.h,
      spacing: this.display.SPACING
    });

    this.display.avatar.o = new ROT.Display({
      width: this.display.avatar.w,
      height: this.display.avatar.h,
      spacing: this.display.SPACING
    });

    this.setupModes();
    DATASTORE.GAME = this;
    Message.send("This is a message");
    this.switchMode('start');

  },

  devDumpDataStore() {
    console.dir(DATASTORE);
  },

  getDisplay: function (displayId) {
    if (this.display.hasOwnProperty(displayId)) {
      return this.display[displayId].o;
    }
    return null;
  },

  render: function() {
    this.renderAvatar();
    this.renderMain();
    this.renderMessage();
  },

  renderAvatar: function() {
    let d = this.display.avatar.o;
    for (let i = 0; i < 10; i++) {
      d.drawText(5,i+5,"avatar");
    }
  },

  renderDisplayMain: function() {
    this._display.main.o.clear();
    if (this._curMode === null || this._curMode == '') {
      return;
    } else {
      this._curMode.render();
    }
  },

  renderMessage: function() {
    console.log("render Message");
    Message.render(this.display.message.o);
  },

  setupModes: function() {
    this.modes.start = new StartUpMode(this);
    this.modes.persistence = new PersistenceMode(this);
    this.modes.play = new PlayMode(this);
    this.modes.win = new WinMode(this);
    this.modes.lose = new LoseMode(this);
  },

  switchMode: function(newModeName) {
      if (this.curMode) {
        this.curMode.exit();
      }
      this.curMode = this.modes[newModeName];
      this.curMode.enter();
  },

  setupNewGame: function() {
    this._randomSeed = 5 + Math.floor(Math.random()*100000);
    ROT.RNG.setSeed(this._randomSeed);
    console.dir(this.modes);
    this.modes.play.setupNewGame();
  },


  renderMain: function() {
    console.log("renderMessage");
    this.curMode.render(this.display.main.o);
    // let d = this.display.main.o;
    // for (let i = 0; i < 10; i++) {
    //   d.drawText(5,i+5,"hello world");
    // }
  },

  renderAvatar: function() {
    console.log("renderMessage");
    this.curMode.renderAvatar(this.display.avatar.o);
    // let d = this.display.main.o;
    // for (let i = 0; i < 10; i++) {
    //   d.drawText(5,i+5,"hello world");
    // }
  },

  bindEvent: function(eventType) {
    window.addEventListener(eventType, (evt) => {
      this.eventHandler(eventType, evt);
    });
  },

  eventHandler: function (eventType, evt) {
    // When an event is received have the current ui handle it
    if (this.curMode !== null && this.curMode != '') {
      if (this.curMode.handleInput(eventType, evt)) {
        this.render();
        //Message.ageMessages();
      }
    }
  },

  toJSON: function() {
    let json = '';
    json = JSON.stringify({
      rseed: this._randomSeed,
      playModeState: this.modes.play
    });
    return json;
  },

  fromJSON: function(json) {
    console.log('game from json processing: ' +json);
    let state = JSON.parse(json);
    this._randomSeed = state.rseed;
    ROT.RNG.setSeed(this._randomSeed);

    this.modes.play.restoreFromState(state.playModeState);
  }
};


//init
//
//
