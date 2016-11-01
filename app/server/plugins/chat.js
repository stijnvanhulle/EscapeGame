/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-16T14:39:10+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-01T15:56:21+01:00
* @License: stijnvanhulle.be
*/



module.exports.register = (server, options, next) => {

  const io = require(`socket.io`)(server.listener);

  let users = [];
  
  io.on(`connection`, socket => {

    const {id: socketId} = socket;

    socket.on(`publicMsg`,
      data => io.emit(`publicMsg`, data)
    );

    socket.on(`joined`,  username => {

      users.push({username, socketId});
      socket.emit(`login`, users);
      socket.broadcast.emit(`join`, username);

    });

    socket.on(`disconnect`, () => {
      const user = users.find(u => u.socketId === socketId);
      if(user) socket.broadcast.emit(`leave`, user.username);
      users = users.filter(u => u.socketId !== socketId);
    });

  });

  next();

};

module.exports.register.attributes = {
  name: `chat`,
  version: `0.1.0`
};
