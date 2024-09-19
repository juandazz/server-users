const { Client } = require('pg');

class Database {
  constructor() {
    this.client = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'TNB3-db',
      password: 'karen', // karen
    //  password: 'root', // daniel
     port: 5433, //karen:5433 
//
    //  port: 5432, // JuanD: 5432)
    });

    this.client.connect()
      .then(() => console.log('Conectado a PostgreSQL'))
      .catch(err => console.error('Error al conectar a PostgreSQL', err.stack));
  }

  query(queryText, params) {
    return this.client.query(queryText, params);
  }

  close() {
    return this.client.end();
  }
}

module.exports = new Database();
