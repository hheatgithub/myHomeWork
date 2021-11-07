import { CleanPlugin } from "webpack";

const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick-handler");
const ANIMATIONS = Symbol("animations");
const START_TIME = Symbol("animation_start_time");

export class Timeline {
  constructor() {
    this[ANIMATIONS] = new Set();
    this[START_TIME] = new Map();
  }

  start() {
    const startTime = Date.now();

    this[TICK] = () => {
      console.log("startTime=", startTime);
      let now = Date.now();
      let t;
      for (let animation of this[ANIMATIONS]) {
        //console.log("Timeline -> start -> animation", animation);

        if (this[START_TIME].get(animation) < startTime) {
          t = now - startTime;
        } else {
          t = now - this[START_TIME].get(animation);
        }

        if (t > animation.duration) {
          this[ANIMATIONS].delete(animation);
          t = animation.duration;
        } else {
          animation.receive(t);
        }
      }
      this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
    };

    this[TICK]();
  }

  pause() {
    cancelAnimationFrame(this[TICK_HANDLER]);
  }
  resume() {
    this[TICK]();
  }

  reset() {}

  add(animation, startTime) {
    console.log("Timeline -> add -> animation", animation);
    if (arguments.length < 2) {
      startTime = Date.now();
    }

    this[ANIMATIONS].add(animation);
    this[START_TIME].set(animation, startTime);
  }
}

export class Animation {
  constructor(
    object,
    property,
    startValue,
    endValue,
    duration,
    delay,
    timingFunction,
    template
  ) {
    this.object = object;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.delay = delay;
    this.timingFunction = timingFunction;
    this.template = template;
  }

  receive(time) {
    let range = this.endValue - this.startValue;
    console.log(
      "this.property",
      this.property,
      " time=",
      time,
      "range=",
      range,
      " this.template=",
      this.template
    );
    this.object[this.property] = this.template(
      this.startValue + (range * time) / this.duration
    );
  }
}
