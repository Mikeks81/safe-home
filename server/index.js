import "core-js/stable"
import "regenerator-runtime/runtime"
import express from 'express'
import bodyParser from 'body-parser'
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

require('./routes/users')(app)
require('./routes/contacts')(app)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})