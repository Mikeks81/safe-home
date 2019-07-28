import db from './helpers/DatabaseHelper'
import Helper from './helpers/Helpers'
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
      return res.status(200).send({ rows, rowCount, params: req.params })
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
    const { fname, lname, email, password, phone } = req.body
    const hashPassword = Helper.hashPassword(password);

    const createQuery = `INSERT INTO
      users(fname, lname, email, password, phone)
      VALUES($1, $2, $3, $4, $5)
      returning *`;
    const values = [
      fname,
      lname,
      email,
      hashPassword,
      phone
    ];

    try {
      const { rows } = await db.query(createQuery, values);
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
    const { fname, lname, phone, email } = req.body
    if (!id) {
      return res.status(404).send({ message: 'Missing Id'})
    }
    const getUser = 'SELECT * FROM users WHERE id = $1'
    const updateUser = 'UPDATE users SET fname=$1, lname=$2, email=$3, phone=$4, updated_at=$5 WHERE id=$6 RETURNING *'
    try {
      const { rows } = await db.query(getUser, [id])
      if (!rows.length) {
        return res.status(404).send({ 'message': 'Could not find user.' })
      }

      const values = [
        fname || rows[0].fname,
        lname || rows[0].lname,
        email || rows[0].email,
        phone || rows[0].phone,
        moment(new Date()),
        id
      ]
      const response = await db.query(updateUser, values)
      return res.status(200).send(response.rows[0])
    } catch (err) {
      return res.status(400).send(err)
    }
    
  }

  async delete (req, res) {
    const { id } = req.params
    if (!id) return res.status(400).send({ 'message': 'Missing Id' })
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *'
    try {
      const { rows } = await db.query(query, [id])
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