import "core-js/stable"
import "regenerator-runtime/runtime"
import express from 'express'
import bodyParser from 'body-parser'
import UserRoutes from './routes/users'
import ContactRoutes from  './routes/contacts'

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

UserRoutes (app)
ContactRoutes (app)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})