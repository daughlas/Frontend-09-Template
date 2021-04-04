# JS 类型

## || javascript 中的 atom
* Literal
* Variable
* Keywords
* Whitespace
* Line Terminator


## || javascript 基本类型
* Number
* String
* Boolean
* Object
* Null，有值，但是是空
    * typeof null === 'object' 为 true
* Undefined，没有人定义过它的值
* Symbol
    * 可以代替 String 作为 Object 的索引
    * 专门用于 Object 的属性名
* BigInt

赋值的时候，尽量用 Null，不要用 undefined

## || Number
* IEEE 754 Double Float
    * Sign(1)
    * Exponent(11)，指数，标识浮点数能表示的范围
    * Fraction(52)，有效位数，表示了浮点数的精度
* Grammar
    * DecimalLiteral
        * 0
        * 0.，`0 .toString(0`
        * .2
        * 1e3
    * BinaryIntegerLiteral
        * 0b111
    * OctalIntegerLiteral
        * 0o10
    * HexIntegerLiteral
        * 
## || String
* Character，字符，a
* Code Point，码点，97
* Encoding，编码方式，01100001
* a => 97 => 01100001

### ||| 字符集
* ASCII，计算机中最常用的 127 个字符，
* Unicode 
    * 全世界的各种字符
    * 按片区分配
* UCS，0000 到 FFFF 这个范围的字符集
* GB，和 Unicode 码点不一致，但是它兼容 ASCII，字符范围消，省空间
    * GB2312
    * GBK(GB13000)
    * GB18030
* ISO-8859
* BIG5

### ||| 字符编码
* ASCII，最多一个字节，码点和编码一摸一样的
* UTF8
    * 默认一个字节表示一个字符
    * a: 01100001
    * b: 01100010
    * 一 
        * 码点 01001100
        * 编码： 11100100 10111000 10000000
        * 最前边 3 个 1，表示要占 3 个字节，后边两个字节开头的 10 是也是控制位
* UTF16
    * 默认用2个字节，16 个 bit 位
    * a：00000000 01100001
    * b：00000000 01100010
    
### ||| 语法
* ""
* ''
* ``

匹配单引号和双引号
* 考虑所有字符，转义字符，\u 转义，\x转义
* bfnrtv 这几个
* 2028，2029 换行符
* `"(?:[^"\n\\\r\u2028\u2029]|\\(?:['"\\bfnrtv\n\r\u2028\u2029]|\r\n)|\\x[0-9a-fA-F]{2}|\\u[0-9a- fA-F]{4}|\\[^0-9ux'"\\bfnrtv\n\\\r\u2028\u2029])*"`
* `'(?:[^'\n\\\r\u2028\u2029]|\\(?:['"\\bfnrtv\n\r\u2028\u2029]|\r\n)|\\x[0-9a-fA-F]{2}|\\u[0-9a- fA-F]{4}|\\[^0-9ux'"\\bfnrtv\n\\\r\u2028\u2029])*'`

反引号语法，string template 语法结构

`ab${x}abc${y}abc`
会被解读为
* `ab${
* x
* x}abc${
* y
* }abc

```javascript
function UTF8Encoding(string) {
    var arr = [];
    var size = 0;
    for(let i = 0; i < string.length; i++) {
        const codePoint = string.codePointAt(i);

        if (codePoint <= 0x7f) {
            size += 1;
            arr.push(codePoint);

        } else if (codePoint <= 0x7ff) {
            size += 2;
            arr.push((192 | (31 & (codePoint >> 6))));
            arr.push((128 | (63 & codePoint)));

        } else if (codePoint <= 0xd799 || codePoint >=0xe000) {
            size += 3;
            arr.push((224 | (15 & (codePoint >> 12))));
            arr.push((128 | (63 & (codePoint >> 6))));
            arr.push((128 | (63 & codePoint)))
        }
    }
    for (let i = 0; i < arr.length; i++) {
        arr[i] &= 0xff;
    }
    return arr.map(item => item.toString(16));
}
```

## || Boolean

## || Null & Undefined
* null 有值，但是为空
* undefined
    * 从来没有人给他设置过值
    * undefined 不是关键值，可以赋值
    * 用 void 0 返回的 undefined 最安全


## || Object 和 Symbol
* 人 5 岁的时候就开始产生抽象 
* 所以任何一个对象都是唯一的，这与它本身的状态无关。 
* 所以，即使状态完全一致的两个对象，也并 不相等。 
* 我们用 **状态** 来描述对象。
* 我们状态的改变即是 **行为**。


### ||| 对象三要素
* 标识
* 状态
* 行为

### ||| 分类 class

* 类是一种常见的描述对象的方式。
而”归类”和”分类”则是两个主要的流派。
    * 归类，研究一个一个的对象，提取共性，在类之间再提取共性
    * 分类，把万物抽象成一个基点，然后将基点划分成一个一个的类，对跪下去
* 对于”归类”方法而言， 多继承是非常自然的事情。 如C++
* 而采用分类思想的计算机 语言，则是单继承结构。 并且会有一个基类Object。例如 C#、JAVA
* class 天然和类型系统容易结合
      
### ||| javascript 的分类 prototype base object
* 原型是一种更接近人类原 始认知的描述对象的方法。
* 我们并不试图做严谨的分类，而是采用“相似”这样的方式去描述对象。
* 任何对象仅仅需要描述它自己与原型的区别即可。


### ||| 设计对象
* 我们不应该受到语言描述的干扰 
* 在设计对象的状态和行为时，我们总是遵循 “行为改变状态”的原则。

### ||| Object in JavaScript

* Object
    * property
    * property
    * property
    * [[Prototype]]
    
javascript 的属性既可以描述状态也可以描述行为
* 它是状态和行为的统一
* 是属性的集合
* 标识符就是内存地址

#### |||| 属性的 Key
* Symbol => Data
* Symbol => Accessor
* String => Data
* String => Accessor
* Symbol 实现了属性访问的权限控制

#### ||| 属性的值
* property 属性，attribute 特征值
* Data Property 数据属性，一般用于描述状态
    * [[value]]
    * writable
    * enumerable
    * configurable
* Accessor Property 访问器属性，一般用于描述行为
    * get
    * set
    * enumerable
    * configurable
    
### ||| 原型对象
* 当我们访问属性时，如果当前对象没有，则会沿着原型找原型对象是否有此名称的属性，而原型对象还可能有原型，因此，会有“原型链”这一说法。
* 这一算法保证了，每个对象只需要 描述自己和原型的区别即可。

### ||| Object API
* `{}.[]` 和 `Object.defineProperty`
* `Object.create` 、 `Object.setPrototypeOf` 、 `Object.getPrototypeOf`，基于原型的 API
* new / class / extends，基于分类的 API
* new / function / prototype，历史包袱

### Function Object
* typeof Function === 'function'
* 含有带 call 方法的对象，调用的时候，会自动掉这个 call 方法

### 特殊对象
* function
* array

### Host Object
* Object
    * `[[call]]`
    * `[[construct]]`






