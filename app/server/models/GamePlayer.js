/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-13T18:09:11+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-28T18:15:11+01:00
* @License: stijnvanhulle.be
*/
const EventEmitter = require('events');
const {GamePlayer: Model} = require('./mongo');

class Emitter extends EventEmitter {}

class GameMember {
  constructor() {
    this.reset();
  }

  reset() {
    this.date = null;
    this.model = Model;
    this.player = null;
    this.game = null;
    this.events = new Emitter();
  }

  load(obj) {
    try {
      if (!obj)
        return;
      let {gameId, playerId, date} = obj;

      this.gameId = gameId;
      this.playerId = playerId;
      this.date = date;

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
        obj.save().then(item => {
          resolve(item);
        }).catch(e => {
          throw new Error(e);
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

module.exports = GameMember;
