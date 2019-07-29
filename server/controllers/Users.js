import db from '../helpers/DatabaseHelper'
import Helper from '../helpers/Helpers'
import UserHelper from '../helpers/UserHelper'

import moment from 'moment'

class User {
  async getAll (req, res) {
    const query = 'SELECT * FROM users;'
    try {
      const { rows, rowCount } = await db.query(query)
      return res.status(200).send({ rows, rowCount })
    } catch (err) {
      return res.status(400).send(err)
    }
  }

  async getOne (req, res) {
    const query = 'SELECT * FROM users WHERE id = $1'
    try {
      const { id } = req.params
      const { rows, rowCount } = await db.query(query, [id])
      return res.status(200).send({ rows, rowCount })
    } catch (err) {
      return res.status(400).send(err)
    }
  }

  /**
   * 
   * @param {object} req 
   * @param {object} res
   * @returns {object} Creates new user 
   */
  async create (req, res) {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ 'message': 'Some values are missing' });
    }
    if (!Helper.isValidEmail(req.body.email)) {
      return res.status(400).send({ 'message': 'Please enter a valid email address' });
    }
    
    try {
      const rows = await UserHelper.create(req.body)
      const token = Helper.generateToken(rows[0].id);
      return res.status(201).send({ token });
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(400).send({ 'message': 'User with that EMAIL already exist' })
      }
      return res.status(400).send(error);
    }
  }

  async update (req, res) {
    const { id } = req.params 
    if (!id) {
      return res.status(404).send({ message: 'Missing Id'})
    }
    
    try {
      const response = await UserHelper.update(req.body, id)
      if (response.error) {
        return res.status(400).send(response.error)
      }
      return res.status(200).send(response.rows[0])
    } catch (err) {
      return res.status(400).send(err)
    }
    
  }

  async delete (req, res) {
    const { id } = req.params
    if (!id) return res.status(400).send({ 'message': 'Missing Id' })

    try {
      const rows = await UserHelper.delete(id)
      if (!rows.length) {
        return res.status(400).send({ message: 'User could not be found.' })
      }
      return res.status(204).send({ message: 'User successfully deleted' })
    } catch (err) {
      return res.status(400).send(err)
    }
  }
}

export default new User()