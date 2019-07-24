const { Pool } = require('pg')
const faker = require('faker')
const moment = require('moment')
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

const log = (numOfSeeds, tableName) => {
  console.log(`========== SEEDING ${numOfSeeds} rows to TABLE: ${tableName} ===========`)
}

const createUsers = async () => {
  const tableName = 'users'
  const numOfSeeds = numOfUsers
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
  const arr = generateArr(numOfSeeds)
  log(numOfSeeds, tableName)
  const queryText = `INSERT INTO "${tableName}"(fname, lname, phone, email, user_id) 
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

const createTrips = async () => {
  const tableName = 'trips'
  const numOfSeeds = 40
  const arr = generateArr(numOfSeeds)
  log(numOfSeeds, tableName)
  const queryText = `INSERT INTO "${tableName}"(start, finish, name, user_id) 
                      VALUES (to_timestamp($1), to_timestamp($2), $3, $4)
                      RETURNING *`
  for (const i of arr) {
    const hoursToAdd = getRandomInt(15)
    const tripDateStart = moment(faker.date.past())
    const tripDateFinish = tripDateStart.clone().add(hoursToAdd, 'hours')
    // convert time from miliseconds to seconds - / 1000
    const startToSeconds = tripDateStart / 1000
    const finishToSeconds = tripDateFinish / 1000
    const values = [
      `${startToSeconds}`,
      `${finishToSeconds}`,
      `${faker.random.word()}`,
      getRandomInt(15)
    ]
    await query(queryText, values)
    await createCoordinates(startToSeconds, finishToSeconds, i + 1)
  }
}

const createCoordinates = (startTime, finishTime, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const tableName = 'coordinates'
      // in seconds
      const recordInterval = 6
      const duration = finishTime - startTime
      const recordsToCreate = duration / recordInterval
      const arr = generateArr(Math.round(recordsToCreate))
      let timeIncrement = recordInterval
      console.log(`========== SEEDING ${recordsToCreate} rows to TABLE: ${tableName} associated with trip: ${id} ===========`)
      let values = []
      for (const i of arr) {
        values.push(
          `(to_timestamp(${moment(startTime * 1000).add(timeIncrement, 'seconds') / 1000}),
          ${faker.address.latitude()},
            ${faker.address.longitude()},
            ${id})`
            )
        timeIncrement += 6
      }
      const queryText = `INSERT INTO "${tableName}"(time, lat, long, trip_id) 
                      VALUES ${values.join(',')}
                      RETURNING *`
      await query(queryText)
      resolve()
    } catch (error) {
      console.log({ error })
      reject(error)
    }
  })
  
}

const seed = async () => {
  await createUsers()
  await createContacts()
  await createTrips()
  process.exit(0)
}

seed()