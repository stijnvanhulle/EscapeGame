/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-16T14:39:10+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-28T14:19:49+01:00
* @License: stijnvanhulle.be
*/
module.exports.register = (server, options, next) => {

  const io = require(`socket.io`)(server.listener);
  server.expose('io', io);

  let client,
    plugins;
  let users = [];

  io.on(`connection`, socket => {
    const {id: socketId} = socket;

    plugins = server.plugins;
    if (plugins['mqtt']) {
      client = plugins['mqtt'].client;
    }

    console.log('Socket connection', socket.id);

    socket.on('sendToPi', data => {
      client.publish('message', JSON.stringify(data));
    });

    socket.on(`online`, obj => {

      users.push({username, socketId});
      socket.emit(`login`, users);
      socket.broadcast.emit(`join`, username);

    });

    socket.on(`disconnect`, () => {
      const user = users.find(u => u.socketId === socketId);
      if (user)
        socket.broadcast.emit(`leave`, user.username);
      users = users.filter(u => u.socketId !== socketId);
    });
  });

  next();
};

module.exports.register.attributes = {
  name: `socket`,
  version: `0.1.0`
};
