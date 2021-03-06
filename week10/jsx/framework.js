export function createElement(type, attributes, ...children) {
  let element;
  if (typeof type === "string") {
    element = new ElementWrapper(type);
  } else {
    element = new type();
  }

  if (attributes) {
    for (let name in attributes) {
      element.setAttribute(name, attributes[name]);
    }
  }

  let processChildren = children => {
    for (let child of children) {
      if (typeof child === "object" && child instanceof Array) {
        processChildren(child);
        continue;
      }
      if (typeof child === "string") {
        child = new TextWrapper(child);
      }
      element.appendChild(child);
    }
  };

  processChildren(children);
  return element;
}

export const STATE = Symbol("state");
export const ATTRIBUTE = Symbol("attributes");

export class Component {
  constructor(type) {
    this[ATTRIBUTE] = Object.create(null);
    this[STATE] = Object.create(null);
  }

  render() {
    return this.root;
  }
  setAttribute(name, value) {
    this[ATTRIBUTE][name] = value;
  }

  appendChild(child) {
    child.mountTo(this.root);
  }

  mountTo(parent) {
    if (!this.root) this.render();
    parent.appendChild(this.root);
  }

  triggerEvent(type, args) {
    this[ATTRIBUTE]["on" + type.replace(/^[\s\S]/, s => s.toUpperCase())](
      new CustomEvent(type, { detail: args })
    );
  }
}

class ElementWrapper extends Component {
  constructor(type) {
    super(type);
    this.root = document.createElement(type);
  }
}

class TextWrapper extends Component {
  constructor(content) {
    super(content);
    this.root = document.createTextNode(content);
  }
}
