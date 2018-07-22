import express from 'express'
import {
  lights
} from '../services/lifxService'

console.log(lights)

const router = new express.Router()

router.get('/lights', (req, res) =>
  res.status(200).json({
    status: 'ok'
  })
)

export default router
