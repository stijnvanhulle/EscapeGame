/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-16T14:39:10+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-21T16:54:47+01:00
* @License: stijnvanhulle.be
*/

const mqtt = require('mqtt');

module.exports.register = (server, options, next) => {
  const client = mqtt.connect('mqtt://' + (process.env.MQTT || "localhost"));

  client.on('connect', function() {
    console.log('MQTT connected');
    server.expose('client', client);

    client.subscribe("online");
    client.subscribe("message");
    client.subscribe("detection");
    next();
  });
  client.on('message', function(topic, message) {
    var obj = JSON.parse(message.toString());
    console.log(topic, obj);
    //read: { "port": 5, "type": "INPUT", "read":true,"realtime":false,timeout: null }
    //write { "port": 4, "type": "OUTPUT", "read":false, value:true,"realtime":false,timeout: null }
    //display: { "port": "I2C-1", "type": "OUTPUT", "read":false, "value":"hallo dag stijn","realtime":false,timeout: null }
    //display: { "port": "I2C-1", "type": "OUTPUT", "read":false, "value":"hallo dag stijn","realtime":false,timeout: null }
    switch (topic) {
      case 'online':

        /*var mes = {
          port: 6,
          type: 'INPUT',
          value: null,
          read: true,
          realtime: true,
          timeout:0
        };*/

        var mes = {
          port: 4,
          type: 'OUTPUT',
          value: "STIJN",
          read: false,
          realtime: false,
          timeout:0
        };
        client.publish('message', JSON.stringify(mes));
        var dect = {
          image1: 'img1.jpg',
          image2: 'img2.jpg',
          read: true,
          realtime: false
        };
        //client.publish('detection', JSON.stringify(dect));

      case 'message':

        break;
      default:

    }

  });

};

module.exports.register.attributes = {
  name: `mqtt`,
  version: `0.1.0`
};
