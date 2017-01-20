/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-13T18:09:11+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-12T15:24:44+01:00
* @License: stijnvanhulle.be
*/
const EventEmitter = require('events');
const moment = require('moment');
const {setToMoment} = require('../lib/functions');
//const {GameEvent: Model} = require('./mongo');

class Emitter extends EventEmitter {}

class Beacon {
  constructor({beaconId}) {
    this.reset();

  }

  reset() {
    this.range = 0;
    this.events = new Emitter();
  }

  load({range, beaconId}) {
    try {
      this.range = range
        ? parseFloat(range)
        : this.range;
      this.beaconId = beaconId
        ? beaconId
        : this.beaconId;
    } catch (e) {
      console.log(e);
      throw e;
    }

    return this;
  }



  save() {
    return new Promise((resolve, reject) => {
      try {
        const item = this.json(false);
        const obj = new Model(item);
        //console.log('Will save: ', obj);

        obj.save(function(err, item) {
          if (err) {
            reject(err);
          } else {
            resolve(item);
          }
        });
      } catch (e) {
        reject(e);
      }

    });
  }

  json(stringify = true, removeEmpty = false) {
    var json;
    try {
      var obj = this;
      var copy = Object.assign({}, obj);
      copy.events = null;
      copy.model = null;

      if (stringify) {
        json = JSON.stringify(copy);
      } else {
        json = copy;
      }
      if (removeEmpty) {
        const keys = Object.keys(json);
        for (var i = 0; i < keys.length; i++) {
          let key = keys[i];
          if (json[key] == null) {
            json[key] = undefined;
          }
        }
        json['_id'] = undefined;
        json['__v'] = undefined;
      }

      return JSON.parse(JSON.stringify(json));
    } catch (e) {
      console.log(e);
      json = JSON.stringify({});
    }
  }

}

module.exports = Beacon;
