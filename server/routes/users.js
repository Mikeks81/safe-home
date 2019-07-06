import User from '../controllers/Users'

export default function (app) {
  /**
 * USER routes
 */
  app.get('/users', User.getAll)
  app.get('/users/:id', User.getOne)
  app.post('/users', User.create)
  app.put('/users/:id', User.update)
  app.delete('/users/:id', User.delete)
}