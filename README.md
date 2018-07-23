# LIFX Web Control

> Web interface for LAN control of LIFX bulbs with REST API

## Build Setup

```bash
# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).

## API

All endpoints are prefixed by `/api/v1`

### `GET /lights`

Gets list of lights

```json
[
  {
    "id": "d073d545688f",
    "address": "192.168.150.101",
    "label": "Awesome 1",
    "status": "on"
  },
  {
    "id": "d123d123456b",
    "address": "192.168.150.102",
    "label": "Awesome 2",
    "status": "on"
  }
]
```

### `GET /lights/:identifier`

As `identifier` you can use label, id or IP address.

Gets info about single light

```json
{
  "id": "d073d545688f",
  "address": "192.168.150.101",
  "label": "Awesome 1",
  "status": "on"
}
```

### `GET /lights/:identifier/state`

Show state of one light, with colors, power,...

```json
{
  "id": "d123d123456b",
  "address": "192.168.150.102",
  "label": "Awesome 2",
  "status": "on",
  "color": {
    "hue": 268,
    "saturation": 0,
    "brightness": 100,
    "kelvin": 3200
  },
  "power": 0
}
```

### `PATCH /lights/:identifier`

Send in payload what you want to change, duration can be omitted:

```json
{
  "power": 1,
  "duration": 4000
}
```

```json
{
  "brightness": 50,
  "hue": 0,
  "saturation": 0,
  "kelvin": 3000,
  "duration": 0
}
```

```json
{
  "brightness": 50
}
```

for value ranges see [node-lifx](https://github.com/MariusRumpf/node-lifx)
