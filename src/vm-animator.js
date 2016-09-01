
export default class VelocityModelAnimator {

  constructor(velocityModel, visualUpdate, lowestSpeed = 0.01, posAccuracy = 0.1) {
    this.velocityModel = velocityModel;
    this.visualUpdate = visualUpdate;
    this.lowestSpeed = lowestSpeed;
    this.posAccuracy = posAccuracy;
    this.timer = undefined;
    this.tick = this.tick.bind(this);
  }

  tick() {
    this.velocityModel.update();
    this.visualUpdate();
    if (Math.abs(this.velocityModel.v) < this.lowestSpeed
        && Math.abs(this.velocityModel.PID.lastError) < this.posAccuracy) {
      this.kill();
    }
  }

  // TODO: Future --> Use requestAnimationFrame instead of setInterval, but need to handle dt ?!
  // animate() {
  //   this.animationFrameId = requestAnimationFrame(::this.animate);
  //   this.render();
  // }

  setTarget(value) {
    if (isNaN(value)) return;
    this.velocityModel.setTarget(value);
    if (!this.timer) {
      this.timer = setInterval(this.tick, this.velocityModel.dt * 1000);
    }
  }

  kill() {
    clearInterval(this.timer);
    this.timer = undefined;
  }
}
