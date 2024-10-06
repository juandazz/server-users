// db/userModel.js
const db = require('./database');

//USUARIOS
class UserModel {

  

  async getClient () {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,  // Asegúrate de tener esto configurado
  });

    const client = await pool.connect();  // Esto te proporciona un cliente del pool de conexiones
    return client;
  }

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
/*
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
  */

  async authenticateUser(email, password) {
    // La consulta busca tanto por email como por nickname
    const query = 'SELECT * FROM users WHERE email = $1 OR nickname = $1';
    const result = await db.query(query, [email]);
    const user = await result.rows[0];
    console.log(user)

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificación de la contraseña (aquí podrías implementar hashing en lugar de comparar directamente)
    if (password !== user.password) {
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
      console.log(end_time + 'en db')
      const query = `
          INSERT INTO auctions (current_bid, buy_now_price, end_time, iduser, idproduct)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *;
      `;
      
      const values = [current_bid, buy_now_price, end_time, iduser, idproduct];
      
      try {
          const result = await db.query(query, values);
          console.log(result.rows[0])
          return result.rows[0];
      } catch (err) {
          console.error('Error al crear subasta:', err.message);
          throw err; // Re-lanzar el error para manejarlo más arriba si es necesario
      }
  }

  async deleteSubasta(idauction) {
    try {
      // Iniciar una transacción
      await db.query('BEGIN');
  
      // Eliminar todas las pujas relacionadas con la subasta
      const deleteBidsQuery = 'DELETE FROM bids WHERE idauction = $1';
      await db.query(deleteBidsQuery, [idauction]);
  
      // Luego, eliminar la subasta
      const deleteAuctionQuery = 'DELETE FROM auctions WHERE idauction = $1 RETURNING *';
      const result = await db.query(deleteAuctionQuery, [idauction]);
  
      if (result.rowCount === 0) {
        throw new Error(`Subasta con ID ${idauction} no encontrada`);
      }
  
      // Confirmar la transacción
      await db.query('COMMIT');
      return result.rows[0];
  
    } catch (error) {
      // En caso de error, revertir la transacción
      await db.query('ROLLBACK');
      console.error('Error al eliminar la subasta:', error.message);
      throw new Error('No se pudo eliminar la subasta');
    }
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
  

 
/*
  async getUserAuctions() {
    const query = `
    SELECT 
      a.idauction, p.idproduct, p.name, p.description, 
      p.image, b.bid_amount, a.buy_now_price, a.end_time 
    FROM auctions a, products p, 
    WHERE a.idproduct=p.idproduct`;

    const result = await db.query(query);
    return await result.rows;
  }
*/

  async getUserAuctions() {
    const query = `
      SELECT 
        a.idauction, 
        p.idproduct, 
        p.name, 
        p.description, 
        p.image, 
        COALESCE((
          SELECT MAX(b.bid_amount) 
          FROM bids b 
          WHERE b.idauction = a.idauction
        ), a.current_bid) AS current_bid, 
        a.buy_now_price, 
        a.end_time 
      FROM auctions a
      JOIN products p ON a.idproduct = p.idproduct
      LEFT JOIN bids b ON b.idauction = a.idauction
      GROUP BY a.idauction, p.idproduct, p.name, p.description, p.image, a.current_bid, a.buy_now_price, a.end_time;
    `;

    const result = await db.query(query);
    console.log(await result.rows)
    return await result.rows;
  }

  async getAuctions() {
    const query = 'SELECT * FROM auctions';
    const result = await db.query(query);
    return result.rows;
  }

  async getAuctionsById(idauction) {
      const query = 'SELECT * FROM auctions WHERE idauction = $1';
      const result = await db.query(query, [idauction]);
      return result.rows[0];  // Devuelve la primera fila (subasta encontrada)
  }

  async getClient () {

    const client = await pool.connect();  // Esto te proporciona un cliente del pool de conexiones
    return client;
  }

  async registrarPuja(iduser, idauction, bid_amount) {

    //const client = await db.getClient();  // Obtener un cliente para la transacción
    
    try {
      // Verificar si el valor de la puja es mayor que la puja actual
      const auctionQuery = `
        SELECT current_bid, buy_now_price 
        FROM auctions
        WHERE idauction = $1
      `;
      const auctionResult = await db.query(auctionQuery, [idauction]);
      
      const auction = auctionResult.rows[0];

      if (!auction) {
        throw new Error('La subasta no existe.');
      }

      const tiempoRestante = new Date(auction.end_time) - new Date();
      if (tiempoRestante <= 0) {
        console.log('La subasta ha terminado.');
      }

       // Verificar si la puja es mayor que la actual
       if (Number(bid_amount) <= Number(auction.current_bid)) {
        console.log(`La puja debe ser mayor que la actual. Puja: ${bid_amount}, Puja actual: ${Number(auction.current_bid)}`);
        return;
      }

      // Verificar si el valor de la puja es igual o superior al precio de compra inmediata
      console.log(`Verificando compra inmediata... Puja: ${bid_amount}, Precio de compra inmediata: ${auction.buy_now_price}`);
      if (auction.buy_now_price && bid_amount >= auction.buy_now_price) {
        console.log('El valor de la puja es igual o mayor que el precio de compra inmediata.');
        return await this.admitirCompraInmediata(idauction, bid_amount, iduser);
      } else {
        console.log('El valor de la puja es menor que el precio de compra inmediata. Registrando puja...');
      
            //cuando la puja es menor al valor de compra
          // Registrar la nueva puja en la tabla BIDS
            const insertBidQuery = `
            INSERT INTO bids (bid_amount, iduser, idauction)
            VALUES ($1, $2, $3)
            RETURNING *;
          `;
          await db.query(insertBidQuery, [bid_amount, iduser, idauction]);

          // Actualizar la puja actual en la tabla AUCTIONS
          const updateAuctionQuery = `
            UPDATE auctions 
            SET current_bid = $1, iduser = $2
            WHERE idauction = $3
            RETURNING *;
          `;
          const auctionUpdate = await db.query(updateAuctionQuery, [bid_amount, iduser, idauction]);

          await db.query('COMMIT');
          console.log(auctionUpdate.rows[0])
          return auctionUpdate.rows[0];
      }
     
    } catch (error) {
      await db.query('ROLLBACK');
      console.error('Error al registrar la puja:', error.message);
      throw new Error('No se pudo registrar la puja.');
    } finally {
    // db.release();  
    }
  }

  async admitirCompraInmediata(idauction, iduser,bid_amount ) {
    // 1. Obtener los detalles de la subasta
    const query = `
      SELECT a.idauction, a.buy_now_price, a.end_time, a.current_bid 
      FROM auctions a 
      WHERE a.idauction = $1
    `;
    const auctionResult = await db.query(query, [idauction]);
    
    if (auctionResult.rows.length === 0) {
      console.log("Auction not found");
    }
  
    const auction = auctionResult.rows[0];
  
    // 2. Verificar si el valor ofrecido es igual o mayor al precio de compra inmediata
    if (bid_amount >= auction.buy_now_price) {
      // Compra inmediata
        // Registrar la nueva puja en la tabla BIDS
        const insertBidQuery = `
        INSERT INTO bids (bid_amount, iduser, idauction)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
      await db.query(insertBidQuery, [bid_amount, iduser, idauction]);
     
      
      return { success: true, message: "Compra inmediata completada con éxito." };
    } else {
      return { success: false, message: "El valor ofrecido no alcanza el precio de compra inmediata." };
    }
  }

  async getAuctionWinner(idauction) {
    // Consulta para obtener la puja más alta para una subasta específica
    const query = `
        SELECT u.iduser, u.name, u.surname, b.bid_amount 
        FROM bids b
        JOIN users u ON b.iduser = u.iduser
        WHERE b.idauction = $1
        ORDER BY b.bid_amount DESC
        LIMIT 1
    `;

    const result = await db.query(query, [idauction]);
    const resultadoFinal= await this.finalizeAuction(idauction)
    console.log(resultadoFinal)

    // Si hay resultados, devolver el usuario ganador
    if (result.rows.length > 0) {
      console.log(result.rows[0])
        return result.rows[0];  // Devuelve la fila con el ganador
    } else {
        throw new Error('No hay pujas para esta subasta');
    }
  }

  // Función para finalizar la subasta
  async finalizeAuction(auctionId) {
    try {
      console.log('Finalizando la subasta...');
      
      const result=await this.getAuctionDetailsWithWinner(auctionId)

      // Actualizar el campo end_time de la subasta al tiempo actual (finaliza inmediatamente)
      const updateQuery = `
        UPDATE auctions 
        SET end_time = NOW() AT TIME ZONE 'America/Bogota'
        WHERE idauction = $1
        RETURNING *;

      `;
      
      const auctionResult = await db.query(updateQuery, [auctionId]);
      
      if (auctionResult.rowCount === 0) {
        throw new Error('No se encontró la subasta o no se pudo actualizar.');
      }

      console.log(`Subasta ${auctionId} finalizada `);
      
     
      return result;
    } catch (error) {
      console.error('Error al finalizar la subasta:', error.message);
      throw new Error('No se pudo finalizar la subasta.');
    }
  }

    async getAuctionDetailsWithWinner(idauction) {
      // Consulta para obtener el usuario que hizo la subasta, el ganador de la puja más alta y el producto subastado
      const query = `
          SELECT 
              a.iduser AS auction_creator_id, 
              u.iduser AS winner_id, 
              p.idproduct 
          FROM auctions a
          JOIN bids b ON a.idauction = b.idauction
          JOIN users u ON b.iduser = u.iduser
          JOIN products p ON a.idproduct = p.idproduct
          WHERE a.idauction = $1
          ORDER BY b.bid_amount DESC
          LIMIT 1
      `;
  
      const result = await db.query(query, [idauction]);
  
      // Verificar si hay resultados
      if (result.rows.length > 0) {
          const auctionDetails = result.rows[0];
          console.log(auctionDetails.auction_creator_id)
          console.log(auctionDetails.winner_id)
          console.log(auctionDetails.idproduct)
          return {
              auctionCreatorId: auctionDetails.auction_creator_id,
              winnerId: auctionDetails.winner_id,
              productId: auctionDetails.idproduct
          };
      } else {
          throw new Error('No se encontraron datos para esta subasta');
      }
  }
  
  }





module.exports = { user: new UserModel(), auction: new AuctionModel()}
