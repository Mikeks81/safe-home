import Contacts from '../controllers/Contacts'

export default function (app) {
  /**
 * CONTACTS routes
 */
  app.get('/user/:user_id/contacts', Contacts.getAll)
  app.post('/user/:user_id/contacts', Contacts.create)
  app.get('/user/:user_id/contact/:contact_id', Contacts.getOne)
  app.put('/user/:user_id/contact/:contact_id', Contacts.update)
  app.delete('/user/:user_id/contact/:contact_id', Contacts.delete)
}