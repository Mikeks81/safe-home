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
    const { user_id, contact_id } = req.params
    if (!user_id || !contact_id) return res.status(400).send(`Please provide a user id or contact_id.`)
    
    try {
      const response = await ContactsHelper.update(req.body, user_id, contact_id)
      return res.status(200).send(response)
    } catch (err) {
      console.log({ err })
      return res.status(400).send(err)
    }

  }

  async delete (req, res) {
    const { user_id, contact_id } = req.params
    if (!user_id || !contact_id) return res.status(400).send(`Please provide a user id or contact_id.`)
    try {
      const rows = await ContactsHelper.delete(user_id, contact_id)

      if (!rows[0]) return res.status(400).send(' User contact not found and could not be deleted.')
      return res.status(204).send('User contact sucessfully deleted.')
    } catch (err) {
      return res.status(400).send(err)
    }
  }

}

export default new Contacts()