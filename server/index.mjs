import express from 'express'
import bodyParser from 'body-parser'
import lifx from './middlewares/lifx.mjs'

const app = express()

const port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use('/api/v1', lifx())
// app.use(middlewares.nuxt())

// Listen the server
app.listen(port, (err) => {
  if (err) throw err
  console.log(`server listening on ${port}`)
})
