const pool = require("../pool");

class UserRepo {
  static async find() {
    const { rows } = await pool.query("SELECT * FROM users;");
    return rows;
  }

  static async findById(id) {
    const { rows } = await pool.query(
      `
    SELECT * FROM users WHERE id = $1;
    `,
      [id]
    );
    return rows;
  }

  static async insert(bio, username) {
    const { rows } = await pool.query(
      `
        INSERT INTO users (bio, username)
        VALUES ($1, $2) RETURNING *;
    `,
      [bio, username]
    );
    return rows;
  }

  static async update(id, bio, username) {
    const { rows } = await pool.query(
      `
          UPDATE users
          SET bio = $2, username = $3
          WHERE id = $1
          RETURNING *;
      `,
      [id, bio, username]
    );
    return rows;
  }

  static async delete(id) {
    const { rows } = await pool.query(
      `
          DELETE FROM users WHERE id = $1 RETURNING *;
      `,
      [id]
    );
    return rows;
  }

  static async count() {
    const { rows } = await pool.query("SELECT COUNT(*) FROM users;");
    return parseInt(rows[0].count);
  }
}

module.exports = UserRepo;
