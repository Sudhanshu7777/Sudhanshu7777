require('dotenv').config();

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: process.env.DB_PATH || './database/ecosort.db'
    },
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    },
    useNullAsDefault: true
  },
  
  production: {
    client: 'sqlite3',
    connection: {
      filename: process.env.DB_PATH || './database/ecosort.db'
    },
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    },
    useNullAsDefault: true,
    pool: {
      min: 2,
      max: 10
    }
  }
};