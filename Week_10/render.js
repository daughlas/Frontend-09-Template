const images = require('images');

function render (viewport, {children, style}) {
    if (style) {
        const img = images(style.width, style.height);

        if(style['background-color']) {
            let color = style['background-color'] || 'rgb(0,0,0)';
            color.match(/rgb\((\d+),\s+(\d+),\s+(\d+)\)/);
            img.fill(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3), 1);
            viewport.draw(img, style.left || 0, style.top || 0);
        }
    }

    if (children) {
        for(let child of children) {
            render(viewport, child);
        }
    }
}

module.exports = render;
