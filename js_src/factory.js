// A general factory system - objects that create other objects
import {DATASTORE} from './datastore.js';

export class Factory {
  constructor(productClass, datastoreNamespace) {
    this.productClass = productClass;
    this.datastoreNamespace = datastoreNamespace;
    this.knownTemplates = {};
  }


  learn(template) {
    this.knownTemplates[template.templateName ? template.templateName : template.name] = template;
  }

  create(templateName, restorationState) {
    let p = new this.productClass(this.knownTemplates[templateName]);
    if (restorationState) {
      p.fromState(restorationState);
    }
    DATASTORE[this.datastoreNamespace][p.getID()] = p;
    return p;
    // let product = new this.productClass(this.knownTemplates[templateName]);
    // DATASTORE[this.datastoreNamespace][product.getID()] = product;
    // return product;
  }
}
