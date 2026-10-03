const http = require('node:http');
http.createServer((req,res)=>{res.writeHead(200, {'Content-Type':'text/plain'}); res.end('observability-ok\n');}).listen(8080,'0.0.0.0');
