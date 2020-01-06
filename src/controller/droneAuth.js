const keys = require('../../keys')
const registeredDevices = require('../data/drones')

exports.validateDevice = deviceID => {
    /** Device Name Format: Resin.DroneDevice.23453**/
    let deviceExists = registeredDevices.find(d => d.deviceID === deviceID)

    if (!deviceExists) {
        return /*Reject socket.io connection*/
    }
    let device = deviceID.slice('.')
    return keys.session.secret + device[2]
}
