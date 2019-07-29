import db from './DatabaseHelper'
import Helper from './Helpers'
import moment from 'moment'

class UserHelper {
  async getUser (id) {
    const getUser = 'SELECT * FROM users WHERE id = $1'
    try {
      const { rows } = await db.query(getUser, [id])
      return rows
    } catch (error) {
      throw Error(error)
    }
  }

  async create (attributes = {}) {
    const { fname, lname, email, password, phone } = attributes
    const hashPassword = Helper.hashPassword(password)

    const createQuery = `INSERT INTO
      users(fname, lname, email, password, phone)
      VALUES($1, $2, $3, $4, $5)
      returning *`
    const values = [
      fname,
      lname,
      email,
      hashPassword,
      phone
    ]

    try {
      const { rows } = await db.query(createQuery, values)
      return rows
    } catch (error) {
      throw Error(error)
    }
  }

  async update (attributes = {}, id) {
    const { fname, lname, phone, email } = attributes
    const updateUser = 'UPDATE users SET fname=$1, lname=$2, email=$3, phone=$4, updated_at=$5 WHERE id=$6 RETURNING *'
    let user = null
    try {
      user = await this.getUser(id)
    } catch (error) {
      console.log({ error })
    }
    if (!user.length) {
      return { error: 'Could not locate user.'}
    }

    const updatedAttrs = [
      fname || user[0].fname,
      lname || user[0].lname,
      email || user[0].email,
      phone || user[0].phone,
      moment(new Date()),
      id
    ]

    try {
      return await db.query(updateUser, updatedAttrs)
    } catch (error) {
      console.log({ error })
      return { error }
    }
  }

  async delete (id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *'
    try {
      const { rows } = await db.query(query, [id])
      return rows
    } catch (error) {
      console.log(error)
      return { error }
    }
  }
}

export default new UserHelper()