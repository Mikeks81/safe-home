const { Pool } = require('pg')
const faker = require('faker')
const databaseConfig = require('../database.json')

const dbEnv = () => {
  const env = process.env.NODE_ENV || 'development'
  const _dbCreds = databaseConfig[env]
  const dbCreds = {}
  Object.keys(_dbCreds).forEach(key => {
    if (typeof _dbCreds[key] === 'object') {
      const envVal = _dbCreds[key]['ENV']
      dbCreds[key] = process.env[envVal]
    } else {
      dbCreds[key] = _dbCreds[key]
    }
  })
  return dbCreds
}

const pool = new Pool(dbEnv())
const numOfUsers = 15

const query = async (queryText, params, localPool = pool) => {
  try {
    await localPool.query(queryText, params)
  } catch (error) {
    console.log({ error })
    process.exit(1)
  }
}

const getRandomInt = (max, min = 1) => {
    return Math.round(Math.random() * (max - min) + min);
}

const generateArr = num => Array.from(new Array(num), (x, i) => i)

const preSeed = async (tableName) => {
  // drop the table before we seed
  await dropTable(tableName)
  // recreate the users table
  await createTable(tableName)
}

const log = (numOfSeeds, tableName) => {
  console.log(`========== SEEDING ${numOfSeeds} to TABLE: ${tableName} ===========`)
}

const createUsers = async () => {
  const tableName = 'users'
  const numOfSeeds = numOfUsers
  // clear previous records and start table fresh
  // await preSeed(tableName)
  // create an array for he number of recrods to seed
  const arr = generateArr(numOfSeeds)
  log(numOfSeeds, tableName)
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
}

const createContacts = async () => {
  const tableName = 'contacts'
  const numOfSeeds = 40
  // await preSeed(tableName)
  const arr = generateArr(numOfSeeds)
  log(numOfSeeds, tableName)
  const queryText = `INSERT INTO "${tableName}"(fname, lname, phone, email, owner_id) 
                      VALUES ($1, $2, $3, $4, $5)
                      RETURNING *`
  for (const i of arr) {
    const values = [
      faker.name.firstName(),
      faker.name.lastName(),
      faker.phone.phoneNumberFormat(),
      faker.internet.email(),
      getRandomInt(15)
    ]
    await query(queryText, values)
  }
}

const createTrips = () => {
  
}

const createCoordinates = () => {
  
}

const seed = async () => {
  await createUsers()
  await createContacts()
  process.exit(0)
}

seed()