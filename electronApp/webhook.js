var express = require('express'),
  app = express(),
  http = require('http'),
  httpServer = http.Server(app);
var mongodb = require("mongodb");
var bodyParser = require("body-parser");
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var xlsxj = require("xlsx-to-json");
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
var upload = multer({ storage: storage }).single('userPhoto');
app.post('/api/photo', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      return res.end("Error uploading file.");
    }
    var model = null;
    xlsxj({
      input: __dirname + "/uploads/" + req.file.filename,
      output: __dirname + "/uploads/" + "output.json"
    }, function (err, result) {
      if (err) {
        console.error(err);
      } else {
        fs.unlink(path.join(__dirname + "/uploads/" + req.file.filename), function () {
          fs.unlink(path.join(__dirname + "/uploads/output.json"), function () {
            console.log(result);
            mongodb.MongoClient.connect("mongodb://admin:admin123@ds149335.mlab.com:49335/hospital", function (err, database) {
              if (err) {
                console.log(err);
                process.exit(1);
              }
              // Save database object from the callback for reuse.
              db = database;
              db.collection("surgery").insertMany(result, function (err, response) {
                res.json({ file: "uploaded" });
              });
              db.close();
            });
            // setTimeout(() => {
            //   res.redirect("/formupload");
            // }, 2000)
          })
        })
      }
    });

  });
});
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}
var ObjectID = mongodb.ObjectID;
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.get('/', function (req, res) {
  res.send("/richowebsites");
});
app.post('/', function (req, res) {
  if (!req.body || !req.body.result || !req.body.result.parameters) {
    return res.status(400).send('Bad Request')
  }
  let action = req.body.result.action; // https://dialogflow.com/docs/actions-and-parameters

  // Parameters are any entites that Dialogflow has extracted from the request.
  const parameters = req.body.result.parameters; // https://dialogflow.com/docs/actions-and-parameters
  const hospittyp = parameters.hospital_type;
  const surgicaltyp = parameters.surgical_type;
  const treatmentyp = parameters.treatment_type;
  const totalCost=(parameters.Statistics!="" && parameters.Statistics!=null && parameters.Statistics!=undefined)?parameters.Statistics:"";
  if (action == "input.surgery") {
    mongodb.MongoClient.connect("mongodb://admin:admin123@ds149335.mlab.com:49335/hospital", function (err, database) {
      if (err) {
        console.log(err);
        process.exit(1);
      }
      // Save database object from the callback for reuse.
      var db = database;
      db.collection("surgery").find({
        $and: [
          { $or: [{ "HOSPITAL": hospittyp.toLowerCase() }, { "HOSPITAL": hospittyp.toUpperCase() }, { "HOSPITAL": capitalizeFirstLetter(hospittyp) }, { "HOSPITAL": toTitleCase(hospittyp) }] },
          { $or: [{ "OPERATION": surgicaltyp.toLowerCase() }, { "OPERATION": surgicaltyp.toUpperCase() }, { "OPERATION": capitalizeFirstLetter(surgicaltyp) }, { "OPERATION": toTitleCase(surgicaltyp) }] },
          { $or: [{ "TREATMENT": treatmentyp.toLowerCase() }, { "TREATMENT": treatmentyp.toUpperCase() }, { "TREATMENT": capitalizeFirstLetter(treatmentyp) }, { "TREATMENT": toTitleCase(treatmentyp) }] },
          { $or: [{ "Statistics": totalCost!==""?totalCost.toLowerCase():'mean' }, { "TREATMENT": totalCost!==""?totalCost.toUpperCase():'MEAN' }, { "TREATMENT": totalCost!==""?capitalizeFirstLetter(totalCost):'Mean' }] }
        ]
      }).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        res.status(200).json({
          source: 'webhook',
          speech: 'Statistics=>'+totalCost,
          displayText:'Statistics=>'+totalCost
        })
        db.close();
      });
    });

  }
});
app.get("/formupload", function (req, res) {
  res.sendFile(__dirname + '/uploadform.html');
});
app.get('/ricohwebsite', function (req, res) {
  res.sendfile(__dirname + '/myricoh.html');
});

app.get('/chat', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.listen(process.env.PORT || 7000);
