/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-16T14:39:10+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-04T20:16:19+01:00
* @License: stijnvanhulle.be
*/
const global = require('../lib/global');
const {mqttNames, socketNames} = require('../lib/const');
const beacons = require('../lib/beacons');
const {convertToCsv} = require('../lib/functions')
const Chance = require('chance');
const c = new Chance();

const scheduleJob = require('../lib/scheduleJob');
const fileController = require('../controllers/fileController');
let users = [];
let onlineDevice = [];

const cancelJobs = (hash) => {
  if (hash) {
    return scheduleJob.cancel(hash);
  } else {
    return scheduleJob.cancelAll();
  }
};

const onMessageSocket = (io, socket, client) => {

  socket.on(socketNames.PI, data => {
    client.publish(mqttNames.MESSAGE, JSON.stringify(data));
  });
  socket.on(socketNames.PI_RESET, data => {
    client.publish(mqttNames.RESET, JSON.stringify(true));
  });
  socket.on(socketNames.GAME_CANCEL, ok => {
    const gameController = require('../controllers/gameController');
    gameController.cancelJobs();
  });

  socket.on(socketNames.ONLINE, obj => {
    const contains = onlineDevice.filter(item => item.device == obj.device).length > 0;

    if (contains) {
      onlineDevice = onlineDevice.map(item => {
        if (item.device) {
          if (item.device == obj.device) {
            return obj;
          }
        }

      });
    } else {
      onlineDevice.push(obj);
    }

    console.log('ONLINE DEVICES: ', onlineDevice);
  });

  socket.on(socketNames.DISCONNECT, () => {
    const {id: socketId} = socket;
    users = users.filter(c => c.socketId !== socketId);
    console.log('Users:', users);
  });
  socket.on(socketNames.INPUT, (obj) => {
    const {input, jobHash, finishDate} = obj;
    let success = scheduleJob.finishJob(jobHash, {finishDate, input});
    if (!success) {
      console.log('job fail', obj);
    }
  });
  socket.on(socketNames.BEACON, (obj) => {
    console.log(obj);
    const {beaconId, range} = obj;
    console.log(beaconId, range);

    const contains = beacons.filter(item => item.beaconId == obj.beaconId).length > 0;

    if (contains) {
      beacons = beacons.map(item => {
        if (item.beaconId == obj.beaconId) {
          return obj;
        }
      });
    } else {
      beacons.push(obj);
    }

  });

  socket.on(socketNames.RECALCULATE_START, (gameId) => {
    const gameController = require('../controllers/gameController');
    gameController.getGameEvents({isActive: false}).then(gameEvents => {
      return fileController.save(c.hash({length: 15}) + '.csv', convertToCsv(gameEvents, fields = null));
    }).then(fileName => {
      client.publish(mqttNames.RECALCULATE_START, JSON.stringify(fileName));
    }).catch(err => {
      console.log(err);
    });

  });
  socket.on(socketNames.RECALCULATE_DONE, (obj) => {
    //update gameEvents
  });

  socket.on(socketNames.DETECTION_FIND, (obj) => {
    client.publish(mqttNames.DETECTION_FIND, JSON.stringify(obj));
  });

  socket.on(socketNames.EVENT_FINISH, (obj) => {
    console.log(obj);
    io.emit(socketNames.EVENT_FINISH, obj);
  });
};

module.exports.register = (server, options, next) => {
  users = [];
  const io = require(`socket.io`)(server.listener);
  server.expose('io', io);
  if (!io) {
    next('No io made');
    return;
  }
  global.io = io;

  let client,
    plugins;

  io.on(socketNames.CONNECT, socket => {
    const {id: socketId} = socket;

    plugins = server.plugins;
    if (plugins['mqtt']) {
      client = plugins['mqtt'].client;
    }
    const me = {
      socketId
    };
    users.push(me);
    console.log('Users:', users);
    onMessageSocket(io, socket, client);
  });

  next();
};

module.exports.register.attributes = {
  name: `socket`,
  version: `0.1.0`
};
