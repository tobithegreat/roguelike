import {Factory} from './factory.js';
import {Entity} from './entity.js';
import {MixableSymbol} from './entity_mixins.js';

export let EntityFactory = new Factory(Entity, 'ENTITIES');

EntityFactory.learn({
  'name': 'avatar',
  'chr': '@',
  'fg': '#eb4',
  'mixinName': ['TimeTracker', 'WalkerCorporeal']
});
