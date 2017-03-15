import { expect } from 'chai';
import VelocityModel from '../../lib/velocitymodel';
import { Range } from 'immutable';

const vm = new VelocityModel({ P: 1, D: 1, dt: 1, min: -10, max: 190, circular: true });
vm.setTarget(180);
expect(vm.circular).to.be.true;
expect(vm.PID.target).to.equal(-20);
vm.pos = 185;
vm.setTarget(-5);
expect(vm.PID.target).to.equal(195);
Range(1, 5).forEach(() => vm.update()); // update a couple of times to control pos toward target
expect(Math.sign(vm.pos)).to.equal(-1); // same side on the interval as target => negative sign
