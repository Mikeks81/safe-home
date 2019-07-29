import Trips from '../controllers/Trips'

export default function (app) {
  /**
 * CONTACTS routes
 */
  app.get('/user/:user_id/trips', Trips.getAll)
  app.post('/user/:user_id/trips', Trips.create)
  app.get('/user/:user_id/trip/:trip_id', Trips.getOne)
  app.put('/user/:user_id/trip/:trip_id', Trips.update)
  app.delete('/user/:user_id/trip/:trip_id', Trips.delete)
}