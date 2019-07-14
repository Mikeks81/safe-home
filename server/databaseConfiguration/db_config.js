require('dotenv').config()

const dbEnv = {
  production: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  },
  development: {
    user: 'postgres',
    host: 'localhost',
    password: '',
    database: 'safe-home-dev',
    port: 5432
  },
  test: {
    user: 'postgres',
    host: 'localhost',
    password: '',
    database: 'safe-home-test',
    port: 5432
  }
}

module.exports = {
  dbEnv: dbEnv[process.env.NODE_ENV || 'development'],
  allDb: dbEnv
}
