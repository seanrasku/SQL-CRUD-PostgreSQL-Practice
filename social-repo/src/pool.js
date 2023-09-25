const pg = require("pg");

class Pool {
  //created pool as a class to allow for connection to multiple different databases
  _pool = null;

  connect(options) {
    this._pool = new pg.Pool(options);
    return this._pool.query("SELECT 1 + 1;"); //ensure we have a working connection
  }
  close() {
    return this._pool.end();
  }
  query(sql, params) {
    return this._pool.query(sql, params);
  }
}

module.exports = new Pool();
