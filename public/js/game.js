import Loader from "./loader.js";
import Render from "./render.js";
import Input from './input.js';
import Network from './network.js';
import {drawGrid} from "./function.js";

// init
const SOCKET = io.connect();
const CANVAS = document.querySelector('#canvas');
const CTX = CANVAS.getContext('2d');
const CUBE = {'x': 25, 'y': 15, 'px': 64};
CANVAS.width = CUBE.x * CUBE.px;
CANVAS.height = CUBE.y * CUBE.px;
const DELAY = 50;

const _render = new Render(CUBE);
const _loader = new Loader();
const _input = new Input(SOCKET);
const _network = new Network(DELAY);
let gameUpdate = [];
let firstServerTime = 0;
let firstClientTime = 0;

// my info
let myinfo = {};

let camera = {
  'pos': 0
};

(async () => {
  
  await _loader.loading(CUBE, '/json/tileset.json', 'json/1-1.json');
  let s = _loader.levelBuffer;
  console.log(s.width, s.height);

  // SOCKET.emit('createRoom', {
  //   keyStates: _input.keyStates
  // });

  // SOCKET.emit('join', {
  //   keyStates: _input.keyStates
  // });

  SOCKET.on('returnJoin', mySocketId => {
    console.log('ID[' + mySocketId + ']加入遊戲');
    myinfo.socketId = mySocketId;

    SOCKET.emit('really');
  })

  SOCKET.on('gameStart', update => {
    console.log('遊戲開始');
    gameUpdate.push(update);
    requestAnimationFrame(main);
  })

  SOCKET.on('serverUpdate', update => {
    if(!firstServerTime) {
      firstServerTime = update.t;
      firstClientTime = Date.now();
      _network.init(firstServerTime, firstClientTime, DELAY);
    }

    gameUpdate.push(update);
    let base = _network.getBaseUpdate(gameUpdate);
    if(base > 0) {
      gameUpdate.splice(0, base);
    }
  })

  SOCKET.on('msg', msg => {
    const text = {
      'size': '30px',
      'family': 'colorcontentposXposY',
      'color': '#d54b00',
      'content': msg,
      'posX': 20,
      'posY': 20
    };
    _render.drawText(CTX, text);
  })

  function main() {
    // CTX.clearRect( 0, 0, CANVAS.width, CANVAS.height);

    let players = _network.getCurrentState(gameUpdate);

    if(typeof players === null || Object.keys(players).length == 0) {
      requestAnimationFrame(main);
      return false;
    }

    if(players[myinfo.socketId].pos.x > 200) {
      camera.pos = players[myinfo.socketId].pos.x - 200;
    }

    s.forEach((item, i) => {
      // let drawPosX = item.
      CTX.drawImage(
        item,
        0, 0, item.width, item.height,
        0, 0, item.width, item.height
      );
    });

    drawGrid(CANVAS, CTX, CUBE.px, 'red', 1);

    for (let uid in players) {
      let frameIndex = players[uid].state;
      let mario = _loader.resource.get(frameIndex);
      CTX.drawImage(
        mario,
        0, 0, mario.width, mario.height,
        players[uid].pos.x - camera.pos, players[uid].pos.y, mario.width, mario.height
      );
    }
    requestAnimationFrame(main);
  }
})();
