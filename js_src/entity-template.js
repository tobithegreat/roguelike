import {Factory} from './factory.js';
import {Entity} from './entity.js';


export let EntityFactory = new Factory(Entity, 'ENTITIES');

EntityFactory.learn({
  'name': 'avatar',
  'chr': '@',
  'fg': '#eb4',
  'mixinNames': ['TimeTracker', 'WalkerCorporeal', 'PlayerMessager']
});
