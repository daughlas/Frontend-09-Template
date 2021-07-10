# 学习笔记

## yeoman

- 从命令行读取输入
- 安装依赖
- 拷贝文件
- ...

## webpack

背景：最初为 node 设计，把 node 代码，打包成浏览器可以运行的代码。

现在还有一些基于 html 来打包的工具。

能做：利用各种 loader 和 plugin 来进行多文件合并

安装：

- webpack-cli，提供命令
- webpack 实现功能

### loader

一个函数，将接收文本，转换为想要输出的文本，最后让 import 或者 require 能够加载对应的文件

## babel

把新版本的 JS 编译成老版本的 JS

命令：`babel [输入] > [输出]`

包：

- @babel/cli
- @babel/core
- @babel/preset-env

配置

可以用 .babelrc 传一个 json

```json
{
  "presets": ["@babel/preset-env"]
}
```

一般通过 preset 和 plugin 来完成配置工作。
