const fastify = require('fastify')
const { Nuxt, Builder } = require('nuxt')
const lifxRoutes = require('./lifxRoutes')

const app = fastify({
  logger: true
})

const port = process.env.PORT || 3000

// Import and Set Nuxt.js options
const configNuxt = require('../nuxt.config.js')
configNuxt.dev = !(process.env.NODE_ENV === 'production')

// Init Nuxt.js
const nuxt = new Nuxt(configNuxt)

// Build only in dev mode
if (configNuxt.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

app.register(lifxRoutes, {
  prefix: '/api/v1'
})

app.use(nuxt.render)

// Listen the server
app.listen(port, err => {
  if (err) throw err
  console.log(`server listening on ${app.server.address().port}`)
})
