
export default class ModelAnimator {

  constructor(model, visualUpdate, dt = 0, lowestSpeed = 0.01, posAccuracy = 0.1) {
    this.model = model;
    this.dt = dt;
    this.isVModel = false;
    if (typeof model.v !== 'undefined' &&
        model.PID && typeof model.PID.lastError !== 'undefined') {
      this.isVModel = true;
    }
    this.visualUpdate = visualUpdate;
    this.lowestSpeed = lowestSpeed;
    this.posAccuracy = posAccuracy;
    this.intervalTimer = undefined;
    this.animationFrameId = undefined;
    this.lastTime = 0;
    this.tick = this.tick.bind(this);
  }

  tick(time) {
    if (this.dt) {
      this.model.update();
      this.visualUpdate(this.model.pos);
      if (this.isVModel) {
        if (Math.abs(this.model.v) < this.lowestSpeed
            && Math.abs(this.model.PID.lastError) < this.posAccuracy) {
          clearInterval(this.intervalTimer);
          this.intervalTimer = undefined;
          this.reset();
        }
      }
    } else {
      if (!this.lastTime) this.lastTime = time;
      this.model.update((time - this.lastTime) / 1000);
      this.lastTime = time;
      this.visualUpdate(this.model.pos || undefined);
      if (this.isVModel) {
        if (Math.abs(this.model.v) > this.lowestSpeed
            || Math.abs(this.model.PID.lastError) > this.posAccuracy) {
          this.animationFrameId = requestAnimationFrame(this.tick);
        } else {
          this.animationFrameId = undefined;
          this.reset();
        }
      } else {
        this.animationFrameId = requestAnimationFrame(this.tick);
      }
    }
  }

  setTarget(value) {
    if (isNaN(value)) return;
    this.model.setTarget(value);
    if (this.dt) {
      if (!this.intervalTimer) {
        this.intervalTimer = setInterval(this.tick, this.dt);
      }
    } else {
      if (!this.animationFrameId) {
        this.animationFrameId = requestAnimationFrame(this.tick);
      }
    }
  }

  reset() {
    this.lastTime = 0;
    this.model.reset();
  }

  kill() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = undefined;
    }
  }
}
