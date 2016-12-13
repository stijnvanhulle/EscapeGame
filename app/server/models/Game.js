/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-13T18:09:11+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-13T15:06:55+01:00
* @License: stijnvanhulle.be
*/
const EventEmitter = require('events');
const {Game: Model} = require('./mongo');
const Chance = require('chance');
const c = new Chance();

class Emitter extends EventEmitter {}

class Game {
  //obj of players
  constructor(teamName = '', players = []) {
    this.players = players;
    this.teamName = teamName;
    this.reset();

  }

  reset() {
    this.id = null;
    this.model = Model;
    this.date = null;
    this.alienName = null;
    this.events = new Emitter();
  }
  generateAlienName() {
    this.alienName = c.name({nationality: "it"});
  }

  load({players, teamName, date, id, alienName}) {
    try {
      this.alienName = alienName
        ? alienName
        : this.alienName;
      this.players = players
        ? players
        : this.players;
      this.id = id
        ? id
        : this.id;
      this.teamName = teamName
        ? teamName
        : this.teamName;
      this.date = date
        ? date
        : this.date;

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
        console.log('Will save: ', obj);

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
    } catch (e) {
      console.log(e);
      json = JSON.stringify({});
    } finally {
      return json;
    }
  }

}

module.exports = Game;
