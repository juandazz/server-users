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

  async getUserById(iduser) {
    const query = 'SELECT * FROM users WHERE iduser = $1';
    const result = await db.query(query, [iduser]);
    return result.rows[0];
  }

  async updateUser(iduser, name, email, age) {
    const query = 'UPDATE users SET name = $1, email = $2, age = $3 WHERE iduser = $4 RETURNING *';
    const values = [name, email, age, iduser];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async deleteUser(iduser) {
    const query = 'DELETE FROM users WHERE iduser = $1 RETURNING *';
    const result = await db.query(query, [iduser]);
    return result.rows[0];
  }

  async registrateUser(name, surname, nickname, email, password, securityQuestion1, securityQuestion2, securityQuestion3, credits) {
    const query = 'INSERT INTO users (name, surname, nickname, email, password, securityQuestion1, securityQuestion2, securityQuestion3,credits) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)RETURNING *';
    const values = [name, surname, nickname, email, password, securityQuestion1, securityQuestion2, securityQuestion3,credits];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async authenticateUser(email, password) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    const user = result.rows[0];

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (password!=user.password) {
      throw new Error('Contraseña incorrecta');
    }

    return user;
  }
  
  async getCreditsUser(iduser) {
    try {
      console.log(iduser)
      const query = 'SELECT credits FROM users WHERE iduser = $1';
      const result = await db.query(query, [iduser]);
  
      if (result.rows.length > 0) {
        const credits = result.rows[0];
        console.log(credits);
        return result.rows[0].credits;
      } else {
        throw new Error(`Usuario con id ${iduser} no encontrado.`);
      }
    } catch (error) {
      console.error('Error al obtener los créditos del usuario:', error);
      throw error;
    }
  }
  
  async setCreditsUser(iduser, credits) {
    const query = 'UPDATE users SET credits = $1 WHERE iduser = $2 RETURNING *';
    try {
        const result = await db.query(query, [credits, iduser]);
        if (result.rows.length > 0) {
            return result.rows[0];  // Devolver el usuario actualizado
        } else {
            throw new Error(`Usuario con id ${iduser} no encontrado.`);
        }
    } catch (error) {
        console.error('Error al actualizar los créditos del usuario:', error);
        throw error;
    }
  }
}

//SUBASTA

class AuctionModel {

  async createAuction(current_bid, buy_now_price, end_time, iduser, idproduct) {
    // Asegúrate de que end_time esté en el formato correcto
      const formattedEndTime = new Date(end_time).toISOString(); // Convierte a ISO 8601
      
      const query = `
          INSERT INTO auctions (current_bid, buy_now_price, end_time, iduser, idproduct)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *;
      `;
      
      const values = [current_bid, buy_now_price, formattedEndTime, iduser, idproduct];
      
      try {
          const result = await db.query(query, values);
          return result.rows[0];
      } catch (err) {
          console.error('Error al crear subasta:', err.message);
          throw err; // Re-lanzar el error para manejarlo más arriba si es necesario
      }
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
    return await result.rows;
  }


  async getAuctions() {
    const query = 'SELECT * FROM actions';
    const result = await db.query(query);
    return result.rows;
  }

  async getAuctionsById(idauction) {
    const query = 'SELECT * FROM auctions WHERE idauction = $1';
    const result = await db.query(query, [idauction]);
    return result.rows[0];  // Devuelve la primera fila (subasta encontrada)
}


  

}

module.exports = { user: new UserModel(), auction: new AuctionModel() }
