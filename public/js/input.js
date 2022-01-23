export default class Input {
  constructor(socket) {
    this.keyStates = {};
    this.keyMap = [32, 37, 39];

    this.keyMap.forEach(keyCode => {
      this.keyStates[keyCode] = 0;
    });

    this.listener(socket);
  }

  listener(socket) {
    ['keydown','keyup'].forEach(eventName => {
      window.addEventListener(eventName, e => {
        if(this.keyMap.indexOf(e.keyCode) == '-1') {
          return;
        }
        e.preventDefault();
        const keyState = e.type === 'keydown' ? 1 : 0;

        if(this.keyStates[e.keyCode] == keyState) {
          return;
        }
        this.keyStates[e.keyCode] = keyState;
        socket.emit('cmd', this.keyStates);
      })
    })
  }
}
