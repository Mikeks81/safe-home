import db from '../helpers/DatabaseHelper'
import moment from 'moment'
import ContactsHelper from '../helpers/ContactsHelper'

class Contacts {
  async getAll (req, res) {
    const { user_id } = req.params
    if (!user_id) return res.status(400).send('Please provide a user id.')
    try {
      const query = `SELECT * 
                      FROM contacts 
                      WHERE user_id=$1`
      const { rows, rowCount } = await db.query(query, [user_id])
      return res.status(200).send({ rows, rowCount })
      
    } catch (err) {
      return res.status(400).send(err)
    }
  }

  async getOne(req, res) {
    const { user_id, contact_id } = req.params
    if (!user_id || !contact_id) return res.status(400).send(`Please provide a user id or contact_id.`)
    try {
      const rows = await ContactsHelper.getContact(user_id, contact_id)
      if (!rows.length) return res.status(400).send('Contact not found')
      return res.status(200).send({ rows })
    } catch (err) {
      res.status(400).send( err )
    }
  }

  async create (req, res) {
    const { user_id } = req.params
    if (!user_id) return res.status(400).send('Please provide a user id.')
    try {
      const rows = await ContactsHelper.create(req.body, user_id)
      return res.status(201).send( rows )
    } catch (err) {
      console.log({ err })
      return res.status(400).send(err)
    }
  }

  async update (req, res) {
    const { fname, lname, phone, email } = req.body
    const { user_id, contact_id } = req.params
    if (!user_id || !contact_id) return res.status(400).send(`Please provide a user id or contact_id.`)
    
    const getContact = 'SELECT * FROM contacts WHERE user_id = $1 AND id = $2'
    const updateContact = 'UPDATE contacts SET fname=$1, lname=$2, email=$3, phone=$4, updated_at=$5 WHERE user_id = $6 AND id = $7 RETURNING *'
    try {
      const { rows } = await db.query(getContact, [user_id, contact_id])
      if (!rows.length) {
        return res.status(404).send({ 'message': 'Could not find user.' })
      }
      
      const values = [
        fname || rows[0].fname,
        lname || rows[0].lname,
        email || rows[0].email,
        phone || rows[0].phone,
        moment(new Date()),
        user_id,
        contact_id
      ]
      const response = await db.query(updateContact, values)
      return res.status(200).send(response.rows[0])
    } catch (err) {
      return res.status(400).send(err)
    }

  }

  async delete (req, res) {
    const { user_id, contact_id } = req.params
    if (!user_id || !contact_id) return res.status(400).send(`Please provide a user id or contact_id.`)
    try {
      const query = `DELETE FROM contacts WHERE user_id=$1 AND id=$2 RETURNING *`
      const { rows } = await db.query(query, [user_id, contact_id])

      if (!rows[0]) return res.status(400).send(' User contact not found and could not be deleted.')
      return res.status(204).send('User contact sucessfully deleted.')
    } catch (err) {
      return res.status(400).send(err)
    }
  }

}

export default new Contacts()