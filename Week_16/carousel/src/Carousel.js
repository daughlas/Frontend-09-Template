import {Component, createElement, STATE, ATTRIBUTE} from "./framework.js";
import {enableGesture} from './gesture.js';
import {Timeline, Animation} from './animation.js';
import {ease} from './ease.js';

export { STATE, ATTRIBUTE} from './framework.js';

export class Carousel extends Component {
    constructor() {
        super();
    }

    render() {
        this.root = document.createElement("div");
        this.root.classList.add("carousel");
        for (let record of this[ATTRIBUTE].src) {
            let el = document.createElement("div");
            el.style.backgroundImage = `url('${record.src}')`;
            this.root.appendChild(el);
        }

        enableGesture(this.root);
        let timeline = new Timeline();
        timeline.start();

        this[STATE].position = 0;

        let children = this.root.children;

        let t = 0; // 动画的时间
        let ax = 0; // 动画造成的 x 的位移

        let handler = null;

        this.root.addEventListener('start', (ev) => {
            timeline.pause();
            clearInterval(handler);
            let progress = (Date.now() - t) / 500; // 计算动画播放的进度
            ax = ease(progress) * 500 - 500;
        });

        this.root.addEventListener('tap', (ev) => {
            this.triggerEvent('click', {position: this[STATE].position, data: this[ATTRIBUTE].src[this[STATE].position]});
        });

        this.root.addEventListener('pan', (ev) => {
            let x = ev.clientX - ev.startX - ax;
            let current = this[STATE].position - Math.round((x - (x % 500)) / 500);

            for (let offset of [-1, 0, 1]) {
                let pos = current + offset;
                pos = (pos % children.length + children.length * 3) % children.length;

                children[pos].style.transition = "none";
                children[pos].style.transform = `translateX(${
                    -pos * 500 + offset * 500 + (x % 500)
                }px)`;
            }
            ;
        })

        this.root.addEventListener('end', (ev) => {

            timeline.reset();
            timeline.start();
            handler = setInterval(nextPicture, 3000);

            let x = ev.clientX - ev.startX - ax;
            let current = this[STATE].position - ((x - x % 500) / 500);

            let direction = Math.round((x % 500) / 500); // 得到 -1 , 0 , 1 三个值重的一个

            if (ev.isFlick) {
                if (ev.velocity < 0) {
                    direction = Math.ceil((x % 500) / 500);
                } else {
                    direction = Math.floor((x % 500) / 500);
                }
            }

            for (let offset of [-1, 0, 1]) {
                let pos = current + offset;
                pos = (pos % children.length + children.length) % children.length;

                children[pos].style.transition = "";

                timeline.add(new Animation(children[pos].style, 'transform',
                    -pos * 500 + offset * 500 + x % 500,
                    -pos * 500 + offset * 500 + direction * 500,
                    500, 0, ease, v => `translateX(${v}px)`));
            }

            this[STATE].position = this[STATE].position - ((x - x % 500) / 500) - direction;
            this[STATE].position = (this[STATE].position % children.length + children.length) % children.length; // 拖的比较远，负数变成正数
            this.triggerEvent('change', {
                position: this[STATE].position
            });

        });

        let nextPicture = () => {
            let children = this.root.children;
            let nextIndex = (this[STATE].position + 1) % children.length;

            let current = children[this[STATE].position];
            let next = children[nextIndex];

            t = Date.now();

            timeline.add(new Animation(current.style, 'transform', - this[STATE].position * 500, -500 - this[STATE].position * 500, 500, 0, ease, v => `translateX(${v}px)`));
            timeline.add(new Animation(next.style, 'transform', 500 - nextIndex * 500, -nextIndex * 500, 500, 0, ease, v => `translateX(${v}px)`));
            this.triggerEvent('change', {
                position: this[STATE].position
            });
            this[STATE].position = nextIndex;
        }

        handler = setInterval(nextPicture, 3000);

        return this.root;
    }

    mountTo(parent) {
        parent.appendChild(this.render());
    }
}
