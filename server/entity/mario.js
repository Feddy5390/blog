const Entity = require('./entity.js');

module.exports = class Mario extends Entity {
  constructor(posX, posY) {
    super(posX, posY)
    this.dir = 1
    this.isJump = false
    this.jumpCancel()

    this.vel.x = 0
  }

  run(dt) {
    const SPEED = 400
    const TURBO = 1200
    const FRAME_SLOW = 30
    const FRAME_QUICK = 9
    const FRAMES = ['mario-run-1','mario-run-2','mario-run-3']

    let displacement = Math.abs(this.vel.x)
    this.vel.x = this.vel.x + SPEED * dt * this.dir
    this.distance += displacement

    // frame index
    let frameIndex = Math.floor(this.distance / FRAME_SLOW)
    if(frameIndex > 2) {
      frameIndex = 0
      this.distance = 0
    }
    if(!this.isJump) {
      this.state = FRAMES[frameIndex]
      if(this.dir == -1) {
        this.state = this.state + '-mirror'
      }
    }
  }

  jumpStart() {
    if(!this.canJump) return
    const POWER = 2200
    this.vel.y = -POWER
    this.state = 'mario-jump'
    if(this.dir == -1) {
      this.state = 'mario-jump-mirror'
    }
    this.isJump = true
    this.canJump = false
    this.jumpEngageTime = 0
  }

  jumpUpdate(dt) {
    const GRAVITY = 200
    // this.vel.y = this.vel.y + GRAVITY * this.jumpEngageTime
    // this.jumpEngageTime += dt
      this.vel.y = this.vel.y + GRAVITY
  }

  jumpCancel() {
    this.vel.y = 0
    this.jumpEngageTime = 0
  }

  update(keyStates, dt) {
    if(keyStates['37']) {
      if(this.dir == 1) {
        this.distance = 0
      }
      this.dir = -1
    }

    if(keyStates['39']) {
      if(this.dir == -1) {
        this.distance = 0
      }
      this.dir = 1
    }

    if(keyStates['37'] || keyStates['39']) {
      this.run(dt)
    }

    if((keyStates['37'] && keyStates['39']) || (!keyStates['37'] && !keyStates['39'])) {
      this.distance = 0
      this.vel.x = 0
      if(!this.isJump) {
        this.state = 'mario-idle'
        if(this.dir == -1) {
          this.state = this.state + '-mirror'
        }
      }
    }

    if(keyStates['32']) {
      this.jumpStart()
    } else {
      this.canJump = true
    }

    this.jumpUpdate(dt)

    this.pos.x += this.vel.x * dt
    this.pos.y += this.vel.y * dt

    // COLLITION
    if(this.pos.y > 832) {
      this.pos.y = 832
      this.jumpCancel()
      this.isJump = false
    }

    // console.dir(this)
  }
}
