import prometheus from 'prometheus-wrapper'

const LABELS = [
  'label',
  'id',
  'address'
]

export default () => {
  prometheus.setNamespace('lifx')
  prometheus.createGauge('status', 'Light connection status', LABELS)
  prometheus.createGauge('hue', 'Light hue', LABELS)
  prometheus.createGauge('saturation', 'Light saturation', LABELS)
  prometheus.createGauge('brightness', 'Light brightness', LABELS)
  prometheus.createGauge('kelvin', 'Light color in kelvins', LABELS)
  prometheus.createGauge('power', 'Light power', LABELS)

  return lights => {
    for (let light of lights) {
      const lightLabels = {
        label: light.label,
        id: light.id,
        address: light.address
      }
      prometheus.get('status').set(lightLabels, light.status === 'on' ? 1 : 0)
      if (light.status === 'on') {
        ['hue', 'saturation', 'brightness', 'kelvin'].forEach(metric => {
          prometheus.get(metric).set(lightLabels, light.color[metric])
        })
        prometheus.get('power').set(lightLabels, light.power)
      }
    }

    return prometheus.getMetrics()
  }
}
