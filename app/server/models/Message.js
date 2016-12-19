/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-13T18:09:11+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-19T17:15:54+01:00
* @License: stijnvanhulle.be
*/
const EventEmitter = require('events');
const connectorTypes= require('../lib/connectorTypes');

//read: { "port": 5, "type": "INPUT", "read":true,"realtime":false,timeout: null }
//write { "port": 4, "type": "OUTPUT", "read":false, value:true,"realtime":false,timeout: null }
//display: { "port": "I2C-1", "type": "OUTPUT", "read":false, "value":"hallo dag stijn","realtime":false,timeout: null }
//
/*var mes = {
          port: 6,
          type: 'INPUT',
          value: null,
          read: true,
          realtime: true,
          timeout:0
        };*/
const recheckData = (self) => {
  if (self.read) {
    self.type = "INPUT";
  } else {
    self.type = "OUTPUT";
  }
  return self;
};

class Emitter extends EventEmitter {}

class Message {
  constructor(client, port,connectorType=connectorTypes.DIGITAL, read = false) {
    if (!client) {
      throw new Error('No client');
      return;
    }
    this.client = client;
    this.port = port;
    this.read = read;
    this.connectorType=connectorType;
    this.reset();
  }

  reset() {
    this.events = new Emitter();

    this.type = recheckData(this).type;

    this.realtime = false;
    this.timeout = 0;
    this.value = null;
    this.isReading = false;
  }

  reading(realtime = false, timeout = 0) {
    this.read = true;
    this.type = recheckData(this).type;
    this.realtime = realtime;
    this.timeout = timeout;

    this.push();
  }

  write(value) {
    this.value = value;
    this.push();
  }
  writeDisplay(value, port = "I2C-1") {
    this.connectorType=connectorTypes.I2C;
    this.value = value;
    this.port = port;

    this.push();

  }
  on() {
    this.value = true;

    this.push();
  }
  off() {
    this.value = false;

    this.push();
  }
  checkImage(image1, image2) {
    this.image1 = image1;
    this.image2 = image2;

    this.push();
  }
  checkData(obj) {
    if (this.port == obj.port) {
      if (obj.value && obj.isReading) {
        var value=obj.value;
        try {
          value= JSON.parse(obj.value);
        } catch (e) {
          console.log(e);
        }
        this.events.emit('read', value);
      }

    }

  }
  push(client = this.client) {
    try {
      if (!client) {
        throw new Error('No client');
        return;
      }

      client.publish('message', this.json());
    } catch (e) {
      console.log(e);
    }

  }
  json() {
    var json;
    try {
      var obj = this;
      var copy = Object.assign({}, obj);
      copy.events = null;
      copy.client = null;
      json = JSON.stringify(copy);

    } catch (e) {
      console.log(e);
      json = JSON.stringify({});
    } finally {
      return json;
    }
  }

}

module.exports = Message;
