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

  async update(attributes = {}, user_id, contact_id) {
    const { fname, lname, phone, email } = attributes
    const query = 'UPDATE contacts SET fname=$1, lname=$2, email=$3, phone=$4, updated_at=$5 WHERE user_id = $6 AND id = $7 RETURNING *'
    let contact = null
    try {
      contact = await this.getContact(user_id, contact_id)
    } catch (error) {
      console.log({ error })
    }
    if (!contact.length) {
      return { error: 'Could not locate contact.' }
    }

    const updatedAttrs = [
      fname || contact[0].fname,
      lname || contact[0].lname,
      email || contact[0].email,
      phone || contact[0].phone,
      moment(new Date()),
      user_id,
      contact_id
    ]

    try {
      const { rows } = await db.query(query, updatedAttrs)
      return rows
    } catch (error) {
      console.log({ error })
      return { error }
    }
  }

  async delete(user_id, contact_id) {
    const query = `DELETE FROM contacts WHERE user_id=$1 AND id=$2 RETURNING *`
    try {
      const { rows } = await db.query(query, [user_id, contact_id])
      return rows
    } catch (error) {
      console.log(error)
      return { error }
    }
  }
}

export default new ContactsHelper()