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
      Message.send("Can't walk there because "+evtData.reason);
      return {};
    },

    'attacks': function(evtData) {
      Message.send(this.getName()+  "attacks" +evtData.target);
    },

    'damages': function(evtData) {
      Message.send(this.getName() + " deals "+evtData.damageAmount+ " damage to"
      + evtData.target.getName());
    }
  }
};

export let MeleeAttacker = {
  META: {
    mixinName: 'MeleeAttacker',
    mixinGroupName: 'Attacker',
    stateNamespace: '_TimeTracker',
    stateModel: {
      timeTaken: 0
    }
  },
  METHODS:{
    getMeleeDamage: function() {
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
    'bumpEntity': function(evtData) {
      evtData.target.raiseMixinEvent('damaged', {src:this, damageAmount:this.getDama})
    }
  }
};

export let HitPoints = {
  META: {
    mixinName: 'HitPoints',
    mixinGroupName: 'HitPoints',
    stateNamespace: '_HitPoints',
    stateModel: {
      curHp: 0,
      maxHp: 0
    },
    initialize: function(template) {
      this.state._HitPoints.maxHp = template.maxHp || 1;
      this.state._HitPoints.curHp = template.curHp || this.state_HitPoints.maxHp;
    }
  },
  METHODS:{
    setHp: function(newHP) {
      this.state._HitPoints.curHp = newHP;
    },
    gainHp: function(dHP) {
      if (dHP < 0) { return; }
      this.state._HitPoints.curHp = Math.min(this.state._HitPoints.curHp+dHP, this.state._HitPoints.maxHp);
    },
    loseHp: function(dHP) {
      if (dHP < 0) {return;}
      this.state._HitPoints.curHp -= dHp;
    },
    setMaxHp: function(newMaxHP) {
      this.state._HitPoints.maxHp = newMaxHP;
    },
    getCurHp: function() {
      return this.state._HitPoints.curHp;
    },
    getMaxHp: function() {
      return this.state._HitPoints.maxHp;
    },
  },

  LISTENERS: {
    'walkedBlocked': function(evtData) {
      this.addTime(evtData.timeUsed);
    },
    'damaged': function(evtData) {
      this.loseHp(evtData.damageAmount);
      evtData.src.raiseMixinEvent('damages',
      {target: this, damageAmount:evtData.damageAmount});
      if (this.getHp() == 0) {
        this.raiseMixinEvent("killedBy", {'killer':evtData.damageSrc});
      }
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

      // if (this.getMap().isPositionOpen(newX, newY)) {
      //   this.state.x += newX;
      //   this.state.y += newY;
      //   this.getMap().updateEntityPosition(this, this.state.x, this.state.y);
      //
      //   this.raiseMixinEvent('turnTaken', {timeUsed: 1});
      //
      //   return true;
      // }

      let targetPositionInfo = this.getMap().getTargetPositionInfo(newX,newY);
      if (targetPositionInfo.entity) {
        this.raiseMixinEvent('bumpEntity',
        {actor:this, target:target.targetPositionInfo.entity});
      } else if (targetPositionInfo.tile.isImpassable()) {
        this.raiseMixinEvent('walkBlocked', {reason: 'Theres something in the way'});
        return false
      } else {
        this.state.x = newX;
        this.state.y = newY;
      }
        return false;
    },
  },
  LISTENERS: {

  }

};

export let ActorWanderer = {
  META: {
    mixinName: 'ActorWanderer',
    mixinGroupName: 'Actor',
    stateNamespace: '_ActorWanderer',
    stateModel: {
      baseActionDuration: 1000,
      actingState: false,
      currentActionDuration: 1000
    },
    initialize: function() {
      SCHEDULER.add(this, true, randomInt(2, this.getBaseActionDuration()));
    }
  },
  METHODS:{
    act: function(p) {
      TIME_ENGINE.lock();
      let dx = randomInt(-1,1);
      let dy = randomInt(-1,1);
      this.raiseMixinEvent("walkAttempt", {'dx': dx, 'dy': dy});
      TIME_ENGINE.unlock;
    }
  }
};
