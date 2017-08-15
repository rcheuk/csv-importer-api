var express = require('express');
var router = express.Router();
var pg = require('pg');

var db = require('../db');

router.get('/search',  (req, res, next) => {
  let id = req.query.id;
  let timestamp = req.query.timestamp;
  let result;
  if (id && timestamp) {
    db.queryDatabase(res,id, timestamp);
  } else if (id) {
    result = db.queryDatabaseById(id);
    if (result) res.json(result);
  } else if (timestamp) {
    result = db.queryDatabaseByTimestamp(timestamp);
    if (result) res.json(result);
  } else {
    next();
  }
});

module.exports = router;
