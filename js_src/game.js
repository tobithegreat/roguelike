import ROT from 'rot-js';
import * as U from './util.js';
import {StartUpMode} from './ui_mode.js';

export let Game = {
  modes: {
    start: '',
    play: '',
    win: '',
    lose: ''
  },

  display: {
    SPACING: 1.1,
    main: {
      w: 80,
      h: 24,
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
      spacing: this.display.SPACING});

    this.setupModes();
    this.switchMode('startup');
  },

  getDisplay: function (displayId) {
    if (this.display.hasOwnProperty(displayId)) {
      return this.display[displayId].o;
    }
    return null;
  },

  render: function() {
    this.renderMain();
  },

  setupModes: function() {
    this.modes.startup = new StartUpMode();
  },

  switchMode: function(newModeName) {
      if (this.curMode) {
        this.curMode.exit();
      }
      this.curMode = this.modes[newModeName];
      this.curMode.enter();
  },


  renderMain: function() {
    this.curMode.render(this.display.main.o);
    // let d = this.display.main.o;
    // for (let i = 0; i < 10; i++) {
    //   d.drawText(5,i+5,"hello world");
    // }
  },


};


//init
//
//
