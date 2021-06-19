export function createElement(type, attributes, ...children) {
  let el;
  if (typeof type === "string") el = new ElementWrapper(type);
  else el = new type();

  for (let attrName in attributes) {
    el.setAttribute(attrName, attributes[attrName]);
  }

  for (let child of children) {
    if (typeof child === "string") {
      child = new TextWrapper(child);
    }
    el.appendChild(child);
  }
  return el;
}

export const STATE = Symbol('state');
export const ATTRIBUTE = Symbol('attribute');

export class Component {
  constructor(type) {
    this[ATTRIBUTE] = Object.create(null);
    this[STATE] = Object.create(null);
  }

  setAttribute(name, value) {
    this[ATTRIBUTE][name] = value;
  }

  appendChild(child) {
    child.mountTo(this.root);
  }

  mountTo(parent) {
    if (!this.root) {
      this.render();
    }
    parent.appendChild(this.root);
  }

  triggerEvent(type, args) {
    this[ATTRIBUTE]['on' + type.replace(/^[\s\S]/, s => s.toUpperCase())](new CustomEvent(type, {detail: args}));
  }
}


class ElementWrapper extends Component {
  constructor(type) {
    super();
    this.root = document.createElement(type);
  }
}

class TextWrapper extends Component {
  constructor(content) {
    super();
    this.root = document.createTextNode(content);
  }
}
