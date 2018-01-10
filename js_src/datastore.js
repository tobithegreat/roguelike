export let DATASTORE = {
  GAME: '',
  ID_SEQ: 1,
  MAPS: {}
}

export function clearDataStore() {
  DATASTORE = {
    GAME: '',
    ID_SEQ: 1,
    MAPS: {}
  }
}
