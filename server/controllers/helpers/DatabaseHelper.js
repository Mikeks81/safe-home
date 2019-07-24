import { Pool } from 'pg'
import dotenv from 'dotenv'
import databaseConfig from '../../database.json'

dotenv.config();

export const dbEnv = () => {
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

const pool = new Pool(dbEnv());

export default {
  /**
   * DB Query
   * @param {string} text
   * @param {Array} params
   * @returns {object} object 
   */
  query(text, params = '') {
    return new Promise((resolve, reject) => {
      pool.query(text, params)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        })
    })
  }
}