import CubicBezier from "cubic-bezier-easing";
export let liner = v => v;

export let ease = new CubicBezier(0.25, 0.1, 0.25, 0.1);
export let easeIn = new CubicBezier(0.42, 0, 1, 1);
export let easeOut = new CubicBezier(0, 0, 0.58, 1);
export let easeInOut = new CubicBezier(0.42, 0, 0.58, 1);
