import PIDController from 'node-pid-controller';

export default class VelocityModel {

  constructor(P, D, dt=1, args) {
    this.min = (args && args.minStopAngle) || 2;
    this.max = (args && args.maxStopAngle) || 358;
    // this.maxVelocity = (args && args.maxVelocity) || 0.5; // TODO: ??
    this.dt = dt;
    this.dt2 = 0.5 * dt * dt;
    this.v = 0;
    this.pos = 0; //(args && args.start) ||
    this.PID = new PIDController(P, 0, D, dt);
  }

  update() {
    // TODO: introduce optional friction somehow?
    const force = this.PID.update(this.pos);
    this.v += force * this.dt;
    this.pos += this.v * this.dt;// + this.dt2*force;
    if (this.pos < this.min) {
      this.v = 0;
      this.pos = this.min;
    }
    if (this.pos > this.max) {
      this.v = 0;
      this.pos = this.max;
    }
  }

  setTarget(pos) {
    this.PID.setTarget(pos);
  }
}
