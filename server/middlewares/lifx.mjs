import express from 'express'
import {
  getLights,
  getLight,
  getLightState,
  setLightStatus,
  setHSBValue,
  findLight
} from '../services/lifxService'


const router = new express.Router()
const lightRouter = new express.Router()

router.get('/lights', (req, res) => {
  res.status(200).json(getLights())
})

lightRouter.use((req, res, next) => {
  const light = findLight(req.lightIdentifier)
  if (!light) {
    return res.status(404).json()
  }
  req.light = light
  next()
})

lightRouter.get('/', (req, res) => {
  return res.status(200).json(getLight(req.light))
})

lightRouter.get('/state', (req, res) =>
  getLightState(req.light)
  .then(light => res.status(200).json(light))
  .catch(({
    status = 500,
    error
  }) => res.status(status).json(error))
)

lightRouter.patch('/', async (req, res) => {
  const {
    power,
    duration = 1000,
    brightness,
    saturation,
    hue,
    kelvin
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
      await setHSBValue(req.light)(hsbk, duration)
    } else if (power) {
      setLightStatus(req.light)(status, duration)
    }
  } catch ({
    status = 500,
    message
  }) {
    return res.status(status).json({
      error: message
    })
  }
  return res.status(204).send()
})

router.use('/lights/:identifier', (req, res, next) => {
  req.lightIdentifier = req.params.identifier
  return lightRouter(req, res, next)
})

export default () => router
