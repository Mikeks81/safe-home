import "core-js/stable"
import "regenerator-runtime/runtime"
import express from 'express'
import bodyParser from 'body-parser'
import User from './controllers/Users'
import Contacts from "./controllers/Contacts";
const app = express()
const port = 7321

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

/**
 * USER routes
 */
app.get('/users', User.getAll)
app.get('/users/:id', User.getOne)
app.post('/users', User.create)
app.put('/users/:id', User.update)
app.delete('/users/:id', User.delete)

/**
 * CONTACTS routes
 */
app.get('/users/:id/contacts', Contacts.getAll)
app.post('/users/:id/contacts', Contacts.create)
app.get('/users/:id/contacts/:contact_id', Contacts.getOne)
app.delete('/users/:id/contacts/:contact_id', Contacts.delete)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})