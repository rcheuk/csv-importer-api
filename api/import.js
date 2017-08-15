var express = require('express');
var router = express.Router();
var fs = require('fs');

var db = require('../db');
var processImport = require('../utils');
var path = require('path');
var appDir = path.dirname(require.main.filename);


router.post('/upload', (req, res, next) => {
  var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename); 
        fstream = fs.createWriteStream(appDir + '/uploads/' + filename);
        file.pipe(fstream);
        processImport.loadToDatabase(appDir + '/uploads/' + filename);
    });
    req.busboy.on('finish', function() {
      res.writeHead(200, { 'Connection': 'close' });
      res.end('Import Complete!');
    });
    next();
});

module.exports  = router;