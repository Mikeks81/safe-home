import Coordinates from '../controllers/Coordinates'

const coordinateRoutes = (app) => {
  app.get('/trip/:trip_id/coordinates', Coordinates.getAll)
  app.post('/trip/:trip_id/coordinates', Coordinates.create)
  app.get('/trip/:trip_id/coordinate/:coordinate_id', Coordinates.getOne)
  app.put('/trip/:trip_id/coordinate/:coordinate_id', Coordinates.update)
  app.delete('/trip/:trip_id/coordinate/:coordinate_id', Coordinates.delete)
}

export default coordinateRoutes