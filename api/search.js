var express = require('express');
var router = express.Router();

var db = require('../db');

router.get('/search',  (req, res, next) => {
  let id = req.query.id ? req.query.id : null;
  let timestamp = req.query.timestamp ? req.query.timestamp : null;
  let result;
  if (id, timestamp) {
    db.queryDatabase(res, id, timestamp);
  } else if (id) {
    result = db.queryDatabaseById(res, id);
  } else if (timestamp) {
    result = db.queryDatabaseByTimestamp(res, timestamp);
  } else {
    next();
  }
});

module.exports = router;
