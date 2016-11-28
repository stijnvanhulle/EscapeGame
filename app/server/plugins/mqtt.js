/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-16T14:39:10+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-28T14:21:50+01:00
* @License: stijnvanhulle.be
*/

const mqtt = require('mqtt');
const Message = require('../models/Message');

const onMessage = (client, events, io) => {
  client.on('message', function(topic, message) {
    var obj = JSON.parse(message.toString());
    console.log(topic, obj);
    //read: { "port": 5, "type": "INPUT", "read":true,"realtime":false,timeout: null }
    //write { "port": 4, "type": "OUTPUT", "read":false, value:true,"realtime":false,timeout: null }
    //display: { "port": "I2C-1", "type": "OUTPUT", "read":false, "value":"hallo dag stijn","realtime":false,timeout: null }
    //output.writeDisplay("stijn");

    var soundSensor = events.find((x) => x.value == "soundSensor").item;
    var lcd = events.find((x) => x.value == "lcd").item;

    switch (topic) {
      case 'online':
        if (obj.device == 'Box') {
          io.emit('online', obj);
        }

        lcd.writeDisplay("DAG");
        soundSensor.reading(realtime = true, timeout = 10);
        soundSensor.events.on('read', (value) => {
          console.log('Read', value);
          lcd.writeDisplay(value);
        });

        var dect = {
          image1: 'img1.jpg',
          image2: 'img2.jpg',
          read: true,
          realtime: false
        };

      case 'message':
        soundSensor.checkData(obj);
        break;
      default:

    }

  });
};

module.exports.register = (server, options, next) => {
  const client = mqtt.connect('mqtt://' + (process.env.MQTT || "localhost"));
  server.expose('client', client);

  
  let events = [];
  let io,
    plugins;

  client.on('connect', function() {
    console.log('MQTT connected');


    client.subscribe("online");
    client.subscribe("message");
    client.subscribe("detection");

    events.push({
      "value": "soundSensor",
      "item": new Message(client, port = 5, connectorType = "digital")
    });
    events.push({
      "value": "lcd",
      "item": new Message(client, port = "I2C-1")
    });
    plugins = server.plugins;
    if (plugins['socket']) {
      io = plugins['socket'].io;
    }

    onMessage(client, events, io);

    next();

  });

};

module.exports.register.attributes = {
  name: `mqtt`,
  version: `0.1.0`
};
