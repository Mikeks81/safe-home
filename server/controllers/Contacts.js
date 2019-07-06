import db from '../db'
import moment from 'moment'

class Contacts {
  async getAll (req, res) {
    const { id } = req.params
    if (!id) return res.status(400).send('Please provide a user id.')
    try {
      const query = `SELECT * 
                      FROM contacts 
                      WHERE owner_id=$1`
      const { rows, rowCount } = await db.query(query, [id])
      return res.status(200).send({ rows, rowCount })
      
    } catch (err) {
      return res.status(400).send(err)
    }
  }

  async getOne(req, res) {
    const { id, contact_id } = req.params
    if (!id || !contact_id) return res.status(400).send(`Please provide a user id or contact_id.`)
    try {
      const query = `SELECT * 
                      FROM contacts 
                      WHERE owner_id=$1 
                      AND contacts.id=$2`
      const { rows } = await db.query(query, [id, contact_id])
      return res.status(200).send( rows )
    } catch (err) {
      res.status(400).send( err )
    }
  }

  async create (req, res) {
    const { id } = req.params
    if (!id) return res.status(400).send(this.noUserIdMessage())
    try {
      const { fname, lname, phone, email } = req.body
      const query = `INSERT INTO contacts(fname, lname, phone, email, owner_id) 
                      VALUES ($1, $2, $3, $4, $5)
                      RETURNING *`
      const values = [
        fname,
        lname,
        phone,
        email,
        id
      ]

      const { rows } = await db.query(query, values)
      return res.status(201).send( rows )
    } catch (err) {
      return res.status(400).send(err)
    }
  }

  async update (req, res) {
    const { id, contact_id } = req.params
    if (!id || !contact_id) return res.status(400).send(`Please provide a user id or contact_id.`)
  }

  async delete (req, res) {
    const { id, contact_id } = req.params
    if (!id || !contact_id) return res.status(400).send(`Please provide a user id or contact_id.`)
    try {
      const query = `DELETE FROM contacts WHERE owner_id=$1 AND id=$2 RETURNING *`
      const { rows } = await db.query(query, [id, contact_id])

      if (!rows[0]) return res.status(400).send(' User contact not found and could not be deleted.')
      return res.status(204).send('User contact sucessfully deleted.')
    } catch (err) {
      returnres.status(400).send(err)
    }
  }

}

export default new Contacts()