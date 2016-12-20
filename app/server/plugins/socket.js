/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-16T14:39:10+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-19T17:41:47+01:00
* @License: stijnvanhulle.be
*/
const global = require('../lib/global');
const socketNames = require('../lib/socketNames');
const scheduleJob = require('../lib/scheduleJob');
let users = [];

const onMessageSocket = (io, socket, client) => {

  socket.on(socketNames.PI, data => {
    client.publish('message', JSON.stringify(data));
  });
  socket.on(socketNames.PI_RESET, data => {
    client.publish('reset', true);
  });

  socket.on(socketNames.ONLINE, obj => {
    console.log(obj);
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
    const {beaconId, range} = obj;
    console.log(beaconId, range);
  });

  socket.on(socketNames.EVENT_FINISH, (obj) => {
    console.log(obj);
    io.emit(socketNames.EVENT_FINISH,obj);
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
