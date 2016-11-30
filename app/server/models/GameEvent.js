/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-13T18:09:11+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-30T15:19:05+01:00
* @License: stijnvanhulle.be
*/
const EventEmitter = require('events');
const {GameEvent: Model} = require('./mongo');

class Emitter extends EventEmitter {}

class GameEvent {
  constructor({gameId}) {
    this.gameId = gameId;
    this.reset();

  }

  reset() {
    this.gameDataId=null;
    this.date = null;
    this.id = null;
    this.isActive=true;
    this.activateDate=null;
    this.endDate=null;
    this.model = Model;
    this.events = new Emitter();
  }
  createGameData({gameDataId,isActive,activateDate,endDate}){
    this.gameDataId=gameDataId;
    this.isActive=active;
    this.endDate= endDate;
    this.activateDate=activateDate;

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

  json(stringify = true) {
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
    } catch (e) {
      console.log(e);
      json = JSON.stringify({});
    } finally {
      return json;
    }
  }

}

module.exports = GameEvent;
