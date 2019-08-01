import db from './DatabaseHelper'

class CoordinatesHelper {
  async getOne (trip_id, coordinate_id) {
    const query = `SELECT *
                    FROM coordinates
                    WHERE trip_id=$1
                    AND id=$2`
    try {
      return await db.query(query, [trip_id, coordinate_id])
    } catch (err) {
      return err
    }
  }

  async create (attributes = {}, trip_id) {
    const { time, lat, long } = attributes
    const query = `INSERT INTO coordinates(time, lat, long, trip_id)
                    VALUES (to_timestamp($1), $2, $3, $4)
                    RETURNING *`
    if (time instanceof Date && !isNaN(time)) throw Error('time is not a valid date.')
    const values = [
      time,
      lat,
      long,
      trip_id
    ]

    try {
      const { rows } = await db.query(query, values)
      return rows
    } catch (err) {
      return err
    }
  }
  async update () {

  }
  async delete () {

  }
}

export default new CoordinatesHelper()