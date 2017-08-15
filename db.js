const { Pool } = require('pg')
const settings = require('./config/db-config');
const pool = new Pool(settings)

var dbTransactions = {
  insertIntoDatabase: (data) => {
    pool.connect((err, client, done) => {
      const shouldAbort = (err) => {
        if (err) {
          console.error('Error in transaction', err.stack)
          client.query('ROLLBACK', (err) => {
            if (err) {
              console.error('Error rolling back client', err.stack)
            }
            done()
          })
        }
        return !!err
      }
      client.query('BEGIN', (err) => {
        if (shouldAbort(err)) return
          const insertRow = 'INSERT INTO data(object_id, object_type, timestamp, object_changes) VALUES ($1, $2, cast($3 as timestamp), $4)'
          const insertRowValues = [data.object_id, data.object_type, new Date(data.timestamp * 1000), JSON.stringify(data.object_changes)];
          client.query(insertRow, insertRowValues, (err, res) => {
            if (shouldAbort(err)) return
            client.query('COMMIT', (err) => {
              if (err) {
                console.error('Error committing transaction', err.stack)
              }
              done()
            })
          })
        })
    });
  }, // end insertIntoDatabase
  queryDatabase: (res, id, timestamp) => {
    pool.connect((err, client, done) => {
      const shouldAbort = (err) => {
        if (err) {
          console.error('Error in transaction', err.stack)
          client.query('ROLLBACK', (err) => {
            if (err) {
              console.error('Error rolling back client', err.stack)
            }
            done()
          })
        }
        return !!err
      }

      let query = 'SELECT object_id, object_type, timestamp, object_changes FROM data WHERE object_id = $1 and timestamp = cast($2 as timestamp)';
      let values = [id, new Date(timestamp * 1000)];
      client.query(query, values, (err, result) =>{
        console.log('results', result);
        done();
        if (shouldAbort(err)) return
        return res.send(JSON.stringify({results: result.rows}));
      });
    });
  },
  queryDatabaseById: (res, id) => {
    pool.connect((err, client, done) => {
      const shouldAbort = (err) => {
        if (err) {
          console.error('Error in transaction', err.stack)
          client.query('ROLLBACK', (err) => {
            if (err) {
              console.error('Error rolling back client', err.stack)
            }
            done()
          })
        }
        return !!err
      }

      let query = 'SELECT object_id, object_type, timestamp, object_changes FROM data WHERE object_id = $1';
      let values = [id];
      client.query(query, values, (err, result) =>{
        done();
        if (shouldAbort(err)) return
        return res.send(JSON.stringify({results: result.rows}));
      });
    });
  },
  queryDatabaseByTimestamp: (res, timestamp) => {
    pool.connect((err, client, done) => {
      const shouldAbort = (err) => {
        if (err) {
          console.error('Error in transaction', err.stack)
          client.query('ROLLBACK', (err) => {
            if (err) {
              console.error('Error rolling back client', err.stack)
            }
            done()
          })
        }
        return !!err
      }

      let query = 'SELECT object_id, object_type, timestamp, object_changes FROM data WHERE timestamp = cast($2 as timestamp)';
      let values = [new Date(timestamp * 1000)];
      client.query(query, values, (err, result) =>{
        done();
        if (shouldAbort(err)) return
        return res.send(JSON.stringify({results: result.rows}));
      });
    });
  }
}

module.exports = dbTransactions;