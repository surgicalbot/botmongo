var express = require('express'),
  app = express(),
  http = require('http'),
  httpServer = http.Server(app);
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
app.use(express.static(__dirname));

app.get('/', function(req, res) {
  res.send("/richowebsites");
});

app.get('/ricohwebsite', function(req, res) {
  res.sendfile(__dirname + '/myricoh.html');
});
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");
 });
app.get('/chat', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.listen(process.env.PORT||7000);
