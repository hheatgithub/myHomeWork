import { Timeline, Animation } from "./animation.js";

let tl = new Timeline();

let an = new Animation(
  document.querySelector("#el").style,
  "transform",
  0,
  100,
  1000,
  0,
  null,
  v => `translateX(${v})px`
);

tl.add(an);
tl.start();
