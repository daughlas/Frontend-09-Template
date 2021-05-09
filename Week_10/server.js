const http = require('http');

const html1 = `<html meta="a" >
<head>
<style>
    #container {
        width: 500px;
        height: 300px;
        display: flex;
        background-color: rgb(255, 255, 255);
    }
    #container #myid {
        width: 200px;
        height: 100px;
        background-color: rgb(255, 0, 0);
    }
    #container .c1 {
        flex: 1;
        background-color: rgb(0, 255, 0);
    }
</style>
</head>
<body>
<div id="container">
    <div id="myid"></div>
    <div class="c1"></div>
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
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(html1);
    })
}).listen(8088);

console.log('server stated: 8088');
