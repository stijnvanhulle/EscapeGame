/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-13T18:09:11+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-29T11:53:27+01:00
* @License: stijnvanhulle.be
*/
const EventEmitter = require('events');
const {Game: Model} = require('./mongo');

class Emitter extends EventEmitter {}

class Game {
  //obj of players
  constructor(teamName,players=[]) {
    this.model = Model;
    this.players=players;
    this.teamName = teamName;
    this.reset();

  }

  reset() {
    this.events = new Emitter();
  }

  save() {
    return new Promise((resolve, reject) => {
      try {
        const item = this.json(false);
        const game = new Model(item);
        console.log(game);

        game.save(function(err, item) {
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

  json(stringify = true) {
    var json;
    try {
      var obj = this;
      var copy = Object.assign({}, obj);
      copy.events = null;
      copy.model = null;
      copy.players=null;
      if (stringify) {
        json = JSON.stringify(copy);
      } else {
        json = copy;
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
