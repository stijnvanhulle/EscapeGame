/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-12-19T14:46:43+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-04T13:41:29+01:00
* @License: stijnvanhulle.be
*/

import connectorTypes from './const/connectorTypes';
import socketNames from './const/socketNames';

let piController = {
  PORTS: {
    lights: 6,
    text: "I2C-1",
    bom: 3
  },
  socket: null,
  type: null
};

piController.loadSocket = (_socket) => {
  piController.socket = _socket;
  piController.end();
};

piController.tickBom = (time) => {
  let socket=piController.socket;

  socket.emit(socketNames.PI, {
    port: piController.PORTS.text,
    type: 'OUTPUT',
    connectorType: connectorTypes.I2C,
    value: 'TIME: ' + time.toString(),
    read: false,
    realtime: true,
    timeout: 0
  });
};

piController.start = (gameEvent, gameData) => {
  return new Promise((resolve, reject) => {
    let socket=piController.socket;

    const data = gameData.data;
    const _data = data.data;
    if (true) {
      piController.type = data.type;

      if (data.type == "light") {
        socket.emit(socketNames.PI, {
          port: piController.PORTS.lights,
          type: 'OUTPUT',
          connectorType: connectorTypes.DIGITAL,
          value: _data.answer.name.toLowerCase(),
          read: false,
          realtime: false,
          timeout: 0
        });
      }

      if (data.type == "bom") {
      
        /*socket.emit(socketNames.PI, {
          port: PORTS.bom,
          type: 'OUTPUT',
          connectorType: connectorTypes.DIGITAL,
          value: true,
          read: false,
          realtime: false,
          timeout: 0
        });
        */
      }

    }

  });
};
piController.end = (gameEvent, gameData) => {
  return new Promise((resolve, reject) => {
    let socket=piController.socket;
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
    let socket=piController.socket;
    try {
      const data = gameData.data;
      const _data = data.data;
    } catch (e) {} finally {
      socket.emit(socketNames.PI_RESET, true);
    }

  });
};

export default piController;
