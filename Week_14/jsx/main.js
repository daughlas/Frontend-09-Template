for (let i of [1, 2, 3]) {
    console.log(i);
}

function createElement(type, attributes, ...children) {
    let el;
    if (typeof type === 'string')
        el = new ElementWrapper(type);
    else
        el = new type;

    for(let attrName in attributes) {
        el.setAttribute(attrName, attributes[attrName]);
    }

    for(let child of children) {
        if (typeof child === 'string') {
            child = new TextWrapper(child);
        } 
        el.appendChild(child);
    }
    return el;
}

class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type);
    }

    setAttribute(name, value) {
        this.root.setAttribute(name, value)
    }

    appendChild(child) {
        child.mountTo(this.root);
    }

    mountTo(parent) {
        parent.appendChild(this.root)
    }
}

class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content);
    }

    setAttribute(name, value) {
        this.root.setAttribute(name, value)
    }

    appendChild(child) {
        child.mountTo(this.root);
    }

    mountTo(parent) {
        parent.appendChild(this.root)
    }
}

// 解决传入 大写 Div 的问题
class Div {
    constructor() {
        this.root = document.createElement('div');
    }
    
    setAttribute(name, value) {
        this.root.setAttribute(name, value)
    }

    appendChild(child) {
        child.mountTo(this.root);
    }

    mountTo(parent) {
        parent.appendChild(this.root)
    }
}

let a = <Div id="a">
    <span>1</span>
    <span>1</span>
    <span>1</span>
</Div>

// document.body.append(a);

a.mountTo(document.body);