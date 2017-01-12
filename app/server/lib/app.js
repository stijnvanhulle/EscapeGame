/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-30T20:56:23+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-07T17:57:04+01:00
* @License: stijnvanhulle.be
*/

let app = {
  io: null,
  mqtt: null,
  onlineDevice: [],
  users: []
};

//TODO: examen stuff test
app.testImage = () => {
  let screen = app.users.find(item => {
    if (item.device == 'screen') {
      return item;
    }
  });
  if (screen) {
    let socket = app.io.to(screen.socketId);
    socket.emit('online', 'sdfs');
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
