const { Pool } = require('pg')
const schema = require('./schema')
const { allDb, dbEnv } = require('./db_config')
const { createAllDBs } = require('./createDatabase')

// const pool = new Pool(dbEnv);

// pool.on('connect', () => {
//   console.log('connected to the db');
// });

const query = async (queryText, localPool = pool) => {
  try {
    await localPool.query(queryText)
  } catch (error) {
    console.log({ error })
    process.exit(1)
  }
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

// pool.on('remove', () => {
//   console.log('client removed');
// });

const init = async () => {
  /** create the DB first */
  try {
    await createAllDBs()
    const dbsArr = Object.keys(allDb)
    // loop through all listed db's in config
    for (const db of dbsArr) {
      console.log(`\r\n==========  CREATING DB: ${allDb[db].database} TABLES ============= \r\n`)
      const localPool = new Pool(allDb[db])
      await createTables(localPool)
      localPool.end()
    }
    console.log('\r\n************ FIN ***************')
  } catch (err) {
    console.log('could not create tables database does not exist.', err)
  }
}

const createTables = async (localPool = pool) => {
  const tables = Object.keys(schema)
  for (const table of tables) {
    await query(schema[table], localPool)
    console.log(`CREATED ${table} TABLE.`)
  }
}

module.exports = {
  init,
  dropTable
};

require('make-runnable');
