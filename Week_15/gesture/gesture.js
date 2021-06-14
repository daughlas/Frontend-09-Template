let element = document.documentElement;

element.addEventListener('mousedown', event => {
    start(event);

    let mousemove = ev => {
        move(ev);
    };
    let mouseup = ev => {
        end(ev);
        element.removeEventListener('mousemove', mousemove);
        element.removeEventListener('mouseup', mouseup);
    };

    element.addEventListener('mousemove', mousemove);
    element.addEventListener('mouseup', mouseup);

});

element.addEventListener('touchstart', event => {
    for (let touch of event.changedTouches) {
        start(touch);
    };
});

element.addEventListener('touchmove', event => {
    for (let touch of event.changedTouches) {
        move(touch)
    };
});

element.addEventListener('touchend', event => {
    for (let touch of event.changedTouches) {
        end(touch);
    };
});

element.addEventListener('touchcancel', event => {
    // 触摸被打断，比如一个弹窗出现
    for (let touch of event.changedTouches) {
        cancel(touch);
    };
});

let start = (point) => {
    console.log('start', point.clientX, point.clientY);
}

let move = (point) => {
    console.log('move', point.clientX, point.clientY);
}

let end = (point) => {
    console.log('end', point.clientX, point.clientY);
}

let cancel = (point) => {
    console.log('cancel', point.clientX, point.clientY);
}
