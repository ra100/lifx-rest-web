import configNuxt from '../../nuxt.config.js'
import nuxt from 'nuxt'
const {
  Nuxt,
  Builder
} = nuxt

export default () => {
  // Import and Set Nuxt.js options
  configNuxt.dev = !(process.env.NODE_ENV === 'production')

  // Init Nuxt.js
  const nuxtMiddleware = new Nuxt(configNuxt)

  // Build only in dev mode
  if (configNuxt.dev) {
    const builder = new Builder(nuxtMiddleware)
    builder.build()
  }
  return nuxtMiddleware.render
}
