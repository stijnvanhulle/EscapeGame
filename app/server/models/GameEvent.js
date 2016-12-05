/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-13T18:09:11+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-05T21:43:57+01:00
* @License: stijnvanhulle.be
*/
const EventEmitter = require('events');
const moment = require('moment');
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
    this.jobHash=null;
    this.events = new Emitter();
  }
  createGameData(gameDataId = null, level = 1, startTime = null, startIn = 20, maxTime = null, timeBetween = null) {
    try {
      if (parseInt(level) > 3) {
        throw new Error('Level is to big');
      }
      if (!startTime)
        throw new Error('Time to start not filled in');
      if (!gameDataId)
        throw new Error('GameDataId not filled in');

      startTime = setToMoment(startTime);
      if (!startTime)
        throw new Error('Time to start not a utc timestamp');

      if (!startTime.isAfter(moment()))
        throw new Error('Time is not in the future');

      if (!timeBetween) {
        var seconds = 0;
        var minutes = 0;
        if (level == 1) {
          minutes = 10;
          seconds = 0;
          timeBetween = seconds + (minutes * 60);
        } else if (level == 2) {
          minutes = 5;
          seconds = 0;
          timeBetween = seconds + (minutes * 60);
        } else if (level == 3) {
          minutes = 2;
          seconds = 0;
          timeBetween = seconds + (minutes * 60);
        }
      } else if (maxTime && timeBetween) {
        if (maxTime < timeBetween) {
          timeBetween = maxTime;
        }
      }

      let activateDate = setToMoment(startTime).add('seconds', parseInt(startIn));
      let activateDate_temp = setToMoment(activateDate.valueOf());

      let endDate = activateDate_temp.add('seconds', parseInt(timeBetween));

      console.log('DATE:', activateDate.format(), endDate.format());

      if (!setToMoment(endDate).isAfter(setToMoment(activateDate))) {
        throw new Error('endDate not after activatedate');
        return;
      }

      this.activateDate = activateDate.valueOf();
      this.endDate = endDate.valueOf();
      this.isActive = true;
      this.gameDataId = gameDataId;

    } catch (e) {
      console.log(e);
      throw e;
    }

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
      if (!setToMoment(endDate).isAfter(moment()) || !setToMoment(activateDate).isAfter(moment())) {
        //throw new Error('endDate or activatedate is not after this moment');
        //return;
      }
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
      throw e;
    }

  }
  setJobHash(jobHash){
    this.jobHash=jobHash;
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
      if(removeEmpty){
        const keys = Object.keys(json);
        for (var i = 0; i < keys.length; i++) {
          let key = keys[i];
          if (json[key] == null) {
            json[key] = undefined;
          }
        }
        json['_id']= undefined;
        json['__v']= undefined;
      }

      return JSON.parse(JSON.stringify(json));
    } catch (e) {
      console.log(e);
      json = JSON.stringify({});
    }
  }

}

module.exports = GameEvent;
