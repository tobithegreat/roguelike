import {Factory} from './factory.js';
import {Entity} from './entity.js';


export let EntityFactory = new Factory(Entity, 'ENTITIES');

EntityFactory.learn({
  'name': 'avatar',
  'chr': '@',
  'fg': '#eb4',
  'mixinNames': ['TimeTracker', 'WalkerCorporeal', 'PlayerMessager']
});

EntityFactory.learn({
  name: 'moss',
  descr: 'a patch of tiny, fuzzy-looking plants',
  chr: '%',
  fg: '#3a4',
  maxHp: 1,
  mixins: ["HitPoints"]
});
