class GameMessage {
  constructor() {
    this.message = '';
  }

  render(targetDisplay) {
    targetDisplay.clear();
    targetDisplay.drawText(1,1,(this.message));
  }

  send(msg) {
    this.message = '';
    this.message = msg;
  }

  clear() {
    this.message = '';
  }

}

 export let Message = new GameMessage();
