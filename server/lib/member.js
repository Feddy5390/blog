const DB = require('./db.js')

module.exports = {
  add: (member) => {
    DB(
      'INSERT INTO member(user_name, account, password) VALUES(?, ?, ?)',
      [member.user_name, member.account, member.password],
      (err, result) => {
        if(err) return err
        return result
      }
    );
  },

  get: (account, password, callback) => {
    DB(
      'SELECT * FROM member WHERE account = ? AND password = ?',
      [account, password],
      (err, result) => {
        callback(err, result)
      }
    )
  }
}
