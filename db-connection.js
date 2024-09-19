// db/userModel.js
const db = require('./database');

//USUARIOS
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

  async deleteUser(iduser) {
    const query = 'DELETE FROM users WHERE iduser = $1 RETURNING *';
    const result = await db.query(query, [iduser]);
    return result.rows[0];
  }

  async registrateUser(name, surname, nickname, email, password, securityQuestion1, securityQuestion2, securityQuestion3) {
    const query = 'INSERT INTO users (name, surname, nickname, email, password, securityQuestion1, securityQuestion2, securityQuestion3) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)RETURNING *';
    const values = [name, surname, nickname, email, password, securityQuestion1, securityQuestion2, securityQuestion3];
    const result = await db.query(query, values);
    return result.rows[0];
  }

}

//SUBASTA

class AuctionModel {

  async createAuction(current_bid, buy_now_price, end_time, iduser, idproduct) {
    const query = 'INSERT INTO auctions (current_bid, buy_now_price, end_time, iduser , idproduct) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [current_bid, buy_now_price, end_time, iduser, idproduct];
    const result = await db.query(query, values);
    return result.rows[0];
  }


  async deleteSubasta(idauction) {
    const query = 'DELETE FROM subastas WHERE idproducto = $1 RETURNING *';
    const values = [idauction];
    const result = await db.query(query, values);

    if (result.rowCount === 0) {
      throw new Error(`Subasta con ID ${idauction}} no encontrada`);
    }

    return result.rows[0];
  }

  async updateAuction(idauction, current_bid, buy_now_price, end_time) {
    const query = `
      UPDATE auctions
      SET 
        current_bid = $1,
        buy_now_price = $2,
        end_time = $3
      WHERE 
        idauction = $4
      RETURNING *;
    `;
  
    const values = [current_bid, buy_now_price, end_time, idauction];
    const result = await db.query(query, values);
    return result.rows[0];
  }
  

 

  async getUserAuctions() {
    const query = `
    SELECT 
      a.idauction, p.name, p.description, 
      p.image, a.current_bid, a.buy_now_price, a.end_time 
    FROM auctions a, products p
    WHERE a.idproduct=p.idproduct`;
    const result = await db.query(query);
    return result.rows;
  }


  async getAuctions() {
    const query = 'SELECT * FROM actions';
    const result = await db.query(query);
    return result.rows;
  }

}

module.exports = { user: new UserModel(), auction: new AuctionModel() }
