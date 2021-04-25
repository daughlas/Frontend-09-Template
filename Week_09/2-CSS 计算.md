## || 第一步 收集 CSS 规则

* style 标签结束的时候，保存 CSS 规则
* 调用第三方模块 css
* 注意 CSS 规则的格式
```javascript
const ast = {
    type: 'stylesheet',
    stylesheet: {
        rules: [
            {
                type: 'rule',
                selectors: ['html body #id'],
                declarations: [
                    {
                        type: 'declaration',
                        property: 'width',
                        value: '100px'
                    }
                    // ...
                ]
            }
            // ...
        ]
    }
}
```

## || 第二步 添加调用
* 当我们发现一个 startTag 的时候，立即计算 CSS
* 理论上，当我们分析一个元素时，所有 CSS 规则已经收集完毕，head 里的元素不计算 CSS
* 在真实浏览器中，可能遇到写在 body 的 style 标签，需要从新CSS 计算，忽略之

## || 第三步 获取父元素序列
```javascript
function computeCSS() {
    var parents = stack.slice().reverse();
    // ...
}

```
* 在 computeCSS 函数中，必须知道元素的所有氟元素才能判断元素与规则是否匹配
* 从 stack 中可以获取本元素的所有父元素
* 因为我们首先获取的是当前元素，所以我们获得和计算氟元素匹配的顺序是从内向外

## || 第四步
* 选择器也要从当前元素向外排列
* 复杂选择器拆成针对单个元素的选择器，用循环匹配父元素队列，两个数组同时进行一个循环

```javascript
for (let rule of rules) {
    // , 分割选择器不管
    let selectorParts = rule.selectors[0].split(' ').reverse();

    if (!match(element, selectorParts[0])) {
        continue;
    }

    let matched = false;

    let j = 1;
    for (let i = 0; i < elements.length; i++) {
        if (match(elements[i], selectorParts[j])) {
            j++;
        }
    }
    if (j >= selectorParts.length) {
        matched = true;
    }

    if (matched) {
        console.log(`Element, ${element}, matched rule, ${rule}`)
    }
}    
```

## || 第五步 计算选择器与元素匹配
* 根据选择器的类型和元素属性，计算是否与当前元素匹配
* 局限：match 函数 仅仅实现了三种基本选择器，实际浏览器中要处理复合选择器
* 作业（可选）：实现复合选择器，实现支持空格的 class 选择器

## || 第六步 生成 computed 属性
* 一旦选择器匹配，就应用选择器到元素上，形成 computedStyle

## || 第七步 specificity（专指程度） 的计算逻辑
* 尝试在 selectorParts 里面去解析复合选择器

[0, 0, 0, 0]
[inline, id, class, tagName]

对应 div div #id 就是
[0, 1, 0, 2]

div #my #id
[0, 2, 0, 1]

比较的时候，从数组的高位向地位比，一旦高位能比较出来，就不看低位了

总结：
* CSS 规则根据 specificity 和后来有限规则覆盖
* specificity 是个四元祖，越左边权重越高
* 一个 CSS 规则的 specificity 根据包含的简单选择器相加而成
