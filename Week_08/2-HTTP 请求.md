# 实现 HTTP 请求
## ||  ISO-OSI 七层网络模型
* 应用
* 表示
* 会话
* 传输
    * 包含 TCP、UDP
* 网络
    * 包含 IP 协议，internet protocol
* 数据链路
* 物理层


数据层和物理层解决点对点传输的问题

在 Node.js 中：
* TCP => require('net')
* 会话、表示、应用 => HTTP => require('http')

## ||  TCP 与 IP 的一些基础知识
* 流
* 端口，哪一个数据分配给那个软件，用端口来确定
* require('net')
* 包，TCP 传输的数据是一个一个的包
* IP 地址，包需要从哪儿到哪儿
    * 小区节点 => 电信主干网 => 国际主干线
* libnet/libpcap
    * libnet 构造 ip 包并且发送
    * libpcap，从网卡，抓去流经网卡的所有包，可以通过某些抓到不是发给自己的包

## || HTTP
* TCP 全双工
* HTTP 必须先由客户端发送 request，再由服务端相应 response，每个 request 对应一个 response
* HTTP 协议是文本型协议，不是二进制协议，不是传二进制编码，而是传 unicode 编码
* 所有 HTTP 的换行都是 \r \n 两个字符构成

HTTP 的例子
```
POST / HTTP/1.1
Host: 127.0.0.1
Content_Type: application/x-www-form-urlencoded

field=aaa&code=x%3D1
```

* 第一行，Request line
    * 方法
    * 路径，path，默认 `/`
    * 协议
* 第二行，第三行， headers，kv
* 第五行，body 部分，根据 Content-Type 来决定格式

## || 实现 HTTP 请求
### ||| 第一步：构造 Http 请求
* 谁将一个 HTTP 请求的类
* Content-Type 是一个必要字段，设置默认值
* body 是 KV 格式
* 不同的 Content-Type 影响 body 的格式

### ||| 第二步 send 函数的总结
* 在 Request 的构造器中收集必要的信息
* 设计一个 send 函数，将请求真是发送到服务器
* send 函数应该是异步的，返回 Promise

response格式  

```
HTTP/1.1 200 /* status line*/
Content-Type:text/html /* headers */
Date:Mon,23 Dec 2019 06:46:19 GMT /* headers */
Connection: keep-alive /* headers */
Transfer-Encoding: chunked /* headers */

26 /* chunked body, 16 进制数字 */
<html><body>Hello world</body></html> /* chunked body */
0 /* chunked body, 16 进制数字 */
```

### ||| 第三步 发送请求
* 支持已有的 connection，否则新建 connection
* 收到数据传给 parser 解析
* 根据 parser 的状态去设定 Promise 的状态

### ||| 第四步 ResponseParser 总结
* Response 必须分段构造，所以用了一个 ResponseParser 来装配
* ResponseParser 分段处理 ResponseText，使用状态机来分析文本结构

### ||| 第五步 BodyParser 总结
* Response 的 body 可能根据 Content-Type 有不同的结构，因此会采用不同的子 Parser 来解决问题
* 文中以 TrunkedBodyParser 为例，我们同样用状态机来处理 body 的格式