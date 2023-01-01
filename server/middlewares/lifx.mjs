import express from 'express'
import lightService, {
  getLight,
  getLightState,
} from '../services/lifxService.mjs'
import prometheusMetrics from '../services/prometheusMetrics.mjs'

const router = new express.Router()
const lightRouter = new express.Router()
const lights = lightService()
const prometheus = prometheusMetrics()

router.get('/lights', (req, res) => {
  res.status(200).json(lights.getLights())
})

lightRouter.use((req, res, next) => {
  const light = lights.findLight(req.lightIdentifier)
  if (!light) {
    return res.status(404).json()
  }
  if (light.status !== 'on') {
    return res.status(410).json({
      message: 'Light is currently offline',
    })
  }
  req.light = light
  next()
})

lightRouter.get('/', (req, res) => {
  return res.status(200).json(getLight(req.light))
})

lightRouter.get('/state', (req, res) =>
  getLightState(req.light)
    .then((light) => res.status(200).json(light))
    .catch(({ status = 500, error }) => res.status(status).json(error))
)

lightRouter.patch('/', async (req, res) => {
  const {
    power,
    duration = 1000,
    brightness,
    saturation,
    hue,
    kelvin,
  } = req.body
  try {
    const hsbk = {}
    let hsbkChange = false
    if (brightness || brightness === 0) {
      hsbk.brightness = brightness
      hsbkChange = true
    }
    if (saturation || saturation === 0) {
      hsbk.saturation = saturation
      hsbkChange = true
    }
    if (hue || hue === 0) {
      hsbk.hue = hue
      hsbkChange = true
    }
    if (kelvin) {
      hsbk.kelvin = kelvin
      hsbkChange = true
    }
    if (hsbkChange) {
      await lights.setHSBValue(req.light)(hsbk, duration)
    } else if (power !== undefined) {
      lights.setLightStatus(req.light)(power, duration)
    }
  } catch ({ status = 500, message }) {
    return res.status(status).json({
      error: message,
    })
  }
  return res.status(204).send()
})

router.use('/lights/:identifier', (req, res, next) => {
  req.lightIdentifier = req.params.identifier
  return lightRouter(req, res, next)
})

router.get('/metrics', async (req, res) => {
  try {
    const lightMetrics = await lights.getMetrics()
    if (req.headers.accept === 'application/json') {
      return res.status(200).json(lightMetrics)
    }
    return res.status(200).type('text/plain').send(prometheus(lightMetrics))
  } catch (e) {
    return res.status(500).send(e)
  }
})

export default () => router
