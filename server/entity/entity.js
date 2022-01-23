module.exports = class Entity {
  constructor(posX, posY) {
    this.pos = {
      x: posX,
      y: posY
    }
    this.vel = {
      x: 0,
      y: 0
    }
    this.distance = 0
  }

  info() {
    return {
      'pos': this.pos,
      'vel': this.vel,
      'dir': this.dir,
      'state': this.state,
      'distance': this.distance
    };
  }
}
