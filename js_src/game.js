import ROT from 'rot-js';
import * as U from './util.js';
import {StartUpMode, PersistenceMode, PlayMode, WinMode, LoseMode} from './ui_mode.js';
import {Message} from './message.js';

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
    this._randomSeed = 5 + Math.floor(Math.random()*100000);
    //this._randomSeed = 76250;
    console.log("using random seed "+this._randomSeed);
    ROT.RNG.setSeed(this._randomSeed);

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

    this.setupModes();
    Message.send("This is a message");
    this.switchMode('start');
  },

  getDisplay: function (displayId) {
    if (this.display.hasOwnProperty(displayId)) {
      return this.display[displayId].o;
    }
    return null;
  },

  render: function() {
    this.renderMain();
    this.renderMessage();
  },

  renderDisplayAvatar: function() {
    let d = this._display.avatar.o;
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


  renderMain: function() {
    console.log("renderMessage");
    this.curMode.render(this.display.main.o);
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


};


//init
//
//
