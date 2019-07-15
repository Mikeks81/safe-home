import { Pool } from 'pg'
import { dbEnv } from '../databaseConfiguration/db_config'
import dotenv from 'dotenv'

dotenv.config();

const pool = new Pool(dbEnv);

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