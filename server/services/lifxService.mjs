import nodeLifx from 'node-lifx'

const p = fn =>
  new Promise((resolve, reject) => {
    fn((error, data) => {
      if (error) {
        return reject({
          status: 500,
          error
        })
      }
      return resolve(data)
    })
  })

let lights = []

export const findLight = identifier => lights.find(
  light =>
  light.id === identifier ||
  light.label === identifier ||
  light.address === identifier
)

const mapLight = ({
  id,
  address,
  label,
  status
} = {}) => ({
  id,
  address,
  label,
  status
})

export const getLights = () => lights.map(mapLight)

export const getLight = light => mapLight(light)

export const getLightState = light => {
  return new Promise((resolve, reject) =>
    light.getState((error, data) => {
      if (error) {
        return reject({
          status: 500,
          error
        })
      }
      return resolve({
        ...mapLight(light),
        ...data
      })
    })
  )
}

function* getLightDetails() {
  for (const light of lights) {
    if (light.status === 'off') {
      yield Promise.resolve(getLight(light))
    } else {
      yield getLightState(light);
    }
  }
}

export const getMetrics = async () => {
  try {
    const lights = []
    for (let light of getLightDetails()) {
      lights.push(await light)
    }
    return lights
  } catch (e) {
    throw (e)
  }
}

export const setLightStatus = light => (power, duration = 1000) => light[power === 0 ? "off" : "on"](duration)

const argPosition = {
  hue: 0,
  saturation: 1,
  brightness: 2,
  kelvin: 3
}

export const setHSBValue = light => (values, duration) => new Promise((resolve, reject) =>
  light.getState((error, data) => {
    if (error) {
      return reject({
        status: 500,
        error
      })
    }
    if (data.power === 0) {
      light.on()
    }
    const args = [data.color.hue, data.color.saturation, data.color.brightness, data.color.kelvin]
    Object.entries(values).forEach(([key, value]) => {
      args[argPosition[key]] = value
    })
    try {
      light.color(...args, duration)
    } catch (e) {
      return reject(e)
    }
    return resolve()
  })
)

export default () => {
  const client = new nodeLifx.Client()

  client.on('light-new', light => {
    lights.push(light)
  })

  client.on('light-online', light => {
    const foundLight = findLight(light.id)
    if (foundLight) {
      lights = lights.map(l => (l.id === light.id ? light : l))
      return
    }
    lights.push(light)
  })

  client.on('light-offline', light => {
    const foundLight = findLight(light.id)
    if (foundLight) {
      lights = lights.map(l => (l.id === light.id ? light : l))
      return
    }
    lights.push(light)
  })

  client.init()
  return {
    getLights,
    getLight,
    getLightState,
    setLightStatus,
    setHSBValue,
    findLight,
    getMetrics
  }
}
