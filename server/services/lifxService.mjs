import nodeLifx from 'node-lifx'

const client = new nodeLifx.Client()

export const lights = []

client.on('light-new', light => {
  lights.push(light)
})

client.init()
