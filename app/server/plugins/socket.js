/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-16T14:39:10+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-05T16:26:33+01:00
* @License: stijnvanhulle.be
*/
const app = require('../lib/app');
const {mqttNames, socketNames} = require('../lib/const');
const {convertToCsv, convertToBool} = require('../lib/functions')
const Chance = require('chance');
const path = require('path');
const paths = require('../lib/paths');
const c = new Chance();

const scheduleJob = require('../lib/scheduleJob');
const fileController = require('../controllers/fileController');

const onMessageSocket = (io, socket, client) => {

  socket.on(socketNames.PI, data => {
    console.log(data);
    client.publish(mqttNames.MESSAGE, JSON.stringify(data));
  });
  socket.on(socketNames.PI_RESET, data => {
    client.publish(mqttNames.RESET, JSON.stringify(true));
  });
  socket.on(socketNames.GAME_CANCEL, ok => {
    const scheduleController = require('../controllers/scheduleController');
    scheduleController.cancelJobs();
  });

  socket.on(socketNames.ONLINE, obj => {
    let app = require('../lib/app');
    try {
      if (typeof(obj) != 'object') {
        obj = JSON.parse(obj);
      }

      console.log(obj);
    } catch (e) {
      console.log(obj, e);
    }
    app.users = app.users.map(item => {
      if (item.socketId == socket.id) {
        item.device = obj.device;
      }
      return item;
    });

    console.log('Users online:', app.users);
    io.sockets.emit(socketNames.ONLINE, app.users);
  });

  socket.on(socketNames.DISCONNECT, () => {
    let app = require('../lib/app');
    const {id: socketId} = socket;
    app.users = app.users.filter(c => c.socketId !== socketId);
    console.log('Users:', app.users);
  });
  socket.on(socketNames.INPUT, (obj) => {
    try {
      obj = JSON.parse(obj);
      console.log(obj);
    } catch (e) {
      console.log(obj, e);
    }

    console.log('input', obj);
    const {input, jobHash, finishDate, letters} = obj;
    let success = scheduleJob.finishJob(jobHash, obj);
    if (!success) {
      console.log('job fail', obj);
    }
  });
  socket.on(socketNames.ADD_ANSWERDATA, obj => {
    console.log(obj);
    let {answerData, gameId} = obj;
    let game;
    const gameController = require('../controllers/gameController');
    if (answerData) {
      gameController.getGame({id: gameId}).then(item => {
        game = item;
        game.addAnswerData(answerData);
        return gameController.updateGame({
          id: game.id
        }, game);
      }).then(ok => {
        console.log('add anserdata to game', game);
      }).catch(err => {
        console.log(err);
      });
    }

  });
  socket.on(socketNames.IMAGE, obj => {
    //TODO: change to {data: data, image1:gameData.gameData.data.file}
    try {
      console.log(obj);
      let isDocker = convertToBool(process.env.ISDOCKER);
      try {
        obj = JSON.parse(obj);
        console.log(obj);
      } catch (e) {
        console.log(obj, e);
      }
      let {data, image1} = obj;

      //TODO: for simon: from gamedata, if fromAnswerData==true=> game.answerdata.image in image1 steken:
      //TODO: gamedata.data.data.file="answerData.image" => "answerData.image" omzetten naar game.answerData.image

      fileController.saveBase64(c.hash({length: 15}) + '', data).then(image2 => {
        if (image2) {
          let obj;
          if (isDocker) {
            obj = {
              //TODO: check of file is in fixes or not in fixed
              image1: path.normalize(paths.VOLUME_PYTHON + '/fixed/' + image1),
              image2: path.normalize(paths.VOLUME_PYTHON + '/' + image2),
              read: true
            };

          } else {
            obj = {
              image1: path.resolve(paths.FIXED, image1),
              image2: image2,
              read: true
            }

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

  socket.on(socketNames.RECALCULATE_START, (gameId) => {
    const gameController = require('../controllers/gameController');
    gameController.getGameEvents({
      isActive: false
    }, canSort = true).then(gameEvents => {
      if (gameEvents && gameEvents.length > 0) {
        return fileController.save(c.hash({length: 15}) + '.csv', convertToCsv(gameEvents, fields = null));
      } else {
        return null;
      }

    }).then(fileName => {
      if (fileName) {
        client.publish(mqttNames.RECALCULATE_START, JSON.stringify(fileName));
      }
    }).catch(err => {
      console.log(err);
    });

  });

  socket.on(socketNames.DETECTION_FIND, (obj) => {
    client.publish(mqttNames.DETECTION_FIND, JSON.stringify(obj));
  });

  socket.on(socketNames.EVENT_FINISH, (obj) => {
    console.log(obj);
    io.sockets.emit(socketNames.EVENT_FINISH, obj);
  });

  //back from client
  socket.on(socketNames.RECALCULATE_DONE, (obj) => {
    console.log(obj);
  });
  socket.on(socketNames.DETECTION_FOUND, obj => {
    console.log(obj);
  });

  let count = 0;
  socket.on(socketNames.BEACON, (obj) => {
    try {
      let beacon = JSON.parse(obj);
      let {beaconId, range} = obj;
      beacon.beaconId = beacon.beaconId.toLowerCase();
      beacon.range = parseInt(beacon.range);

      const contains = app.beacons.find(item => {
        if (item) {
          if (item.beaconId == beacon.beaconId) {
            return item;
          };
        }
      });

      if (contains) {
        app.beacons = app.beacons.map(item => {
          if (item) {
            if (item.beaconId == beacon.beaconId) {
              item = beacon;
            }
            return item;
          }

        });
      } else {
        if (beacon) {
          app.beacons.push(beacon);
        }

      }
      if (count == 10) {
        console.log('BEACONS:', JSON.stringify(app.beacons));
        io.sockets.emit(socketNames.BEACONS, app.beacons);
        count = 0;
      }
      count++;

    } catch (e) {
      console.log(e);
    }

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

  io.on(socketNames.CONNECT_SERVER, socket => {
    const {id: socketId} = socket;

    plugins = server.plugins;
    if (plugins['mqtt']) {
      client = plugins['mqtt'].client;
    }
    const me = {
      socketId
    };
    app.users.push(me);
    onMessageSocket(io, socket, client);
  });

  next();
};

module.exports.register.attributes = {
  name: `socket`,
  version: `0.1.0`
};
