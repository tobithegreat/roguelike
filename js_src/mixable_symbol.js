import {DisplaySymbol} from './displaySymbol.js';
import * as E from './entity_mixins.js';

export class MixableSymbol extends DisplaySymbol {
  constructor(template) {
    super(template);
    if (! this.state) { this.state = {}; }

    this.mixins = [];
    this.mixinTracker = {};

    if (template.mixinNames) {
      for (let mi = 0; mi<template.mixinNames.length; mi++) {
        this.mixins.push(E[template.mixinNames[mi]]);
        this.mixinTracker[template.mixinNames[mi]] = true;
      }
    }

    for (let i=0; mi< this.mixins.length; mi++) {
      let m = this.mixins[mi];
      this.state[m.META.stateNamespace] = {};
      for (let sbase in m.META.stateModel) {
        this.state[m.META.stateNamespace][sbase] = m.META.stateModel[sbase];
      }

      for (let method in m.METHODS) {
        this[method] = m.METHODS[method];
      }
    }

  }
}
