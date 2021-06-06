学习笔记

# | HTML

## || HTML 合法元素
* Element：<tagname>...</tagname>
* Text：text
* Comment：<!-- comments -->
* DocumentType：<!Doctype html>
* ProcessingInstruction：<?a 1?>
* CDATA：<![CDATA[ ]]>

## || 字符引用
* \&#161； ASCII 字符
* \&amp;
* \&lt;
* \&quot;

# | Browser API

## || DOM API

DOM API 基本是 JS 对 HTML 的一个抽象

### ||| 节点部分

DOM 树中的 Node 继承关系
* Node：
    * Element
        * HTMLElement
            * HTMLAnchorElement
            * HtmlAppletElement
            * HTMLAreaElement
            * HTMLAudioElement
            * HTMLBaseElement
            * HTMLBodyElement
            * ...
        * SVGElement
            * SVGAElement
            * SVGAltGlyphElement
            * ...
    * Document：文档跟节点
    * CharacterData
        * Text：文本节点
            * CDATA Section：CDATA 节点
        * Comment：注释
        * ProcessingInstruction：处理信息
    * DocumentFragment：文档片段
    * DocumentType：文档类型

挂在 DOM 树上面的都是 Node，大部分 Node 都是 Element

#### |||| 操作
导航类操作
* 节点导航
    * parentNode
    * childNodes
    * firstChild
    * lastChild
    * nextSibling
    * previousSibling
    * 特点：针对 node，经常会找到空白符文本节点
* 元素导航
    * parentElement
    * children
    * firstElementChild
    * lastElementChild
    * nextElementSibling
    * previousElementSibling
 
修改操作
* appendChild
* insertBefore
* removeChild
* replaceChild

高级操作
* compareDocumentPosition，比较两个节点的关系
* contains，检查一个节点是否办函另一个节点
* isEqualNode，检查两个节点是否完全相同，DOM 树结构是否相等
* isSameNode，检查两个节点是否是同一个节点，实际上就是 javascript 的 "==="
* cloneNode，复制一个节点，如果传入参数 true，则会联通子元素做神拷贝

### ||| 事件 API
* target.addEventListener(type, listener [, useCapture])
    * useCapture = true: 捕获模式，沿着DOM树向上冒泡的事件，不会触发listener
    * useCapture = false: 冒泡模式，默认
* target.addEventListener(type, listener [, options])
    * capture
    * once：只响应一次
    * passive： 事件不会产生副作用，单纯的监听一下这个事件，合适的设置可以提高 onScroll 的性能，设置为 true 就不能组织默认行为了 
    

冒泡和捕获：
* 任何一个事件被触发，都会发生冒泡和捕获，与是否被监听无关
* 任何一个事件都要经历一个先捕获再冒泡的过程
    * 鼠标一次点击，会产生一个 x，y 坐标，并不知道是点击了什么东西
    * 浏览器需要经过计算，得到事件发生在哪个元素
    * 知道事件在哪个元素上发生，再通过冒泡，层层向外去触发事件
* 冒泡比较符合直觉，所以不传默认按照冒泡的方式处理

```html
<body>
    <div id="a" style="width: 100%; height: 300px;background-color: lightblue;">
        <div id="b" style="width: 100%;height: 200px;background-color: pink;"></div>
    </div>
<script>
    var a = document.getElementById('a');
    var b = document.getElementById('b');

    //
    a.addEventListener('click', () => console.log('a bubble'));
    b.addEventListener('click', () => console.log('b bubble'));

    a.addEventListener('click', () => console.log('a capture'), true);
    b.addEventListener('click', () => console.log('b capture'), true);
</script>
```
### ||| Iterator API
略

### ||| Range API
* 操作半个节点、或者一堆节点，超精确操作 DOM 树
* 更精确、性能更好、应用性很差

一道面试题：
把一个元素所有的子元素逆序？
* DOM 的 collection 是一个 living collection，一旦操作取出来的 child nodes，它取出来的集合会变化
* 将一个原本存在的元素，insert 到一个新的地方，不需要把它从原本的位置 remove 掉，DOM 树会自动把它 remove 掉，再插入新的位置

创建 Range 的 APIs
* var range = new Range();
* range.setStart(element, 9);
* range.setEnd(element, 4);
* start 和 end 的第二个参数偏移值：
    * 对于 element node， 偏移值是 children
    * 对于 text node，偏移值是文字的个数
* var range = document.getSelection().getRangeAt(0);
* 快捷操作 APIs
    * range.setStartBefore
    * range.setEndBefore
    * range.setStartAfter
    * range.setEndAfter
    * range.selectNode
    * range.selectNodeContents
    
操作 Range 的API
* var fragment = range.extractContents(); 删除
* range.insertNode(document.createTextNode('aaa));

```html
<div id="a">
    <span>1</span>
    <p>2</p>
    <a>3</a>
    <div>4</div>
</div>

<script>
    function reverseChildrenProPlus(element) {
        const range = new Range();
        range.selectNodeContents(element);

        let fragment = range.extractContents();
        console.log(fragment);

        let l = fragment.childNodes.length;
        while(l-- > 0) {
            fragment.appendChild(fragment.childNodes[l]);
        }

        element.appendChild(fragment);
    }
</script>
```

## || CSSOM

### ||| CSS 语言相关 API

APIs
* document.styleSheets，一个 styleSheets 对应一个 style 标签或者 link 标签
* document.styleSheets[0].cssRules
* document.styleSheets[0].insertRule("p {color: pink;}", 0)
* document.styleSheets[0].removeRule(0)
* rule names
    * CSSStyleRule
    * CSSCharsetRule
    * CSSImportRule
    * CSSMediaRule
    * CSSFontFaceRule
    * CSSPageRule
    * CSSNamespaceRule
    * CSSKeyframesRule
    * CSSSupportsRule
    * ....

CssStyleRule:
* selectorText String
* style K-V 结构

getComputedStyle
* window.getComputedStyle(elt, pseudoElt);
    * elt 想要获取的元素
    * pseudoElt 可选，伪元素
* 得到最终真实渲染的元素状态，可以获取为元素，transform 过程等

### ||| CSSOM View API

* window
    * window.innerHeight,window.innerWidth，实际使用的 viewport，浏览器中内容实际渲染所占用的区域
    * window.outerHeight,window.outerWidth，没啥用，浏览器窗口整个占据的尺寸
    * window.devicePixelRatio，代码中 px 逻辑像素与屏幕物理像素的比值
    * window.screen，硬件相关，暂时没啥用
        * window.screen.width
        * window.screen.height
        * window.screen.availWidth
        * window.screen.availHeight
    
window API
* window.open('about:blank', '_blank', 'width=100,height=100, left=100, right= 100')
* moveTo(x, y);
* moveBy(x, y);
* resizeTo(x, y)
* resizeBy(x, y)

scroll API
* scroll 元素上的 API
    * scrollTop，当前滚动的位置
    * scrollLeft，当前滚动的位置
    * scrollWidth 可滚动的最大宽度
    * scrollHeight 可滚动的最大高度
    * scroll(x, y) / ScrollTo 滚动到
    * scrollBy(x, y); 滚动一个差值
    * scrollIntoView();
* window 上的 API
    * scrollX
    * scrollY
    * scroll(x, y)
    * scrollBy(x, y)
    
layout API
* getClientRects() 生成所有的盒
* getBoundingClientRect() 取到一个盒，包含，选中的这个下面所有的元素生成的盒的一个包裹体

## || 其他 API
标准化组织们：
* khronos
    * WebGL
* ECMA
    * ECMAScript
* WHATWG
    * HTML
* W3C
    * webaudio
    * CG/WG
