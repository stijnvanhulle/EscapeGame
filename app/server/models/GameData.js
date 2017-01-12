/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-13T18:09:11+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-06T16:58:44+01:00
* @License: stijnvanhulle.be
*/
const EventEmitter = require('events');
const {GameData: Model} = require('./mongo');

class Emitter extends EventEmitter {}

class GameData {
  constructor(gameName = "alien", data = null, typeId = 1) {
    this.data = data;
    this.gameName = gameName;
    this.typeId = typeId;
    this.reset();

  }

  reset() {
    this.date = null;
    this.id = null;
    this.model = Model;
    this.events = new Emitter();
  }

  load({gameName, id, data, typeId, date}) {
    try {
      this.gameName = gameName;
      this.data = JSON.parse(data);
      this.id = id;
      this.date = date;
      this.typeId = typeId;

    } catch (e) {
      console.log(e);
      throw e;
    }
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

  json(stringify = true, removeEmpty = false, subDataJson = true) {
    var json;
    try {
      var obj = this;
      var copy = Object.assign({}, obj);
      copy.events = null;
      copy.model = null;
      if (subDataJson) {
        copy.data = JSON.stringify(copy.data);
      }

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

module.exports = GameData;
