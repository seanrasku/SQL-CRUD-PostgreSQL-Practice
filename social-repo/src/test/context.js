const pool = require("../pool");
const { randomBytes } = require("crypto");
const { default: migrate } = require("node-pg-migrate");
const format = require("pg-format");
const DEFAULT_OPTS = {
  host: "localhost",
  port: 5432,
  database: "socialnetwork-test",
  user: "sean",
  password: "",
};
class Context {
  constructor(roleName) {
    this.roleName = roleName;
  }
  static async build() {
    const roleName = "a" + randomBytes(4).toString("hex");

    await pool.connect(DEFAULT_OPTS);

    await pool.query(
      format("CREATE ROLE %I WITH LOGIN PASSWORD %L;", roleName, roleName)
    );
    await pool.query(
      format("CREATE SCHEMA %I AUTHORIZATION %I;", roleName, roleName)
    );
    pool.close();
    await migrate({
      schema: roleName,
      direction: "up",
      log: () => {},
      noLock: true,
      dir: "migrations",
      databaseUrl: {
        host: "localhost",
        port: 5432,
        database: "socialnetwork-test",
        user: roleName,
        password: roleName,
      },
    });

    await pool.connect({
      host: "localhost",
      port: 5432,
      database: "socialnetwork-test",
      user: roleName,
      password: roleName,
    });
    return new Context(roleName);
  }

  async close() {
    await pool.close();
    await pool.connect(DEFAULT_OPTS);
    await pool.query(format("DROP SCHEMA %I CASCADE;", this.roleName));
    await pool.query(format("DROP ROLE %I;", this.roleName));
    await pool.close();
  }
  async reset() {
    return pool.query(`DELETE FROM users;`);
  }
}
module.exports = Context;
