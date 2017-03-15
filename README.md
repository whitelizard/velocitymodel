# velocitymodel
PD controlled velocity model with optional animation extension

Demo [here](http://codepen.io/whitelizard/pen/zNVLrM?editors=1010)

`npm i -S velocitymodel`

```javascript
import VelocityModel from 'velocitymodel/lib/velocitymodel';
import ModelAnimator from 'velocitymodel/lib/modelanimator';

const indicator = document.querySelector('#indicator');
const updater = (value) => {
  indicator.style.left = value; // or however you want to use the value
};
const P = 100; // Propotional part
const D = 10; // Velocity part
const model = new VelocityModel(P, D);
const animator = new ModelAnimator(model, updater);

animator.setTarget(222);
```
