/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-16T14:39:10+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-05T16:26:33+01:00
* @License: stijnvanhulle.be
*/
const app = require('../lib/app');
const {mqttNames, socketNames, paths} = require('../lib/const');
const beacons = require('../lib/beacons');
const {convertToCsv} = require('../lib/functions')
const Chance = require('chance');
const path = require('path');
const c = new Chance();

const scheduleJob = require('../lib/scheduleJob');
const fileController = require('../controllers/fileController');

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
    let app = require('../lib/app');
    const contains = app.onlineDevice.filter(item => item.device == obj.device).length > 0;

    if (contains) {
      app.onlineDevice = app.onlineDevice.map(item => {
        if (item.device) {
          if (item.device == obj.device) {
            return obj;
          }
        }

      });
    } else {
      app.onlineDevice.push(obj);
    }

    app.users = app.users.map(item => {
      if (item.socketId = socket.id) {
        item.device = obj.device;
      }
      return item;
    });

    console.log('Users:', app.users);
  });

  socket.on(socketNames.DISCONNECT, () => {
    let app = require('../lib/app');
    const {id: socketId} = socket;
    app.users = app.users.filter(c => c.socketId !== socketId);
    console.log('Users:', app.users);
  });
  socket.on(socketNames.INPUT, (obj) => {
    const {input, jobHash, finishDate} = obj;
    let success = scheduleJob.finishJob(jobHash, {finishDate, input});
    if (!success) {
      console.log('job fail', obj);
    }
  });
  socket.on(socketNames.IMAGE, obj => {
    //TODO: change to {data: data, image1:gameData.gameData.data.file}
    try {
      obj = JSON.parse(obj);
      let {data, image1} = obj;

      fileController.saveBase64(c.hash({length: 15}) + '', data).then(result => {
        console.log(result);
        if (result) {
          let obj = {
            image1: path.resolve(path.IMAGES, image1),
            image2: result,
            read: true
          }
          client.publish(mqttNames.DETECTION_FIND, JSON.stringify(obj));
        }

      }).catch(err => {
        console.log(err);
      });
    } catch (e) {
      console.log(e);
    }

  });
  socket.on(socketNames.BEACON, (obj) => {
    try {
      let beacon = JSON.parse(obj);
      let {beaconId, range} = obj;
      beacon.beaconId = beacon.beaconId.toLowerCase();
      beacon.range = parseInt(beacon.range);

      const contains = beacons.items.find(item => {
        if (item) {
          if (item.beaconId == beacon.beaconId) {
            return item;
          };
        }
      });

      if (contains) {
        beacons.items = beacons.items.filter(item => {
          if (item) {
            if (item.beaconId == beacon.beaconId) {
              return beacon;
            }
          }

        });
      } else {
        if (beacon) {
          beacons.items.push(beacon);
        }

      }

      console.log(beacons);
    } catch (e) {
      console.log(e);
    }

  });

  socket.on(socketNames.RECALCULATE_START, (gameId) => {
    const gameController = require('../controllers/gameController');
    gameController.getGameEvents({
      isActive: false
    }, canSort = true).then(gameEvents => {
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
  let app = require('../lib/app');
  app.users = [];
  const io = require(`socket.io`)(server.listener);
  server.expose('io', io);
  if (!io) {
    next('No io made');
    return;
  }
  app.io = io;

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
    app.users.push(me);
    console.log('Users:', app.users);
    onMessageSocket(io, socket, client);
  });

  next();
};

module.exports.register.attributes = {
  name: `socket`,
  version: `0.1.0`
};
