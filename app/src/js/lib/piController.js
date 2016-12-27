/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-12-19T14:46:43+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-26T15:15:37+01:00
* @License: stijnvanhulle.be
*/

let socket;

const PORTS = {
  lights: 6,
  text: "I2C-1",
  bom:3
}
import connectorTypes from './const/connectorTypes';
import socketNames from './const/socketNames';

connectorTypes.I2C

let piController = {};

piController.loadSocket = (_socket) => {
  socket = _socket;
  piController.end();
};

piController.start = (gameEvent, gameData) => {
  return new Promise((resolve, reject) => {
    const data = gameData.data;
    const _data = data.data;
    if (true) {
      if (data.type == "light") {
        socket.emit(socketNames.PI, {
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
        socket.emit(socketNames.PI, {
          port: PORTS.text,
          type: 'OUTPUT',
          connectorType: connectorTypes.I2C,
          value: "BOEEEEEEEEM",
          read: false,
          realtime: true,
          timeout: 0
        });
        socket.emit(socketNames.PI, {
          port: PORTS.bom,
          type: 'OUTPUT',
          connectorType: connectorTypes.DIGITAL,
          value: true,
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

    try {
      const data = gameData.data;
      const _data = data.data;
    } catch (e) {} finally {
      socket.emit(socketNames.PI_RESET, true);
    }

  });
};
piController.finish = (gameEvent, gameData) => {
  return new Promise((resolve, reject) => {
    try {
      const data = gameData.data;
      const _data = data.data;
    } catch (e) {} finally {
      socket.emit(socketNames.PI_RESET, true);
    }

  });
};

export default piController;
