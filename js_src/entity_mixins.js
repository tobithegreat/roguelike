
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

      if (this.getMap().isPositionOpen(newX, newY)) {
        this.state.x += newX;
        this.state.y += newY;
        this.getMap().updateEntityPosition(this, this.state.x, this.state.y);
        return true;
      }
        return false;
    },

  }
};
