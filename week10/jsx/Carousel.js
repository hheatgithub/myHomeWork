import { STATE, ATTRIBUTE, Component, createElement } from "./framework.js";
import { enableGesture } from "./gesture.js";
import { Timeline, Animation } from "./animation";
import { ease } from "./ease.js";

export { STATE, ATTRIBUTE } from "./framework.js";

export class Carousel extends Component {
  constructor() {
    super();
  }

  render() {
    this.root = document.createElement("div");
    this.root.classList.add("carousel");

    for (let record of this[ATTRIBUTE].src) {
      let child = document.createElement("div");
      child.style.backgroundImage = `url(${record})`;
      this.root.appendChild(child);
    }
    enableGesture(this.root);
    let timeline = new Timeline();
    timeline.start();
    let handler = null;
    let children = this.root.children;

    this[ATTRIBUTE].position = 0;

    let t = 0;
    let ax = 0;

    this.root.addEventListener("start", event => {
      timeline.pause();
      clearInterval(handler);
      if (Date.now() - t < 1500) {
        let progress = (Data.now() - t) / 1500;
        ax = ease(progress) * 500 - 500;
      } else {
        ax = 0;
      }
    });

    this.root.addEventListener("pan", event => {
      let x = event.clientX - event.startX - ax;
      let current = this[ATTRIBUTE].position - (x - (x % 500)) / 500;

      for (let offset of [-1, 0, 1]) {
        let pos = current + offset;
        pos = ((pos % children.length) + children.length) % children.length;

        children[pos].style.transition = "none";
        children[pos].style.transform = `translateX(
          ${-pos * 500 + offset * 500 + (x % 500)}px)`;
      }
      console.log("pan trigger clientx=", event.clientX - event.startX);
    });

    this.root.addEventListener("end", event => {
      timeline.reset();
      timeline.start;
      handler = setInterval(nextIndex, 3000);

      let x = event.clientX - event.startX;
      let current = this[ATTRIBUTE].position - (x - (x % 500)) / 500;
      let direction = Math.round((x % 500) / 500);

      if (event.isFlick) {
        if (event.velocity < 0) {
          direction = Math.ceil((x % 500) / 500);
        } else {
          direction = Math.floor((x % 500) / 500);
        }
      }

      for (let offset of [-1, 0, 1]) {
        let pos = this[ATTRIBUTE].position + offset;
        pos = (pos + children.length) % children.length;

        children[pos].style.transition = "none";
        timeline.add(
          new Animation(
            children[pos].style,
            "transform",
            -pos * 500 + offset * 500 + (x % 500),
            -pos * 500 + offset * 500 + (direction % 500),
            500,
            0,
            ease,
            v => `translateX(${v}px)`
          )
        );
      }

      this[ATTRIBUTE].position =
        this[ATTRIBUTE].position - (x - (x % 500)) / 500 - direction;
      this[ATTRIBUTE].position =
        ((this[ATTRIBUTE].position % children.length) + children.length) %
        children.length;
    });

    let nextPicture = () => {
      let children = this.root.children;
      let nextPosition = (this[ATTRIBUTE].position + 1) % children.length;

      let current = children[this[ATTRIBUTE].position];
      let next = children[nextPosition];
      t = Date.now();
      timeline.add(
        new Animation(
          current.style,
          "transform",
          -this[ATTRIBUTE] * 500,
          -500 - this[ATTRIBUTE] * 500,
          500,
          0,
          ease,
          v => `translateX(${v}px)`
        )
      );

      timeline.add(
        new Animation(
          next.style,
          "transform",
          500 - nextPosition * 500,
          -nextPosition * 500,
          500,
          0,
          ease,
          v => `translateX(${v}px)`
        )
      );

      this[ATTRIBUTE] = nextPosition;
    };

    handler = setInterval(nextPicture, 3000);
    return this.root;
  }

  addMouseEventListener() {
    let position = 0;

    this.root.addEventListener("mousedown", event => {
      let startX = event.clientX;
      let children = this.root.children;

      let move = event => {
        let x = event.clientX - startX;
        let current = position - (x - (x % 500)) / 500;

        for (let offset of [-1, 0, 1]) {
          let pos = current + offset;
          pos = (pos + children.length) % children.length;

          children[pos].style.transition = "none";
          children[pos].style.transform = `translateX(
            ${-pos * 500 + offset * 500 + (x % 500)}px)`;
        }
      };

      let up = event => {
        let x = event.clientX - startX;
        position = position - Math.round(x / 500);

        for (let offset of [
          0,
          -Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))
        ]) {
          let pos = position + offset;
          pos = (pos + children.length) % children.length;

          children[pos].style.transition = "";
          children[pos].style.transform = `translateX(${-pos * 500 +
            offset * 500}px)`;
        }

        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
      };

      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
    });
  }

  autoPlay() {
    let currentIndex = 0;
    setInterval(() => {
      let children = this.root.children;

      let nextIndex = (currentIndex + 1) % children.length;

      let current = children[currentIndex];
      let next = children[nextIndex];

      next.transition = "none";
      next.style.transform = `translateX(${500 - nextIndex * 500}%)`;

      setTimeout(() => {
        next.transition = "";
        current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
        next.style.transform = `translateX(${-nextIndex * 100}%)`;
        currentIndex = nextIndex;
      }, 16);
    }, 3000);
  }
  mountTo(parent) {
    parent.appendChild(this.render());
  }
}
