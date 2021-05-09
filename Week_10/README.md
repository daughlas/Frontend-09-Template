学习笔记

CSS 排版
处理 flexDirection 和 wrap 相关的属性
将 width height left top right bottom 等抽象了一下，变成了 mainSize, mainStart, mainEnd, mainSign, mainBase,
crossSize, crossStart, crossEnd, crossSign, crossBase;

## 分行
* 根据主轴尺寸，把元素分配进行里边去
* 若设置了 no-wrap，则强行分配进第一行

## 计算主轴方向
* 找出所有的带 flex 属性的元素
* 把主轴方向的剩余尺寸按比例分配给这些元素
* 若剩余空间为负数，所有 flex 元素为 0，等比例压缩剩余元素

## 计算交叉轴
* 根据每一行中最大元素尺寸计算行高（按 row）
* 根据行高 flex-align 和 item-align，确定元素的具体位置

## render
* 使用 npm 包 images
* gradient 要实现，需要使用 webgl
* 递归调用子元素的绘制方法，忽略掉不需要绘制的节点（没有style，没有 children）
* 实际浏览器中，文字绘制是难点，需要依赖自体库
* 实际浏览器中，还会对一些图层进行 compositing
