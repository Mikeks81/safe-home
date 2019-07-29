import db from './DatabaseHelper'
import Helper from './Helpers'
import moment from 'moment'

class ContactsHelper {
  async getContact(user_id, contact_id) {
    const query = `SELECT * 
                      FROM contacts 
                      WHERE user_id=$1 
                      AND contacts.id=$2`
    try {
      const { rows } = await db.query(query, [user_id, contact_id])
      return rows
    } catch (error) {
      return { error }
    }
  }

  async create(attributes = {}, user_id) {
    const { fname, lname, email, phone } = attributes

    const query = `INSERT INTO contacts(fname, lname, phone, email, user_id) 
                      VALUES ($1, $2, $3, $4, $5)
                      RETURNING *`
    const values = [
      fname,
      lname,
      phone,
      email,
      user_id
    ]

    try {
      const { rows } = await db.query(query, values)
      return rows
    } catch (error) {
      console.log('errors ', error)
      return { error }
    }
  }

  async update(attributes = {}, id) {
    const { fname, lname, phone, email } = attributes
    const updateUser = 'UPDATE users SET fname=$1, lname=$2, email=$3, phone=$4, updated_at=$5 WHERE id=$6 RETURNING *'
    let user = null
    try {
      user = await this.getUser(id)
    } catch (error) {
      console.log({ error })
    }
    if (!user.length) {
      return { error: 'Could not locate user.' }
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

  async delete(id) {
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

export default new ContactsHelper()