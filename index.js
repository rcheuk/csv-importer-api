var express = require('express');
var app = express();
var Router = express.Router();
var busboy = require('connect-busboy');

var fs = require('fs');
var search = require('./api/search.js');
var processImport = require('./utils.js');

require ('newrelic');

app.set('port', (process.env.PORT || 5000));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(busboy()); 

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.use('/api', search);
app.post('/api/upload', function(req, res, next) {
  var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename); 
        fstream = fs.createWriteStream(__dirname + '/uploads/' + filename);
        file.pipe(fstream);
        processImport.loadToDatabase(__dirname + '/uploads/' + filename);
    });
    req.busboy.on('finish', function() {
      res.writeHead(200, { 'Connection': 'close' });
      res.end("Import Complete!");
    });

    next();
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

