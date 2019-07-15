const { Pool } = require('pg')
const faker = require('faker')
const { dbEnv } = require('./db_config')
const { dropTable, init, createTable } = require('./db_init')

const pool = new Pool(dbEnv)

const query = async (queryText, params, localPool = pool) => {
  try {
    await localPool.query(queryText, params)
  } catch (error) {
    console.log({ error })
    process.exit(1)
  }
}

const generateArr = num => Array.from(new Array(num), (x, i) => i)

const createUsers = async () => {
  const tableName = 'users'
  const numOfSeeds = 15
  // drop the table before we seed
  await dropTable(tableName)
  // recreate the users table
  await createTable(tableName)
  // create an array for he number of recrods to seed
  const arr = generateArr(numOfSeeds)
  console.log(`========== SEEDING ${numOfSeeds} to TABLE: ${tableName} ===========`);
  const queryText = `INSERT INTO
    "${tableName}"(fname, lname, email, password, phone)
    VALUES($1, $2, $3, $4, $5)
    returning *`
  for (const i of arr) {
    const values = [
      faker.name.firstName(),
      faker.name.lastName(),
      faker.internet.email(),
      faker.internet.password(),
      faker.phone.phoneNumberFormat()
    ];
    await query(queryText, values)
  }
  process.exit(0)
}

const createContacts = () => {
  
}

const createTrips = () => {
  
}

const createCoordinates = () => {
  
}

createUsers()