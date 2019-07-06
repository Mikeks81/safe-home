import Contacts from '../controllers/Contacts'

export default function (app) {
  /**
 * CONTACTS routes
 */
  app.get('/users/:id/contacts', Contacts.getAll)
  app.post('/users/:id/contacts', Contacts.create)
  app.get('/users/:id/contacts/:contact_id', Contacts.getOne)
  app.put('/users/:id/contacts/:contact_id', Contacts.update)
  app.delete('/users/:id/contacts/:contact_id', Contacts.delete)
}