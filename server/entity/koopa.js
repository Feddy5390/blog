const Entity = require('./entity.js');

module.exports = class Koopa extends Entity {
  constructor(posX, posY) {
    super(posX, posY)
    this.dir = 1
  }

  runStart() {
    this.runDurationTime = 0
  }

  walk(dt) {
    const SPEED = 100
    const FRAME = 50
    const FRAMES = ['koopa-walk-1','koopa-walk-2']
    this.vel.x = SPEED * this.dir
    this.distance += SPEED * dt

    let frameIndex = Math.floor(this.distance / FRAME)

    if(frameIndex > 1) {
      frameIndex = 0
      this.distance = 0
    }

    this.state = FRAMES[frameIndex]
    if(this.dir == -1) {
      this.state = this.state + '-mirror'
    }
  }

  update(keyStates, dt) {
    this.walk(dt)
    this.pos.x += this.vel.x * dt
  }
}
