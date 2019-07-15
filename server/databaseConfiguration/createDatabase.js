const { Pool } = require('pg')
const { allDb, dbEnv } = require('./db_config')

const { database, creds } = dbEnv

const pool = new Pool({ creds })

const createAllDBs = () => {
  const dbsArr = Object.keys(allDb)
  console.log(' ========== CREATING DATABASES ========== \r\n');
  const dbRequests = dbsArr.map(db => {
    return createDB(allDb[db].database)
  })
  return Promise.all(dbRequests, Promise.resolve(dbRequests))
}

const createDB = (database) => {
  return new Promise((resolve, reject) => {
    const query = `CREATE DATABASE "${database}"`
    console.log(`CREATING DB: ${database}`);
    pool.query(query)
      .then(() => {
        console.log(`Successfully created database ${database}.`)
        resolve(`Successfully created database ${database}.`)
      })
      .catch((err) => {
        if (err.code === '42P04') {
          resolve('database already exists')
        } else {
          console.log(`Error, could not create ${database}.`, err);
          reject(err)
        }
      })
  })
}

module.exports = {
  createAllDBs,
  createDB
}

require('make-runnable')