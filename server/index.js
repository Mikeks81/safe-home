import "core-js/stable"
import "regenerator-runtime/runtime"
import express from 'express'
import bodyParser from 'body-parser'
import UserRoutes from './routes/users'
import ContactRoutes from  './routes/contacts'
import TripsRoutes from './routes/trips'

const app = express()
const port = process.env.PORT || 7321

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
TripsRoutes (app)

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })
}

export default app