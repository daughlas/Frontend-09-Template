import { Component, createElement } from "./framework";
// 解决传入 大写 Div 的问题
class Carousel extends Component {
  constructor() {
    super();
    this.attributes = Object.create(null);
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  render() {
    this.root = document.createElement("div");
    this.root.classList.add("carousel");
    for (let imgSrc of this.attributes.src) {
      let el = document.createElement("div");
      el.style.backgroundImage = `url('${imgSrc}')`;
      this.root.appendChild(el);
    }

    // this.root.addEventListener("mousedown", (event) => {
    //   console.log("mouse down");

    //   let move = (event) => {
    //     console.log("mouse move");
    //     // 推荐使用 client X 和 client Y
    //   };

    //   let up = (event) => {
    //     console.log("mouse up");
    //     document.removeEventListener("mousemove", move);
    //     document.removeEventListener("mouseup", up);
    //   };

    //   document.addEventListener("mousemove", move);

    //   document.addEventListener("mouseup", up);
    // });

    let currentIndex = 0;

    setInterval(() => {
      let children = this.root.children;
      let nextIndex = (currentIndex + 1) % children.length;

      let current = children[currentIndex];
      let next = children[nextIndex];

      next.style.transition = "none";
      next.style.transform = `translateX(${100 - nextIndex * 100}%)`;
      setTimeout(() => {
        next.style.transition = "";
        current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
        next.style.transform = `translateX(${-nextIndex * 100}%)`;

        currentIndex = nextIndex;
      }, 16);
    }, 3000);

    return this.root;
  }

  mountTo(parent) {
    parent.appendChild(this.render());
  }
}

let d = [
  "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
  "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
  "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
  "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
];

let a = <Carousel src={d} />;

// document.body.append(a);

a.mountTo(document.body);