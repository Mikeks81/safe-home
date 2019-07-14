const { Pool } = require('pg')
const schema = require('./schema')
const { dbEnv } = require('./db_config')
const { createAllDBs } = require('./createDatabase')

const pool = new Pool(dbEnv);

pool.on('connect', () => {
  console.log('connected to the db');
});

const query = async (queryText, localPool = pool) => {
  try {
    await localPool.query(queryText)
  } catch (error) {
    console.log({ error })
  }
}


// @NOTE for the coordinates, do more research on how to store lat and long
// originally i was going to store each geo point in it's own table "Coordinates" so
// i could attach all sorts of data to that point. 
// Still debating on wether i should store it as an array of points OR POSTGIS geography points in
// the trips table or in it's own table -- i'm leaning towards it's own table with a foreign key to trips
const createTripsTable = () => {
  const queryText = 
    `CREATE TABLE IF NOT EXISTS
      trips(
        id SERIAL PRIMARY KEY,
        start TIMESTAMP,
        end TIMESTAMP,
        name TEXT,
        owner_id INTEGER NOT NULL,
        coordinates *** NEED TO PICK A DATA TYPE HERE ****
        created_date TIMESTAMP DEFAULT NOW(),
        modified_date TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
      )`
  
  query(queryText)
}

const dropTable = (table) => {
  const queryText = `DROP TABLE IF EXISTS "${table}" returning *`;
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
});

const init = async () => {
  /** create the DB first */
  try {
    await createAllDBs()
    createTables()
  } catch (err) {
    console.log('could not create tables database does not exist.', err)
  }
}

const schemaIteration = (schema) => {
  const tables = Object.keys(schema)
  for (const table of tables) {
    yield schema[table]
  }
}

// problem with is is that they make the request
// in order but when they rosolve they dont resolve in
// order. So if users resolves after contacts
// there is an error trying to link the relationships
const createTables = async () => {
  console.log('Creating tables');
  const tables = Object.keys(schema)
  for (const table of tables) {
    await query(schema[table])
  }
  console.log('DONE WITH TABLES');
}

module.exports = {
  init,
  dropTable
};

require('make-runnable');
