// db/userModel.js
const db = require('./database');

class UserModel {
  async createUser(name, email, age) {
    const query = 'INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING *';
    const values = [name, email, age];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async getAllUsers() {
    const query = 'SELECT * FROM users';
    const result = await db.query(query);
    return result.rows;
  }

  async getUserById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  async updateUser(id, name, email, age) {
    const query = 'UPDATE users SET name = $1, email = $2, age = $3 WHERE id = $4 RETURNING *';
    const values = [name, email, age, id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async deleteUser(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  async registrateUser(name, surname, nickname, email, password, securityQuestion1, securityQuestion2, securityQuestion3) {
    const query = 'INSERT INTO users (name, surname, nickname, email, password, securityQuestion1, securityQuestion2, securityQuestion3) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)RETURNING *';
    const values = [name, surname, nickname, email, password,securityQuestion1, securityQuestion2, securityQuestion3];
    const result = await db.query(query, values);
    return result.rows[0];
  }
}

module.exports = new UserModel();