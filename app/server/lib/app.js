/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-30T20:56:23+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-07T17:57:04+01:00
* @License: stijnvanhulle.be
*/
let {socketNames, mqttNames} = require('./const');
const {convertToBool} = require('../lib/functions');
const scheduleJob = require('../lib/scheduleJob');
const {removeDataFromModel} = require('../controllers/lib/functions');
const path = require('path');
const paths = require('./paths');

const {Game: GameModel, GameEvent: GameEventModel} = require('../models/mongo');
let app = {
  io: null,
  client: null,
  sockets: {},
  onlineDevice: [],
  users: [],
  beacons: []
};

//TODO: examen stuff test
app.testImage = (image1 = 'schilderij_1.jpg', image2 = 'schilderij_1_small.jpg') => {
  try {
    let screen = app.users.find(item => {
      if (item.device == 'screen') {
        return item;
      }
    });
    if (screen) {
      let socket = app.io.to(screen.socketId);
      let isDocker = convertToBool(process.env.ISDOCKER);

      let obj;;
      if (isDocker) {
        obj = {
          image1: path.normalize(paths.VOLUME_PYTHON + '/fixed/' + image1),
          image2: path.normalize(paths.VOLUME_PYTHON + '/' + image2),
          read: true
        };

      } else {
        obj = {
          image1: path.resolve(paths.FIXED, image1),
          image2: path.resolve(paths.FIXED, image2),
          read: true
        };
      }
      console.log(obj);
      app.client.publish(mqttNames.DETECTION_FIND, JSON.stringify(obj));
      //socket.emit(socketNames.IMAGE, obj);
    } else {
      console.log('No screen attached');
    }

  } catch (e) {
    console.log(e);
  }
};

app.testData = (data = [
  {
    duration: null,
    gameDataId: null
  }
], file = 'games.csv') => {
  try {
    let isDocker = convertToBool(process.env.ISDOCKER);

    let screen = app.users.find(item => {
      if (item.device == 'screen') {
        return item;
      }
    });
    if (screen) {
      let socket = app.io.to(screen.socketId);
      let obj;
      if (isDocker) {
        obj = {
          data,
          file: path.normalize(paths.VOLUME_PYTHON + '/' + file)
        }
      } else {
        //TODO; chage
        obj = {
          data,
          file: path.resolve(paths.FIXED, file)
        };
      }

      app.client.publish(mqttNames.RECALCULATE_START, JSON.stringify(obj));
      //socket.emit(socketNames.IMAGE, obj);

    } else {
      console.log('No screen attached');
    }
  } catch (e) {
    console.log(e);
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
  } else {
    console.log('No socket attached');
  }

};
app.endSocketConnection = (deviceName) => {
  try {
    let devices = app.users.filter(item => {
      if (item.device == deviceName) {
        return item;
      }
    });
    if (devices && devices.length > 0) {
      for (var i = 0; i < devices.length; i++) {
        let device = devices[i];
        let socket = app.io.to(device.socketId);
        socket.emit(socketNames.DISCONNECT, reconnect = false);
      }

    }
  } catch (e) {
    console.log(e);
  }
};
app.reset = () => {
  const restartGame = () => {
    return new Promise((resolve, reject) => {
      GameModel.update({}, {
        isFinished: false,
        isPlaying: false,
        duration: 0
      }, {
        multi: true
      }, function(err, raw) {
        if (err) {
          reject(err);
        } else {
          resolve("Reset all games to start state");
        }
      });
    });
  };

  restartGame().then(log => {
    console.log(log);
    return removeDataFromModel(GameEventModel);
  }).then(log => {
    console.log("removed gamevents");
    return scheduleJob.cancelAll();
  }).then(log => {
    console.log(log);
    //process.exit(0);
  }).catch(err => {
    console.log(err);
  });

};
module.exports = app;
