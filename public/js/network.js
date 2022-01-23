export default class Network {
  constructor(delay) {
    this.delay = delay;
  }

  init(firstServerTime, firstClientTime) {
    this.firstServerTime = firstServerTime;
    this.firstClientTime = firstClientTime;
  }

  currentServerTime() {
    return this.firstServerTime + (Date.now() - this.firstClientTime) - this.delay;
  }

  getBaseUpdate(gameUpdate) {
    let serverTime = this.currentServerTime();
    for (let i = gameUpdate.length - 1; i >= 0; i--) {
      if (gameUpdate[i].t <= serverTime) {
        return i;
      }
    }

    return -1;
  }

  getCurrentState(gameUpdate) {
    if (!this.firstServerTime) {
      return;
    }

    const frames = ['marioRun1','marioRun2','marioRun3'];
    const base = this.getBaseUpdate(gameUpdate);
    const serverTime = this.currentServerTime();

    if (base < 0 || base === gameUpdate.length - 1) {
      return gameUpdate[gameUpdate.length - 1].data;
    } else {
      const baseUpdate = gameUpdate[base];
      const next = gameUpdate[base + 1];
      const ratio = (serverTime - baseUpdate.t) / (next.t - baseUpdate.t);

      for (let socket_id in baseUpdate.data) {
        baseUpdate.data[socket_id].pos.x = baseUpdate.data[socket_id].pos.x + (next.data[socket_id].pos.x - baseUpdate.data[socket_id].pos.x) * ratio;
        baseUpdate.data[socket_id].pos.y = baseUpdate.data[socket_id].pos.y + (next.data[socket_id].pos.y - baseUpdate.data[socket_id].pos.y) * ratio;
        if (baseUpdate.data[socket_id].is_jump) {
          baseUpdate.data[socket_id].state = 'marioJump';
        } else {
          if (baseUpdate.data[socket_id].is_run) {
            baseUpdate.data[socket_id].distance = baseUpdate.data[socket_id].distance + (next.data[socket_id].distance - baseUpdate.data[socket_id].distance) * ratio;
            let step = Math.floor(baseUpdate.data[socket_id].distance / 24);
            if (baseUpdate.data[socket_id].is_turbo) {
              step = Math.floor(baseUpdate.data[socket_id].distance / 22);
            }
            baseUpdate.data[socket_id].state = frames[step];
          }
        }
      }
      return baseUpdate.data;
    }
  }
}
