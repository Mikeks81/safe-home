import Trips from '../controllers/Trips'

export default function (app) {
  /**
 * CONTACTS routes
 */
  app.get('/users/:id/trips', Trips.getAll)
  app.post('/users/:id/trips', Trips.create)
  app.get('/users/:id/trips/:trips_id', Trips.getOne)
  app.put('/users/:id/trips/:trips_id', Trips.update)
  app.delete('/users/:id/trips/:trips_id', Trips.delete)
}