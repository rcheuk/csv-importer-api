//var csv = require('fast-csv');
var csv = require('csvtojson');
var fs = require('fs');
var pg = require('pg');
var db = require('./db');

var processImport = {
  loadToDatabase: (filename) => {
    csv({
      trim:true,
      escape: '"',
    })
    .fromFile(filename)
    .on('json',(data)=>{
      db.insertIntoDatabase(data);
    })
    .on('done',(error)=>{
      console.log('end')
    })
  }
}


module.exports = processImport;