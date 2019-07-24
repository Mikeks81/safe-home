const { Pool } = require('pg')
require('dotenv').config()
const databaseConfig = require('../database.json')

const getDBCreds = (env = 'development') => {
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

const { user, host, password, port } = getDBCreds()

const pool = new Pool({ user, host, password, port })

const createAllDBs = async () => {
  const dbsArr = Object.keys(databaseConfig)
  console.log(' ========== CREATING DATABASES ========== \r\n');
  const dbRequests = dbsArr.map(db => {
    return createDB(getDBCreds(db).database)
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