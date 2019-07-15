const { Pool } = require('pg')
const prompts = require('prompts')
const schema = require('./schema')
const { allDb, dbEnv } = require('./db_config')
const { createAllDBs } = require('./createDatabase')

const query = async (queryText, pool) => {
  try {
    await pool.query(queryText)
  } catch (error) {
    console.log({ error })
    process.exit(1)
  }
}

const dropTable = async (table) => {
  const response = await prompts({
    type: 'confirm',
    name: 'value',
    message: `Are you sure you want DROP ${table} and ASSOCIATIONS? Associated records from other tables may be deleted.`,
    initial: false
  })
  
  if (!response.value) process.exit(0)
  console.log(`============= DROPPING ${table} and ASSOCIATIONS ============`)
  const queryText = `DROP TABLE IF EXISTS "${table}" CASCADE`
  const pool = new Pool(dbEnv)
  try {
    await query(queryText, pool)
    console.log(`Successfully dropped ${table} and CASCADE.`);
    pool.end();
  } catch (error) {
    console.log(error);
    pool.end();
  }
}

const createTable = async (table) => {
  const queryText = schema[table]
  if (!queryText) {
    console.log(`ERROR: Table ${table} does not exist.`)
    process.exit(0)
  }
  const pool = new Pool(dbEnv)
  console.log(`========= CREATING TABLE: ${table} ============`)
  await query(queryText, pool)
  pool.end()
  console.log(`========= SUCCESSFULLY CREATED TABLE: ${table} ============`)
}

const init = async () => {
  /** create the DB first */
  try {
    await createAllDBs()
    const dbsArr = Object.keys(allDb)
    // loop through all listed db's in config
    for (const db of dbsArr) {
      console.log(`\r\n==========  CREATING DB: ${allDb[db].database} TABLES ============= \r\n`)
      const pool = new Pool(allDb[db])
      await createTables(pool)
      pool.end()
    }
    console.log('\r\n************ FIN ***************')
  } catch (err) {
    console.log('could not create tables database does not exist.', err)
  }
}

const createTables = async (pool) => {
  const tables = Object.keys(schema)
  for (const table of tables) {
    await query(schema[table], pool)
    console.log(`CREATED ${table} TABLE.`)
  }
}

module.exports = {
  init,
  dropTable,
  createTable
};

require('make-runnable');
