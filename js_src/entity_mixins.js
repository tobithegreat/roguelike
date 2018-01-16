import {Message} from './message.js';

export let _exampleMixin = {
  META: {
    mixinName: 'ExampleMixin',
    mixinGroupName: 'ExampleMixinGroup',
    stateNamespace: '_ExampleMixin',
    stateModel: {
      foo: 10
    },
    initialize: function() {

    }
  },
  METHODS:{
    method1: function(p) {

    }
  }
};

export let TimeTracker = {
  META: {
    mixinName: 'TimeTracker',
    mixinGroupName: 'Tracker',
    stateNamespace: '_TimeTracker',
    stateModel: {
      timeTaken: 0
    }
  },
  METHODS:{
    getTime: function() {
      return this.state._TimeTracker.timeTaken;
    },
    setTime: function(t) {
      this.state._TimeTracker.timeTaken = t;
    },
    addTime: function(p) {
      this.state._TimeTracker.timeTaken += t;
    }
  },

  LISTENERS: {
    'turnTaken': function(evtData) {
      this.addTime(evtData.timeUsed);
    }
  }
};

export let PlayerMessager = {
  META: {
    mixinName: 'PlayerMessager',
    mixinGroupName: 'Message',
    stateModel: {
      timeTaken: 0
    }
  },

  LISTENERS: {
    'turnTaken': function(evtData) {
      Message.send(evtData.turnAction);
      return {};
    },

    'movementBlocked': function(evtData) {
      Message.send(`${this.getName()} cannot move there because ${evtData.reasonBlocked}`);
      return {};
    }
  }
};

export let HitPoints = {
  META: {
    mixinName: 'HitPoints',
    mixinGroupName: 'Points',
    stateModel: {
      timeTaken: 0
    }
  },
  METHODS:{
    getTime: function() {
      return this.state._TimeTracker.timeTaken;
    },
    setTime: function(t) {
      this.state._TimeTracker.timeTaken = t;
    },
    addTime: function(p) {
      this.state._TimeTracker.timeTaken += t;
    }
  },

  LISTENERS: {
    'walkedBlocked': function(evtData) {
      this.addTime(evtData.timeUsed);
    }
  }
};

export let WalkerCorporeal = {
  META: {
    mixinName: 'WalkerCorporeal',
    mixinGroupName: 'Walker',
    stateNamespace: '_WalkerCorporeal',
    stateModel: {
    },
    initialize: function() {

    }
  },
  METHODS:{
    tryWalk: function() {
      let newX = this.state.x*1 + dx*1;
      let newY = this.state.y*1 + dy*1;
      let md = this.getMap().getMapDataAt(newX,newY);
      if (md.entity) {
        this.raiseMixinEvent('movementBlocked', {'reasonBlocked': 'the space is occupied'});
        return false;
      }

      if (md.tile.isImpassable()) {
        this.raiseMixinEvent('movementBlocked', {'reasonBlocked': 'the space is impassable'});
        return false;
      }

      this.getMap().moveEntityTo(this,newX,newY);
      this.raiseMixinEvent('turnTaken', {timeUsed: 1});
      return true;
      // if (this.getMap().isPositionOpen(newX, newY)) {
      //   this.state.x += newX;
      //   this.state.y += newY;
      //   this.getMap().updateEntityPosition(this, this.state.x, this.state.y);
      //
      //   this.raiseMixinEvent('turnTaken', {timeUsed: 1});
      //
      //   return true;
      // }
        return false;
    },

  }
};
