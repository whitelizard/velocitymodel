import PIDController from 'node-pid-controller';

export default class VelocityModel {

  constructor(P, D, dt = 1, args) {
    this.min = (args && args.min) || 0;
    this.max = (args && args.max) || 100;
    this.interval = this.max - this.min;
    this.halfInterval = this.interval / 2;
    this.circular = (args && args.circular) || false;
    // this.maxVelocity = (args && args.maxVelocity) || 0.5; // TODO: ??
    this.dt = dt;
    // this.dt2 = 0.5 * dt * dt;
    this.v = 0;
    this.pos = 0; // (args && args.start) ||
    this.PID = new PIDController(P, 0, D, dt);
  }

  update() {
    // TODO: introduce optional friction somehow?
    const force = this.PID.update(this.pos);
    this.v += force * this.dt;
    this.pos += this.v * this.dt;// + this.dt2*force;
    if (this.circular) {
      if (!this.inside(this.PID.target)) {
        // if we are in the state of a target outside the interval,
        // check if this.pos also is outside now => correct both
        if (this.pos < this.min) {
          this.PID.setTarget(this.PID.target + this.interval);
          this.pos += this.interval;
        } else if (this.pos > this.max) {
          this.PID.setTarget(this.PID.target - this.interval);
          this.pos -= this.interval;
        }
      }
    } else {
      if (this.pos < this.min) {
        this.v = 0;
        this.pos = this.min;
      }
      if (this.pos > this.max) {
        this.v = 0;
        this.pos = this.max;
      }
    }
    return this.pos;
  }

  inside(pos) {
    return pos < this.max && pos > this.min;
  }

  setTarget(target) {
    if (this.circular) {
      const error = target - this.pos;
      const absError = Math.abs(error);
      if (absError < this.interval - absError) {
        this.PID.setTarget(this.pos + error);
      } else {
        this.PID.setTarget(this.pos + Math.sign(-error) * (this.interval - absError));
      }
    } else {
      this.PID.setTarget(target);
    }
  }
}
