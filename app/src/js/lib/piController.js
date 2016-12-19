/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-12-19T14:46:43+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-19T17:24:38+01:00
* @License: stijnvanhulle.be
*/

let socket;

const PORTS = {
  lights: 6,
  text: "I2C-1"
}
import connectorTypes from './connectorTypes';

connectorTypes.I2C

let piController = {};

piController.loadSocket = (_socket) => {
  socket = _socket;
};

piController.start = (gameEvent, gameData) => {
  return new Promise((resolve, reject) => {
    const data = gameData.data;
    const _data = data.data;
    if (true) {
      if (data.type == "light") {
        socket.emit('sendToPi', {
          port: PORTS.lights,
          type: 'OUTPUT',
          connectorType: connectorTypes.DIGITAL,
          value: _data.answer.name.toLowerCase(),
          read: false,
          realtime: false,
          timeout: 0
        });
      }

      if (data.type == "bom") {
        socket.emit('sendToPi', {
          port: PORTS.text,
          type: 'OUTPUT',
          connectorType: connectorTypes.I2C,
          value: "BOEEEEEEEEM",
          read: false,
          realtime: false,
          timeout: 0
        });
      }

    }

  });
};
piController.end = (gameEvent, gameData) => {
  return new Promise((resolve, reject) => {
    const data = gameData.data;
    const _data = data.data;
    if (data.sendToDevice == 'pi' || data.sendToDevice) {
      if (data.type == "light") {
        socket.emit('sendToPi', {
          port: PORTS.lights,
          type: 'OUTPUT',
          connectorType: "DIGITAL",
          value: false,
          read: false,
          realtime: false,
          timeout: 0
        });
      }

    }

  });
};
piController.finish = (gameEvent, gameData) => {
  return new Promise((resolve, reject) => {
    const data = gameData.data;
    const _data = data.data;
    if (data.sendToDevice == 'pi') {}

  });
};

export default piController;
