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

// Creates context for dealing with test database
class Context {
  constructor(roleName) {
    this.roleName = roleName;
  }
  static async build() {
    //Creates a role for schema, randomly generated to allow for tests to be easier to create
    const roleName = "a" + randomBytes(4).toString("hex");

    await pool.connect(DEFAULT_OPTS);

    // pg-format takes care of any SQL injection risks
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
    // Close pool connection, ensure we drop the test connection, schema, and role.
    await pool.close();
    await pool.connect(DEFAULT_OPTS);
    await pool.query(format("DROP SCHEMA %I CASCADE;", this.roleName));
    await pool.query(format("DROP ROLE %I;", this.roleName));
    await pool.close();
  }
  async reset() {
    //Call after each test to make sure we are dealing with a fresh database
    return pool.query(`DELETE FROM users;`);
  }
}
module.exports = Context;
