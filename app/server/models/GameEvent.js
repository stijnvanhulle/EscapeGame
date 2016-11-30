/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-13T18:09:11+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-30T23:56:26+01:00
* @License: stijnvanhulle.be
*/
const EventEmitter = require('events');
const {setToMoment} = require('../lib/functions');
const {GameEvent: Model} = require('./mongo');

class Emitter extends EventEmitter {}

class GameEvent {
  constructor({gameId}) {
    this.gameId = gameId;
    this.reset();

  }

  reset() {
    this.gameDataId = null;
    this.date = null;
    this.id = null;
    this.isActive = true;
    this.activateDate = null;
    this.endDate = null;
    this.model = Model;
    this.events = new Emitter();
  }
  setGameData({
    gameId,
    gameDataId,
    isActive,
    activateDate,
    endDate,
    date
  }) {
    try {
      console.log(setToMoment(endDate).format(), setToMoment(activateDate).format());
      if (!setToMoment(endDate).isAfter(setToMoment(activateDate))) {
        throw new Error('endDate not after activatedate');
        return;
      }
      this.gameId = gameId;
      this.date = date;
      this.gameDataId = gameDataId;
      this.isActive = Boolean(isActive);
      this.endDate = endDate;
      this.activateDate = activateDate;

    } catch (e) {
      console.log(e);
    }

  }

  save() {
    return new Promise((resolve, reject) => {
      try {
        const item = this.json(false);
        const obj = new Model(item);
        console.log(obj);

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
  setInactive() {
    this.isActive = false;
  }

  json(stringify = true, update = false) {
    var json;
    try {
      var obj = this;
      var copy = Object.assign({}, obj);
      copy.events = null;
      copy.model = null;

      if (update) {
        copy.date = null;
      }

      if (stringify) {
        json = JSON.stringify(copy);
      } else {
        json = copy;
      }

      return JSON.parse(JSON.stringify(json));
    } catch (e) {
      console.log(e);
      json = JSON.stringify({});
    }
  }

}

module.exports = GameEvent;
