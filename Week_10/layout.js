function getStyle(element) {
    if (!element.style) element.style = {};

    for (let prop in element.computedStyle) {
        element.style[prop] = element.computedStyle[prop].value;

        if (element.style[prop].toString().match(/px$/)) {
            element.style[prop] = parseInt(element.style[prop])
        }

        if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
            element.style[prop] = parseInt(element.style[prop])
        }
    }
    return element.style;
}

function layout(element) {
    if (!element.computedStyle) return;

    const elementStyle = getStyle(element);

    if (elementStyle.display !== 'flex') return;

    const items = element.children.filter(e => e.type === 'element');

    items.sort(function(a, b) {
        return (a.order || 0) - (b.order || 0);
    })

    const style = elementStyle;

    ['width', 'height'].forEach(size => {
        if (style[size] === 'auto' || style[size] === '') {
            style[size] = null;
        }
    })

    if (!style.flexDirection || style.flexDirection === 'auto') {
        style.flexDirection = 'row';
    }
    if (!style.alignItems || style.alignItems === 'auto') {
        style.alignItems = 'stretch';
    }
    if (!style.justifyContent || style.justifyContent === 'auto') {
        style.justifyContent = 'flex-start';
    }
    if (!style.flexWrap || style.flexWrap === 'auto') {
        style.flexWrap = 'nowrap';
    }
    if (!style.alignContent || style.alignContent === 'auto') {
        style.alignContent = 'stretch';
    }

    let mainSize, mainStart, mainEnd, mainSign, mainBase,
        crossSize, crossStart, crossEnd, crossSign, crossBase;

    if (style.flexDirection === 'row') {
        mainSize = 'width';
        mainStart = 'left';
        mainEnd = 'right';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }
    if (style.flexDirection === 'row-reverse') {
        mainSize = 'width';
        mainStart = 'right';
        mainEnd = 'left';
        mainSign = -1;
        mainBase = style.width;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if (style.flexDirection === 'column') {
        mainSize = 'height';
        mainStart = 'top';
        mainEnd = 'bottom';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }
    if (style.flexDirection === 'column-reverse') {
        mainSize = 'height';
        mainStart = 'bottom';
        mainEnd = 'top';
        mainSign = -1;
        mainBase = style.height;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if (style.flexWrap === 'wrap-reverse') {
        let tmp = crossStart;
        crossStart = crossEnd;
        crossEnd = tmp;
        crossSign = -1
    } else {
        crossBase = 0;
        crossSign = 1;
    }

    // 2. 收集元素进入行中

    let isAutoMainSize = false;
    if (!style[mainSize]) {
        // 父元素没有设置尺寸，子元素撑开父元素，无论如何都是在一行的
        elementStyle[mainSize] = 0;
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let itemStyle = getStyle(item);
            if (itemStyle[mainSize] !==null || itemStyle[mainSize] !== (void 0)) {
                // 所有子元素 mainSize 加起来就是当前元素的 mainSize
                elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize];
            }
        }
        isAutoMainSize = true; // 无论如何所有元素排进一行
    }

    let flexLine = []; // 一行
    const flexLines = [flexLine]; // 所有行，至少一行

    // 剩余空间，默认等于父元素的 mainSize，主轴尺寸
    let mainSpace = elementStyle[mainSize];
    // 副轴占据的空间
    let crossSpace = 0;

    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let itemStyle = getStyle(item);

        if (itemStyle[mainSize] === null || itemStyle[mainSize] === (void 0)) {
            itemStyle[mainSize] = 0;
        }

        if (itemStyle.flex) {
            // 可伸缩，一定可以放进当前行
            // 不需要管当前行剩余多少空间
            flexLine.push(item);
        } else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
            mainSpace -= itemStyle[mainSize];
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }
            flexLine.push(item);
        } else {
            // 需要换行的逻辑
            if (itemStyle[mainSize] > style[mainSize]) {
                // 元素尺寸特别大，比主轴尺寸还打，压缩到主轴尺寸
                itemStyle[mainSize]  = style[mainSize];
            }
            if (mainSpace < itemStyle[mainSize]) {
                // 换行操作
                // flexLine 记录一下主轴剩余空间
                flexLine.mainSpace = mainSpace;
                // flexLine 记录一下交叉轴空间
                flexLine.crossSpace = crossSpace;
                // 创建一个新的flexLine
                flexLine = [item];
                flexLines.push(flexLine);
                mainSpace = style[mainSize];
                crossSpace = 0;
            } else {
                // 能放下，不需要黄行
                flexLine.push(item);
            }
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSpace]);
            }
            mainSpace -= itemStyle[mainSize];
        }
    }

    flexLine.mainSpace = mainSpace; // 记录一下最后一行的剩余空间

    if (style.flexWrap === 'nowrap' || isAutoMainSize) {
        // 最后一行
        // nowrap 不分行 =》 看看有没有定义高度 =》 有就用，没有将之前的 crossSpace
        flexLine.crossSpace = (style[crossSize] !== undefined) ? style[crossSize]: crossSpace;
    } else {
        flexLine.crossSpace = crossSpace;
    }


    // 3. 计算主轴
    if (mainSpace < 0) {
        // 特殊情况，只发生在单行的情况
        // 超出主轴宽度，等比压缩，只有一行的情况下
        let scale = style[mainSize] / (style[mainSize] - mainSpace);
        let currentMain = mainBase; // 当前排到哪儿了
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let itemStyle = getStyle(item);

            if (itemStyle.flex) {
                itemStyle[mainSize] = 0;
            }

            itemStyle[mainSize] = itemStyle[mainSize] * scale;

            itemStyle[mainStart] = currentMain;
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
            currentMain = itemStyle[mainEnd];
        }
    } else {
        // process each flex line
        flexLines.forEach(items => {

            let mainSpace = items.mainSpace; // 拿到上一步计算得到的主轴剩余空间
            let flexTotal = 0; // 所有有 flex 属性的元素的 flex 总和

            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                let itemStyle = getStyle(item);

                if ((itemStyle.flex !== null) && (itemStyle.flex !== (void 0))) {
                    flexTotal += itemStyle.flex;
                }
            }

            if (flexTotal > 0) {
                let currentMain = mainBase;
                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    let itemStyle = getStyle(item);
                    if (itemStyle.flex) {
                        // 上一步设置 flex 元素的 mainSize 为 0
                        // 所以 mainSpace 的到的是所有 flex 元素的宽度总和
                        itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
                    }
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd];
                }
            } else {
                let currentMain, step;

                if (style.justifyContent === 'flex-start') {
                    currentMain = mainBase;
                    step = 0;
                }
                if (style.justifyContent === 'flex-end') {
                    currentMain = mainSpace * mainSign + mainBase;
                    step = 0;
                }
                if (style.justifyContent === 'center') {
                    currentMain = mainSpace / 2 * mainSign + mainBase;
                    step = 0;
                }
                if (style.justifyContent === 'space-between') {
                    currentMain = mainBase;
                    step = mainSpace / (items.length - 1) * mainSign;
                }
                if (style.justifyContent === 'space-around') {
                    step = mainSpace / items.length * mainSign;
                    currentMain = step / 2 + mainBase;
                }

                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    let itemStyle = getStyle(item);
                    // TODO
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd] + step;
                }
            }
        })
    }

    // 计算 cross 轴的尺寸
    // align-items, align-self
    // TODO is Valie
    // let crossSpace;

    // crossSpace cross 轴剩余高度
    if (!style[crossSize]) {
        crossSpace = 0;
        elementStyle[crossSize] = 0;
        for (let i = 0; i < flexLines.length; i++) {
            elementStyle[crossSize] = elementStyle[crossSize] + flexLines[i].crossSpace;
        }
    } else {
        crossSpace = style[crossSize];
        for (let i = 0; i < flexLines.length; i++) {
            crossSpace -= flexLines[i].crossSpace;
        }
    }

    if (style.flexWrap === 'wrap-reverse') {
        crossBase = style[crossSize];
    } else {
        crossBase = 0;
    }

    let lineSize = style[crossSize] / flexLines.length;

    let step;

    if (style.alignContent === 'flex-start') {
        crossBase += 0;
        step = 0;
    }
    if (style.alignContent === 'flex-end') {
        crossBase += crossSign * crossSpace;
        step = 0;
    }
    if (style.alignContent === 'center') {
        crossBase += crossSign * crossSpace / 2;
        step = 0;
    }
    if (style.alignContent === 'space-between') {
        crossBase+= 0;
        step = crossSpace / (flexLines.length - 1);
    }
    if (style.alignContent === 'space-around') {
        step = crossSpace / (flexLines.length)
        crossBase += crossSign * step / 2;
    }
    if (style.alignContent === 'stretch') {
        crossBase += 0;
        step = 0;
    }

    flexLines.forEach(items => {
        // crossSpace 整个元素剩余 cross 轴空间
        // items.crossSpace 每一行的 cross 轴 高度
        let lineCrossSize = style.alignContent === 'stretch' ?
            items.crossSpace + crossSpace / flexLines.length :
            items.crossSpace;

        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let itemStyle = getStyle(item);

            let align = itemStyle.alignSelf || style.alignItems;

            if (itemStyle[crossSize] === null) {
                itemStyle[crossSign] = align === 'stretch' ? lineCrossSize : 0;
            }

            if (align === 'flex-start') {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]
            }
            if (align === 'flex-end') {
                itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
                itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
            }
            if (align === 'center') {
                itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            }
            if (align === 'stretch') {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = crossBase + crossSign * (
                    itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0) ?
                        itemStyle[crossSize] : lineCrossSize
                );
                itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);

            }
        }
        crossBase += crossSign * (lineCrossSize + step);
    })

}

module.exports = layout;
