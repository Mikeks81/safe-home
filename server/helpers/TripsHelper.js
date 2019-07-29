import db from './DatabaseHelper'
import Helper from './Helpers'
import moment from 'moment'

class TripsHelper {
  async getTrip(user_id, trip_id) {
    const query = `SELECT * 
                      FROM trips 
                      WHERE user_id=$1 
                      AND trips.id=$2`
    try {
      return await db.query(query, [user_id, trip_id])
    } catch (error) {
      return { error }
    }
  }

  async create(attributes = {}, user_id) {
    const { start, finish, name } = attributes

    const query = `INSERT INTO trips(start, finish, name, user_id) 
                      VALUES (to_timestamp($1), to_timestamp($2), $3, $4)
                      RETURNING *`
    const values = [
      start,
      finish,
      name,
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

  async update(attributes = {}, user_id, trip_id) {
    const { fname, lname, phone, email } = attributes
    const query = 'UPDATE trips SET fname=$1, lname=$2, email=$3, phone=$4, updated_at=$5 WHERE user_id = $6 AND id = $7 RETURNING *'
    let contact = null
    try {
      contact = await this.getContact(user_id, trip_id)
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
      trip_id
    ]

    try {
      const { rows } = await db.query(query, updatedAttrs)
      return rows
    } catch (error) {
      console.log({ error })
      return { error }
    }
  }

  async delete(user_id, trip_id) {
    const query = `DELETE FROM trips WHERE user_id=$1 AND id=$2 RETURNING *`
    try {
      const { rows } = await db.query(query, [user_id, trip_id])
      return rows
    } catch (error) {
      console.log(error)
      return { error }
    }
  }
}

export default new TripsHelper()