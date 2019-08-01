import db from '../helpers/DatabaseHelper'
import CoordinatesHelper from '../helpers/CoordinatesHelper';
class Coordinates {
  async getAll (req, res) {
    const { trip_id } = req.params
    const query = `SELECT *
                    FROM coordinates
                    WHERE trip_id = $1`
    try {
      const { rows, rowCount } = await db.query(query, [trip_id])
      return  res.status(200).send({ rows, rowCount })
    } catch (err) {
      return res.status(400).send(err)
    }
  }
  async getOne (req, res) {
    const { trip_id, coordinate_id } = req.params
    console.log({ trip_id, coordinate_id })
    try {
      const { rows } = await CoordinatesHelper.getOne(trip_id, coordinate_id)
      return res.status(200).send({ rows })
    } catch (err) {
      console.log({ err })
      return res.status(400).send(err)
    }

    return res.status(200).send('ok')
  }
  async create (req, res) {
    const { trip_id } = req.params
    try {
      const response = await CoordinatesHelper.create(req.body, trip_id)
      console.log({ response })
      if (response.error) return res.status(400).send(response.error)
      return res.status(201).send({ response })
    } catch (err) {
      return res.status(400).send(err) 
    }
  }
  async update (req, res) {
    return res.status(200).send('ok')
  }
  async delete (req, res) {
    return res.status(200).send('ok')
  }
}

export default new Coordinates()