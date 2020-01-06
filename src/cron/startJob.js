const CronJob = require('cron').CronJob
const cache = require('memory-cache')
const WebSocketClient = require('websocket').client
const client = new WebSocketClient()
const keys = require('../../keys').config
const registeredDevices = require('../data/drones')
const { generateRandomPoint } = require('../utils/geoUtils')

const { validateDevice } = require('../controller/droneAuth')

require('events').EventEmitter.defaultMaxListeners = 0

module.exports = {
    /*eslint-disable */
    droneCronJob: function() {
        new CronJob({
            cronTime: '*/12 * * * * *',
            onTick: async function() {
                client.on('connectFailed', function(error) {
                    console.log('Connect Error: ' + error.toString())
                })

                client.on('connect', function(connection) {
                    console.log(
                        'WebSocket Client Connected on ' +
                            new Date().toUTCString()
                    )
                    connection.on('error', function(error) {
                        console.log('Connection Error: ' + error.toString())
                    })
                    connection.on('close', function() {
                        console.log('echo-protocol Connection Closed')
                    })
                    connection.on('message', function() {
                        /** We are currently not sending data to the drones for the scope of this project */
                    })
                    connection.sendUTF(sendDroneData())
                })

                client.connect(
                    `ws://${keys.HTTP_SERVER.Addr}:${keys.HTTP_SERVER.socketPort}/`,
                    'drone-protocol'
                )

                function sendDroneData() {
                    let meetingPointLat = '51.515419'
                    let meetingPointLong = '-0.141099'

                    let meetingPoint = new LatLng(
                        meetingPointLat,
                        meetingPointLong
                    )

                    function LatLng(lat, lng) {
                        this._lat = parseFloat(lat)
                        this._lng = parseFloat(lng)
                    }

                    if (!cache.get('oldGroup')) {
                        let data = {
                            group: 'aaa',
                            count: 0,
                        }
                        cache.put('oldGroup', data)
                    }
                    var oldGroup = cache.get('oldGroup')
                    if (oldGroup) {
                        if (oldGroup.count <= 3) {
                            let data = {
                                group: oldGroup.group,
                                count: (oldGroup.count = oldGroup.count + 1),
                            }
                            cache.put('oldGroup', data)
                        }
                    }

                    if (oldGroup.count > 3) {
                        let newGroup = pickRandomGroup(cache.get(oldGroup))
                        let data = {
                            group: newGroup,
                            count: 0,
                        }
                        cache.put('oldGroup', data)
                    }

                    function pickRandomGroup(oldGroup) {
                        let groups = ['aaa', 'bbb', 'ccc']
                        delete groups[oldGroup]
                        return groups[
                            Math.floor(Math.random() * (1 - 0 + 1)) + 0
                        ]
                    }

                    oldGroup = cache.get('oldGroup')
                    registeredDevices
                        .filter(
                            registeredDevice =>
                                registeredDevice.group !== oldGroup.group
                        )
                        .map(registeredDevice => {
                            var randomGeoPoints = generateRandomPoints(
                                meetingPoint,
                                1000,
                                1
                            )
                            validateDevice(registeredDevice.deviceID)
                                ? cache.put(
                                      registeredDevice.deviceID,
                                      randomGeoPoints
                                  )
                                : null
                        })

                    registeredDevices
                        .filter(
                            registeredDevice =>
                                registeredDevice.group == oldGroup.group
                        )
                        .map(registeredDevice => {
                            var randomGeoPoints = generateRandomPoints(
                                meetingPoint,
                                1,
                                1
                            )
                            validateDevice(registeredDevice.deviceID)
                                ? cache.put(
                                      registeredDevice.deviceID,
                                      randomGeoPoints
                                  )
                                : null
                        })

                    if (oldGroup.count == 3) {
                        let randomDrone = Math.floor(
                            Math.random() * Math.floor(20)
                        )
                        cache.del(
                            registeredDevices[randomDrone]
                                ? registeredDevices[randomDrone].deviceID
                                : null
                        )
                    }

                    function generateRandomPoints(center, radius, count) {
                        var points = []
                        for (var i = 0; i < count; i++) {
                            points.push(generateRandomPoint(center, radius))
                        }
                        return points
                    }
                    return cache.exportJson()
                }
            },
            start: true,
            timeZone: 'Europe/London',
        })
    },
    /*eslint-enable */
}
