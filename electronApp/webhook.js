var express = require('express'),
  app = express(),
  http = require('http'),
  httpServer = http.Server(app);

app.use(express.static(__dirname));

app.get('/', function(req, res) {
  res.send("/richowebsites");
});

app.get('/ricohwebsite', function(req, res) {
  res.sendfile(__dirname + '/myricoh.html');
});

app.get('/chat', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.listen(3000);
