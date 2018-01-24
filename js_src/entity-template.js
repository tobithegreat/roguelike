import {Factory} from './factory.js';
import {Entity} from './entity.js';


export let EntityFactory = new Factory(Entity, 'ENTITIES');

EntityFactory.learn({
  'name': 'avatar',
  'chr': '@',
  'fg': '#eb4',
  maxHp: 10,
  'mixinNames': ['TimeTracker', 'WalkerCorporeal', 'PlayerMessager', 'MeleeAttacker', 'HitPoints']
});

EntityFactory.learn({
  name: 'moss',
  descr: 'a patch of tiny, fuzzy-looking plants',
  chr: '%',
  fg: '#3a4',
  maxHp: 2,
  'mixinNames': ["HitPoints", 'MeleeAttacker', "ActorWanderer","WalkerCorporeal"]
});

EntityFactory.learn({
  name: 'key',
  descr: 'a key to open the next level',
  chr: '^',
  fg: '#00f',
  maxHp: 1,
  'mixinNames': ["HitPoints", 'MeleeAttacker']
});
