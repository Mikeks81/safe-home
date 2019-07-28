import User from '../controllers/Users'

export default function (app) {
  /**
 * USER routes
 */
  app.get('/users', User.getAll)
  app.get('/user/:id', User.getOne)
  app.post('/users', User.create)
  app.put('/user/:id', User.update)
  app.delete('/user/:id', User.delete)
}