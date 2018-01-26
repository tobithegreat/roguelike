import {DisplaySymbol} from './displaySymbol.js';
import * as E from './entity_mixins.js';

export class MixableSymbol extends DisplaySymbol {
  constructor(template) {
    super(template);
    if (! this.state) { this.state = {}; }

    this.mixins = [];
    this.mixinTracker = {};

    // record/track any mixins this entity has
    console.log("creating mixable symbol from this template:");
    console.dir(template);

    if (template.mixinNames) {
      for (let mi = 0; mi<template.mixinNames.length; mi++) {
        console.log(template.mixinNames[mi]);
        this.mixins.push(E[template.mixinNames[mi]]);
        this.mixinTracker[template.mixinNames[mi]] = true;
      }
    }

    // set up mixin state
    for (let mi=0; mi< this.mixins.length; mi++) {
      let m = this.mixins[mi];
      if (m.META.stateNamespace) {
        this.state[m.META.stateNamespace] = {};
      }
        if (m.META.stateModel) {
          for (let sbase in m.META.stateModel) {
            this.state[m.META.stateNamespace][sbase] = m.META.stateModel[sbase];
          }
        }


        if (m.METHODS) {
          for (let method in m.METHODS) {
            this[method] = m.METHODS[method];
          }
        }
      }

      // initialize mixins after all attributes, functions, listeners, etc. are in place
      for (let mi = 0; mi < this.mixins.length; mi++) {
        let mixin = this.mixins[mi];
        if (mixin.META.hasOwnProperty('initialize')) {
          mixin.META.initialize.call(this,template);
        }
      }
    }

    raiseMixinEvent(evtLabel, evtData) {
      for (let mi = 0; mi<this.mixins.length; mi++) {
        let m = this.mixins[mi];
        if (m.LISTENERS && m.LISTENERS[evtLabel]) {
          m.LISTENERS[evtLabel].call(this, evtData);
        }
      }
    }

    hasMixin(checkThis) {
      if (typeof checkThis == 'object') {
        return this.mixinTracker.hasOwnProperty(checkThis.META.mixinName);
      } else {
        return this.mixinTracker.hasOwnProperty(checkThis);
      }
    }
  }
