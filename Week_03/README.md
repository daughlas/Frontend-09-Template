学习笔记

## \\ 正则表达式
* RegExp 对象用于将文本与一个模式匹配
* RegExp.lastIndex 该索引表示从哪里开始下一个匹配
    * JavaScript RegExp 对象是有状态的。他们会将上次成功匹配后的位置记录在 lastIndex 属性中。
* RegExp.prototype.exec()
    * exec() 方法在一个指定字符串中执行一个搜索匹配。返回一个结果数组或 null。
      如果匹配成功，exec() 方法返回一个数组（包含额外的属性 index 和 input），并更新正则表达式对象的 lastIndex 属性。完全匹配成功的文本将作为返回数组的第一项，从第二项起，后续每项都对应正则表达式内捕获括号里匹配成功的文本。

## \\ 产生式
加法：

```
<AdditiveExpression> ::=
    <Number>
    |<MultiplicativeExpression><*><Number>
    |<MultiplicativeExpression></><Number>
    |<MultiplicativeExpression><+><MultiplicativeExpression>
    |<MultiplicativeExpression><-><MultiplicativeExpression>
```

乘法