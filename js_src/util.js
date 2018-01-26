import {DATASTORE} from './datastore.js';
import ROT from 'rot-js';

export function utilAlert() {
  document.write("this is a util function<br/>");
}

export function init2DArray(xdim,ydim, initialValue='') {
  let a = [];
  for (let x=0; x<xdim; x++) {
    a.push([]);
    for (let y=0; y<ydim; y++) {
      a[x].push(initialValue);
    }
  }
    return a;
}

export function randomInt(min,max) {
  let range = max - min;
  let offset = Math.floor(ROT.RNG.getUniform()*(range+1));
  return offset+min;
}


let randCharSource = '1234567890abcdefghijklmnopqrstuvwxyz'.split('');
export function uniqueID(tag) {
  let id = '';
  for (let i=0; i < 6; i++) {
    id += randCharSource.random();
  }
  id = `${DATASTORE.ID_SEQ} - ${tag ? tag+'' : ''} - ${id}`;
  DATASTORE.ID_SEQ++;
  return id;
}
