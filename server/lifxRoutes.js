const { Client } = require('node-lifx')

const client = new Client()

const lights = []

client.on('light-new', light => {
  lights.push(light)
})

client.init()

const getLights = (request, reply) => {
  reply
    .type('application/json')
    .code(200)
    .send({
      status: 'ok'
    })
}

const routes = (fastify, options, next) => {
  fastify.get('/lights', getLights)
  next()
}

module.exports = routes
