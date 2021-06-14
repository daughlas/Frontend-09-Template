import {Timeline, Animation} from "./animation.js";
let tl = new Timeline();
import {ease, easeIn, easeout} from './ease.js'

tl.start();

const el = document.querySelector('#el');
const el2 = document.querySelector('#el2');

tl.add(new Animation(el.style, 'transform', 0, 500, 2000, 0, easeout, v => `translateX(${v}px)`));

el2.style.transition = 'transform 2s ease-out';
el2.style.transform = 'translateX(500px)';

const pauseButton = document.querySelector('#pause-button');
const resumeButton = document.querySelector('#resume-button');

pauseButton.addEventListener('click', () => tl.pause());
resumeButton.addEventListener('click', () => tl.resume());
