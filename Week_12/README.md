学习笔记

## // 盒模型
盒模型是排版和渲染时的基本单位

内边距(padding)影响的是盒内文本的排版，外边距(margin)影响的是盒模型的排版，决定了盒的周围要有多少空白边距

box-sizing有两个取值，影响width的计算：

- content-box, 默认值，width = contentWidth
- border-box, 怪异盒模型, width = contentWidth + border + padding, 更符合人的一般认知

### /// Block
* Block Container 里面有 BFC 的
    * block
    * inline-block
    * table-cell
    * flex-item
    * grid cell
    * table-caption
* Block-level Box：外面有 BFC 的
    * 大多数元素
        * Block-level vs Inline level
            * display: block v.s. inline-block
            * display: flex v.s. inline-flex
            * display: table v.s. inline-table
            * display: grid v.s. inline-grid
* Block Box = Block Container + Block-level Box，里外都有 BFC 的

### /// 设立 BFC
* floats
* absolutely positioned elements
* block containers (such as inline-blocks, table-cells, and table-captions) that are not block boxes,
    * flex items
    * grid cells
    * ...
* and block boxes with "overflow" other than "visible"

### /// BFC 合并
* block box && overflow：visible
    * BFC 合并与 float
    * BFC 合并与边距折叠
