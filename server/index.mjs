import express from 'express'
import bodyParser from 'body-parser'
import middlewares from './middlewares'

const app = express()

const port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use('/api/v1', middlewares.lifx())
// app.use(middlewares.nuxt())

// Listen the server
app.listen(port, err => {
  if (err) throw err
  console.log(`server listening on ${port}`)
})
