/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-16T14:39:10+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-20T17:19:37+01:00
* @License: stijnvanhulle.be
*/
const global = require('../lib/global');
const socketNames = require('../lib/socketNames');
const mqttNames = require('../lib/mqttNames');
const scheduleJob = require('../lib/scheduleJob');
let users = [];

let onlineDevice = [];

const onMessageSocket = (io, socket, client) => {

  socket.on(socketNames.PI, data => {
    client.publish(mqttNames.MESSAGE, JSON.stringify(data));
  });
  socket.on(socketNames.PI_RESET, data => {
    client.publish(mqttNames.RESET, JSON.stringify(true));
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
    let success = scheduleJob.finishNextJob(jobHash, {finishDate, input});
  });
  socket.on(socketNames.BEACON, (obj) => {
    console.log(obj);
    const {beaconId, range} = obj;
    console.log(beaconId, range);
  });

  socket.on(socketNames.DETECTION_FIND, (obj) => {
    client.public(mqttNames.DETECTION_FIND, JSON.stringify(obj));
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
