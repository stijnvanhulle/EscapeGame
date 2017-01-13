/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-30T20:56:23+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-07T17:57:04+01:00
* @License: stijnvanhulle.be
*/
let {socketNames, mqttNames} = require('./const');
const path = require('path');
const paths = require('./paths');

let app = {
  io: null,
  client: null,
  sockets: {},
  onlineDevice: [],
  users: []
};

//TODO: examen stuff test
app.testImage = (image1 = 'cola.png', image2 = 'cola.png') => {
  try {
    let screen = app.users.find(item => {
      if (item.device == 'screen') {
        return item;
      }
    });
    if (screen) {
      let socket = app.io.to(screen.socketId);

      console.log(process.env.ISDOCKER);
      //for python on same server:
      /*
      let obj = {
        image1: path.resolve(paths.FIXED, image1),
        image2: path.resolve(paths.FIXED, image2),
        read: true
      };
      */
      let obj = {
        image1: path.normalize(paths.VOLUME_PYTHON + '/fixed/' + image1),
        image2: path.normalize(paths.VOLUME_PYTHON + '/' + image2),
        read: true
      };
      console.log(obj);
      app.client.publish(mqttNames.DETECTION_FIND, JSON.stringify(obj));
      //socket.emit(socketNames.IMAGE, obj);

      return true;
    } else {
      return null;
    }

  } catch (e) {
    console.log(e);
    return null;
  }
};

app.testData = (data = [
  {
    duration: null,
    gameDataId: null
  }
], image = 'games.csv') => {
  try {
    console.log(process.env.ISDOCKER);

    let screen = app.users.find(item => {
      if (item.device == 'screen') {
        return item;
      }
    });
    if (screen) {
      let socket = app.io.to(screen.socketId);

      let obj = {
        data,
        file: path.normalize(paths.VOLUME_PYTHON + '/' + image)
      }

      app.client.publish(mqttNames.RECALCULATE_START, JSON.stringify(obj));
      //socket.emit(socketNames.IMAGE, obj);
      return true;
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }

};

app.sendFromSocket = (socketIdOrDevice, emitSub, emitData) => {
  let socket;
  let device = app.users.find(item => {
    if (item.device == socketIdOrDevice) {
      return item;
    }
  });
  if (device) {
    socket = app.io.to(device.socketId);

  } else {
    socket = app.io.to(socketIdOrDevice);
  }
  if (socket) {
    socket.emit(emitSub, emitData);
    return true;
  } else {
    return false;
  }

};
module.exports = app;
