/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-16T14:39:10+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-15T21:42:38+01:00
* @License: stijnvanhulle.be
*/

const mqtt = require('mqtt');

module.exports.register = (server, options, next) => {
  const client = mqtt.connect('mqtt://localhost');

  client.on('connect', function() {
    console.log('MQTT connected');
    server.expose('client', client);

    client.subscribe("online");
    client.subscribe("message");
    next();
  });
  client.on('message', function(topic, message) {
    var obj = JSON.parse(message.toString());
    console.log(topic, obj);
    //read: { "port": 5, "type": "INPUT", "read":true }
    //write { "port": 4, "type": "OUTPUT", "read":false, value:true }
    //display: { "port": "I2C-1", "type": "OUTPUT", "read":false, "value":"hallo dag stijn" }
    switch (topic) {
      case 'online':
        var mes = {
          port: 4,
          type: 'OUTPUT',
          value: true,
          read:false
        };
        client.publish('message', JSON.stringify(mes));

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
