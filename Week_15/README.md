学习笔记

## 处理帧的三种方式
一般设置间隔，16ms，这样 1s 60 帧


```javascript
// 1
setInterval(() => {}, 16);

// 2
let tick = () => {
    setTimeout(tick, 16);
}

// 3
let tick = () => {
    requestAnimationFrame(tick);
    // cancelAnimationFrame(handler);
}
```

现代浏览器推荐3


### animation 处理错误
静默处理，直接 return
不静默，throw 一个 error

## 手势

抽象成 start move end

start => end 叫 tap
start => move(10px 容错范围，2 倍屏)，事件变成了 pan start => pan => pan end

pan 的速度达到了一定限度，就认为是一个 flick/swipe 轻扫事件

start，按住 0.5s 之后，就变成了 press start 事件，然后移动的话进入 pan start，松手的时候 press end

这里不包括双指手势

