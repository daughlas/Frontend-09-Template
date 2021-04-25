const http = require('http');

const html1 = `<html meta="a" >
<head>
    <style>
        body div #id {
        width: 100px;
        background-color: #ff5000;
    }
        body div img {
        width: 30px;
        background: #f1f1f1;
    }
    </style>
</head>
<body>
<div>
    <img src="" alt=""/>
    <div id="id" >
    </div>
</div>
</body>
</html>`
const html2 = `<div id="test">test</div>`
const html3 = '<img src="abd.com" alt="123.jpeg" />'
const html4 = `<div id="myId" class="myClassName"></div>`
const html5 = `<div id='myId' class='myClassName'></div>`
const html6 = `<div id=myId class=myClassName></div>`
const html7 = `<div id="myId" class='myClassName'></div>`

http.createServer((request, response) => {
    let body = [];
    request.on('error', (err) => {
        console.error(err)
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        console.log("body:", body);
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(html1);
    })
}).listen(8088);

console.log('server stated: 8088');
