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

let randCharSource = '1234567890abcdefghijklmnopqrstuvwxyz'.split('');
export function uniqueID() {
  let id = '';
  for (let i=0; i < 6; i++) {
    id += randCharSource.random();
  }
  return id;
}
