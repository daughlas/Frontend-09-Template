let element = document.documentElement;

let isListeningMouse = false;

element.addEventListener('mousedown', event => {
    let context = Object.create(null);
    // 为了计算 mouse move 的时候  button 的掩饰码
    contexts.set('mouse' + (1 << event.button), context);

    start(event, context);

    let mousemove = ev => {
        let button = 1;
        while (button <= ev.buttons) {
            if (button & ev.buttons) {

                // move 的时候 buttons 的中键和右键顺序与 start 不一致
                let key
                if (button === 2) {
                    key = 4;
                } else if (button === 4) {
                    key = 2;
                } else {
                    key = button;
                }

                let context = contexts.get('mouse' + key);
                move(ev, context);
            }
            button = button << 1;
        }
    };

    let mouseup = ev => {
        let context = contexts.get('mouse' + (1 << event.button));
        end(ev, context);
        contexts.delete('mouse' + (1 << event.button));
        if (event.buttons === 0) {
            // 这个判断避免多个按键一起按下
            document.removeEventListener('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseup);
            isListeningMouse = false;
        }
    };

    if (!isListeningMouse) {
        // 这个判断避免多个按键一起按下
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
        isListeningMouse = true;
    }
});

let contexts = new Map();

element.addEventListener('touchstart', event => {
    for (let touch of event.changedTouches) {
        let context = Object.create(null);
        contexts.set(touch.identifier, context);
        start(touch, context);
    };
});

element.addEventListener('touchmove', event => {
    for (let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        move(touch, context);
    };
});

element.addEventListener('touchend', event => {
    for (let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        end(touch, context);
        contexts.delete(touch.identifier);
    };
});

element.addEventListener('touchcancel', event => {
    // 触摸被打断，比如一个弹窗出现
    for (let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        cancel(touch, context);
        contexts.delete(touch.identifier);
    };
});

let start = (point, context) => {
    context.startX = point.clientX;
    context.startY = point.clientY;
    context.isTap = true;
    context.isPan = false;
    context.isPress = false;
    context.handler = setTimeout(() => {
        context.isTap = false;
        context.isPan = false;
        context.isPress = true;
        context.handler = null;
        console.log('press');
    }, 500);
}

let move = (point, context) => {
    let dx = point.clientX - context.startX;
    let dy = point.clientY - context.startY;
    if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
        context.isTap = false;
        context.isPan = true;
        context.isPress = false;
        console.log('pan start');
        clearTimeout(context.handler);
    }
    if (context.isPan) {
        console.log(dx, dy);
        console.log('pan');
    }
}

let end = (point, context) => {
    if (context.isTap) {
        console.log('tap');
        dispatch('tap',{})
        clearTimeout(context.handler);
    }
    if (context.isPan) {
        console.log('pan end');
    }
    if (context.isPress) {
        console.log('press end');
    }
}

let cancel = (point, context) => {
    clearTimeout(context.handler);
    console.log('cancel', point.clientX, point.clientY);
}

function dispatch(type, properties) {
    let event = new Event(type);
    console.log(event);
    for (let name in properties) {
        event[name] = properties[name];
    }
    element.dispatchEvent(event);
}
