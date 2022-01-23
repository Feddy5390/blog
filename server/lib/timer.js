module.exports = class Timer {
  constructor() {
    const tick = 60
    this.tickLenMs = 1 / tick
    this.tickLenMu = 1000 / tick * 1e3
    this.maxWaitMu = ((1000 / tick) - 4) * 1e3
    this.previousTick = this.getNowMu()
    this.nextTime = this.previousTick
  }

  getNowMu() {
    let hrtime = process.hrtime()
    return hrtime[0] * 1e6 + hrtime[1] * 1e-3
  }

  loop(update) {
    let now = this.getNowMu()
    let dt = now - this.previousTick

    if(dt >= this.tickLenMu) {
      update(this.tickLenMs)
      this.previousTick = now
      this.nextTime = this.previousTick + this.tickLenMu
    }

    if(this.nextTime - this.getNowMu() >= this.maxWaitMu) {
      setTimeout(() => {
        this.loop(update, this.maxWaitMu)
      })
    } else {
      setImmediate(() => {
        this.loop(update)
      })
    }
  }
}
