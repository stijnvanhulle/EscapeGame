/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-16T14:39:10+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-30T22:09:31+01:00
* @License: stijnvanhulle.be
*/
const global = require('../lib/global');
const socketNames = require('../lib/socketNames');
let users = [];

const onMessageSocket = (io, socket, client) => {

  socket.on(socketNames.PI, data => {
    client.publish('message', JSON.stringify(data));
  });

  socket.on(socketNames.ONLINE, obj => {});

  socket.on(socketNames.DISCONNECT, () => {
    const {id: socketId} = socket;
    users = users.filter(c => c.socketId !== socketId);
    console.log('Users:', users);
  });
};

module.exports.register = (server, options, next) => {

  const io = require(`socket.io`)(server.listener);
  server.expose('io', io);
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
