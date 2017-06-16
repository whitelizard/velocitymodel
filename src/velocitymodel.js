import PIDController from './node-pid-controller';

export default class VelocityModel {
  constructor({
    P = 100,
    I = 0,
    D = 10,
    dt = 0,
    min = -Infinity,
    max = Infinity,
    start = 0,
    circular = false,
    maxV = Infinity,
  }) {
    this.dt = dt;
    this.min = min;
    this.max = max;
    this.maxV = maxV;
    this.circular = circular;
    this.interval = this.max - this.min;
    this.halfInterval = this.interval / 2;
    // this.maxVelocity = (args && args.maxVelocity) || 0.5; // TODO: ??
    // this.dt2 = 0.5 * dt * dt;
    this.v = 0;
    this.pos = start;
    this.PID = new PIDController(P, I, D, dt);
  }

  update(deltaT) {
    // TODO: introduce optional friction somehow?
    const dt = deltaT || this.dt;
    const force = this.PID.update(this.pos);
    this.v += force * dt; // + this.dt2*force;
    if (Math.abs(this.v) > this.maxV) {
      this.v = this.maxV * this.v / Math.abs(this.v);
    }
    this.pos += this.v * dt;
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
      let t = target;
      if (target > this.max) {
        t = this.min + (target - this.max) % this.interval;
      } else if (target < this.min) {
        t = this.max - (this.min - target) % this.interval;
      }
      const error = t - this.pos;
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

  reset() {
    this.v = 0;
    this.PID.reset();
  }
}
