let { getFeedXml } = require('./daemon');
let http = require('http');

let server = http.createServer((req, res) => {
  console.log(req.url);
  res.end(getFeedXml());
});

server.listen(3000);
console.log('Listening on port 3000');
