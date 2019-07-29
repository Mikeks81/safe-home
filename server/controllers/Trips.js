import db from '../helpers/DatabaseHelper'

class Trips {
  async getAll (req, res) {
    const { user_id } = req.params
    if (!user_id) return res.status(400).send('Please provide a user id.')
    try {
      const query = `SELECT * 
                      FROM trips 
                      WHERE user_id=$1`
      const { rows, rowCount } = await db.query(query, [user_id])
      return res.status(200).send({ rows, rowCount })

    } catch (err) {
      return res.status(400).send(err)
    }
  }

  async getOne (req, res) {
    const { user_id, trip_id } = req.params
    if (!user_id || !trip_id) return res.status(400).send(`Please provide a user id or trips_id.`)
    try {
      const query = `SELECT * 
                      FROM trips 
                      WHERE user_id=$1 
                      AND trips.id=$2`
      const { rows, rowCount } = await db.query(query, [user_id, trip_id])
      return res.status(200).send({ rows, rowCount })
    } catch (err) {
      return res.status(400).send(err)
    }
  }

  async create (req, res) {
    const { user_id } = req.params
    if (!user_id) return res.status(400).send('Provide a user id')
    try {
      const { start, finish, name } = req.body
      const query = `INSERT INTO trips(start, finish, name, user_id) 
                      VALUES (to_timestamp($1), to_timestamp($2), $3, $4)
                      RETURNING *`
      const values = [
        start,
        finish,
        name,
        user_id
      ]

      const { rows } = await db.query(query, values)
      return res.status(201).send(rows)
    } catch (err) {
      return res.status(400).send(err)
    }
  }
  async update (req, res) {
    
  }
  async delete (req, res) {
    
  }
}

export default new Trips()