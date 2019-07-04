const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

pool.on('connect', () => {
  console.log('connected to the db');
});

/**
 * Create Contacts Table
 */
const createContactsTable = () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS
      contacts(
        id SERIAL PRIMARY KEY,
        fname TEXT NOT NULL,
        lname TEXT NOT NULL,
        phone VARCHAR(15) UNIQUE NOT NULL,
        email VARCHAR(128) UNIQUE NOT NULL,
        owner_id INTEGER NOT NULL,
        created_date TIMESTAMP DEFAULT NOW(),
        modified_date TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
      )`;

  pool.query(queryText)
    .then((res) => {
      console.log('table created', res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

/**
 * Create User Table
 */
const createUserTable = () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS
      users(
        id SERIAL PRIMARY KEY,
        fname TEXT NOT NULL,
        lname TEXT NOT NULL,
        phone VARCHAR(15) UNIQUE NOT NULL,
        email VARCHAR(128) UNIQUE NOT NULL,
        password VARCHAR(128) NOT NULL,
        created_date TIMESTAMP DEFAULT NOW(),
        modified_date TIMESTAMP DEFAULT NOW()
      )`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

/**
 * Drop Contacts Table
 */
const dropContactsTable = () => {
  const queryText = 'DROP TABLE IF EXISTS contacts returning *';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

/**
 * Drop User Table
 */
const dropUserTable = () => {
  const queryText = 'DROP TABLE IF EXISTS users returning *';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

const createTables = () => {
  createContactsTable()
  createUserTable()
}

module.exports = {
  createTables,
  createContactsTable,
  dropContactsTable,
  dropUserTable
};

require('make-runnable');
