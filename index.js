var express = require('express');
var app = express();
var Router = express.Router();
var busboy = require('connect-busboy');

var fs = require('fs');
var search = require('./api/search');
var upload = require('./api/import');

require ('newrelic');

app.set('port', (process.env.PORT || 5000));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(busboy()); 

app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.use('/api', search);
app.use('/api', upload);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

