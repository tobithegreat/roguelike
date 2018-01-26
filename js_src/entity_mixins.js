import {Message} from './message.js';
import {SCHEDULER,TIME_ENGINE} from './timing.js';
import * as U from './util.js';
import {DATASTORE} from './datastore.js';


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
    addTime: function(t) {
      this.state._TimeTracker.timeTaken += t;
    }
  },

  LISTENERS: {
    'turnTaken': function(evtData) {
      console.log("turn");
      this.addTime(evtData.timeUsed);
    }
  }
};

export let KillTracker = {
  META: {
    mixinName: 'KillTracker',
    mixinGroup: 'Tracker',
    stateNamespace: '_KillTracker',
    stateModel: {
      killCounter: 0
    }
  },
  METHODS: {
    getNumKills: function() {
      return this.state._KillTracker.killCounter;
    }
  },
  LISTENERS: {
    'kills': function(evtData) {
      this.state._KillTracker.killCounter++;
    }
  }
};

export let PlayerMessager = {
  META: {
    mixinName: 'PlayerMessager',
    mixinGroupName: 'PlayerMessager',
    stateModel: {

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
      retu
    },

    'damagedBy': function(evtData) {
      Message.send(`${this.getName()} took ${evtData.damageAmount} from ${evtData.damageSrc.getName()}`);
    },

    'damages': function(evtData) {
      Message.send(`${this.getName()} dealt ${evtData.damageAmount} to ${evtData.target.getName()}`);
    },
    'killed': function(evtData) {
      Message.send(`${this.getName()} killed by ${evtData.killer.getName()}`);
    },
    'kills': function(evtData) {
      Message.send(`${this.getName()} kills ${evtData.kills.getName()}`);
    }
  }
};

export let MeleeAttacker = {
  META: {
    mixinName: 'MeleeAttacker',
    mixinGroupName: 'BumpActivated',
    stateNamespace: '_MeleeAttacker',
    stateModel: {
      meleeHit: 0,
      meleeDamage: 0
    },
    initialize: function(template) {
      this.state._MeleeAttacker.meleeHit = template.meleeHit || 1;
      this.state._MeleeAttacker.meleeDamage = template.meleeDamage || 1;
    }
  },
  METHODS:{
    getMeleeHit: function() {
      return this.state._MeleeAttacker.meleeHit;
    },
    setMeleeHit: function(h) {
      this.state._MeleeAttacker.meleeHit = h;
    },
    getMeleeDamage: function() {
      return this.state._MeleeAttacker.meleeDamage;
    },
    setMeleeDamage: function(d) {
      this.state._MeleeAttacker.meleeDamage = d;
    },
  },

  LISTENERS: {
    'bumpEntity': function(evtData) {
      evtData.target.raiseMixinEvent('damagedBy',{'damageSrc': this, 'damageAmount':this.getMeleeDamage()});
      //return evtResp;
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
      this.state._HitPoints.curHp = template.curHp || this.state._HitPoints.maxHp;
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
      this.state._HitPoints.curHp -= dHP;
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
    'damagedBy': function(evtData) {
      this.loseHp(evtData.damageAmount);
      evtData.damageSrc.raiseMixinEvent('damages',
      {target: this, damageAmount:evtData.damageAmount});
      if (this.getCurHp() == 0) {
        this.raiseMixinEvent("killed", {'killer':evtData.damageSrc});
        evtData.damageSrc.raiseMixinEvent("kills",{'kills':this});
      }
    },
    'killed': function(evtData) {
      this.destroy();
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
    tryWalk: function(dx,dy) {
      let newX = this.getX()*1 + dx*1;
      let newY = this.getY()*1 + dy*1;
      // console.log("newX: " + newX + " newY: " + newY);
      // console.log("dx: " + dx + " dy: " + dy);
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
      // console.dir(targetPositionInfo);
      if (targetPositionInfo.entity) {
        this.raiseMixinEvent('bumpEntity',{target: targetPositionInfo.entity});
        return false;
      } else if (targetPositionInfo.tile.isImpassable()) {
        this.raiseMixinEvent('movementBlocked', {reason: 'Theres something in the way'});
        return false;
      }
      this.getMap().updateEntityPosition(this, newX, newY);
      this.raiseMixinEvent('turnTaken', {timeUsed: 1, turnAction:"walk"});
        // this.state.x = newX;
        // this.state.y = newY;


        return true;
    },
  },
  LISTENERS: {
    'walkAttempt': function(evtData) {
      this.tryWalk(evtData.dx,evtData.dy);
    }
  }

};

export let ActorWanderer = {
  META:{
    mixinName: 'ActorWanderer',
    mixinGroupName: 'Actor',
    stateNamespace: '_ActorWanderer',
    stateModel: {
      baseActionDuration: 1000,
      actingState: false,
      currentActionDuration: 1000
    },
    initialize: function(template) {
      SCHEDULER.add(this,true,U.randomInt(2,this.state._ActorWanderer.baseActionDuration));
    }
  },
  METHODS:{
    getBaseActionDuration: function () {
      return this.state._ActorWanderer.baseActionDuration;
    },
    setBaseActionDuration: function (n) {
      this.state._ActorWanderer.baseActionDuration = n;
    },
    getCurrentActionDuration: function () {
      return this.state._ActorWanderer.currentActionDuration;
    },
    setCurrentActionDuration: function (n) {
      this.state._ActorWanderer.currentActionDuration = n;
    },
    isActing: function (state) {
      if (state !== undefined) {
        this.state._ActorWanderer.actingState = state;
      }
      return this.state._ActorWanderer.actingState;
    },
    act: function () {
      if (this.isActing()) { return; } // a gate to deal with JS timing issues
      this.isActing(true);

      // do wandering here
      let dx = U.randomInt(-1,1);
      let dy = U.randomInt(-1,1);
      // console.log(`wandering attempting walk: ${dx},${dy}`);
      if (dx != 0 || dy !=0) {
        this.raiseMixinEvent('walkAttempt',{'dx':dx,'dy':dy});
      }
      // TIME_ENGINE.lock();
      SCHEDULER.setDuration(this.getCurrentActionDuration());
      this.setCurrentActionDuration(this.getBaseActionDuration()+U.randomInt(-5,5));
      this.isActing(false);
    }
  },
  LISTENERS:{
    'actionDone': function(evtData) {
      // TIME_ENGINE.unlock();
      console.log("end wanderer acting");
    }
  }
};
