const MYSQL = require("mysql")
const POOL = MYSQL.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mario'
})

module.exports = function(sql, fields, callback) {
  POOL.getConnection(function(err, conn) {
    if(err) {
      console.log('sql connect error' + err)
      return false
    }

    conn.query(sql, fields, (err, result) => {
      conn.release()
      callback(err, result)
    })
  })
}
