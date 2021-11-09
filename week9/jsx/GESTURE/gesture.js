let element = document.documentElement;

element.addEventListener("mousedown", event => {
  start(event);
  let mousemove = event => {
    move(event);
  };

  let mouseup = event => {
    end(event);
    element.removeEventListener("mousemove", mousemove);
    element.removeEventListener("mouseup", mouseup);
  };

  element.addEventListener("mousemove", mousemove);
  element.addEventListener("mouseup", mouseup);
});

element.addEventListener("touchstart", event => {
  for (let touch of event.changedTouches) {
    start(touch);
  }
});

element.addEventListener("touchmove", event => {
  for (let touch of event.changedTouches) {
    move(touch);
  }
});

element.addEventListener("touchend", event => {
  for (let touch of event.changedTouches) {
    start(end);
  }
});

element.addEventListener("touchcancel", event => {
  for (let touch of event.changedTouches) {
    cancel(touch);
  }
});

let handler;
let startX, startY;
let isPan = false;
let isTab = !isPan;
let isPress = false;

let start = point => {
  console.log(
    "--start:",
    "point.clientX",
    point.clientX,
    " point.clientY=",
    point.clientY
  );

  isPan = true;
  isTab = false;
  isPress = false;

  (startX = point.clientX), (startY = point.clientY);
  handler = setTimeout(() => {
    console.log("press");

    isPan = false;
    isTab = false;
    isPress = true;
    handler = null;
  }, 500);
};

let move = point => {
  console.log(
    "--move:",
    "point.clientX",
    point.clientX,
    " point.clientY=",
    point.clientY
  );

  let dx = -startX + point.clientX;
  let dy = -startY + point.clienty;

  if (!isPan && dx ** 2 + dy ** 2 > 100) {
    isPan = true;
    isTab = false;
    isPress = false;
    clearTimeout(handler);
  }

  if (isPan) {
    console.log("*****is pan");
    console.log(
      "--pan:",
      "point.clientX",
      point.clientX,
      " point.clientY=",
      point.clientY
    );
  }
};

let end = point => {
  console.log(
    "--end:",
    "point.clientX",
    point.clientX,
    " point.clientY=",
    point.clientY,
    " isTab=",
    isTab,
    " isPan=",
    isPan,
    " isPress=",
    isPress
  );

  if (isTab) {
    console.log("---isTab");
    clearTimeout(handler);
  }

  if (isPan) {
    console.log("---isPan");
  }

  if (isPress) {
    console.log("---isPress");
  }
};

let cancel = point => {
  console.log(
    "--cancel:",
    "point.clientX",
    point.clientX,
    " point.clientY=",
    point.clientY
  );
  clearTimeout(handler);
};
