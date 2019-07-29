import db from '../helpers/DatabaseHelper'
import TripsHelper from '../helpers/TripsHelper';

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
      const { rows, rowCount } = await TripsHelper.getTrip(user_id, trip_id)
      if (!rows) return res.status(400).send('Could not locate trip')
      return res.status(200).send({ rows, rowCount })
    } catch (err) {
      console.log({ err })
      return res.status(400).send(err)
    }
  }

  async create (req, res) {
    const { user_id } = req.params
    if (!user_id) return res.status(400).send('Provide a user id')
    try {
      const rows = await TripsHelper.create(req.body, user_id)
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