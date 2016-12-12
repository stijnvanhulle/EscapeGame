/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-13T18:09:11+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-12T12:26:15+01:00
* @License: stijnvanhulle.be
*/
const EventEmitter = require('events');
const moment = require('moment');
const {setToMoment} = require('../lib/functions');
const {GameEvent: Model} = require('./mongo');

class Emitter extends EventEmitter {}

class GameEvent {
  constructor({gameId}) {
    this.gameId = parseFloat(gameId);
    this.reset();

  }

  reset() {
    this.gameDataId = null;
    this.date = null;
    this.id = null;
    this.level = null;
    this.isActive = true;
    this.activateDate = null;
    this.endDate = null;
    this.finishDate = null;
    this.model = Model;
    this.jobHash = null;
    this.isCorrect=false;
    this.events = new Emitter();
  }

  load({
    gameId,
    gameDataId,
    date,
    id,
    isActive,
    activateDate,
    endDate,
    finishDate,
    jobHash,
    level,
    isCorrect,
  }) {
    try {
      this.gameId = gameId
        ? parseFloat(gameId)
        : this.gameId;
      this.id = id
        ? id
        : this.id;
      this.gameDataId = gameDataId
        ? parseFloat(gameDataId)
        : this.gameDataId;
      this.date = date
        ? parseFloat(date)
        : this.date;
      this.isActive = isActive
        ? Boolean(isActive)
        : this.isActive;
        this.isCorrect = isCorrect
          ? Boolean(isCorrect)
          : this.isCorrect;
      this.activateDate = activateDate
        ? parseFloat(activateDate)
        : this.activateDate;
      this.endDate = endDate
        ? parseFloat(endDate)
        : this.endDate;
      this.jobHash = jobHash
        ? jobHash
        : this.jobHash;
      this.level = level
        ? parseFloat(level)
        : this.level;
    } catch (e) {
      console.log(e);
      throw e;
    }

    return this;
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
        throw new Error('Time is not in the future ' + startTime.format().toString() + ' now: ' + moment().format().toString());

      if (!level) {
        level = 1;
      }

      if (!timeBetween) {
        var seconds = 0;
        var minutes = 0;
        if (level == 1) {
          minutes = 2; //TODO: set to 10
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

      if (!setToMoment(endDate).isAfter(setToMoment(activateDate))) {
        throw new Error('endDate not after activatedate');
        return;
      }

      this.load({
        activateDate: parseFloat(activateDate.valueOf()),
        endDate: parseFloat(endDate.valueOf()),
        isActive: true,
        finishDate: null,
        gameDataId,
        level
      });

    } catch (e) {
      console.log(e);
      throw e;
    }

  }

  setGameData({
    gameId,
    gameDataId,
    isActive,
    isCorrect,
    activateDate,
    endDate,
    finishDate,
    date,
    level
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

      this.load({
        activateDate,
        endDate,
        isActive,
        isCorrect,
        finishDate: null,
        gameDataId,
        level,
        gameId,
        date
      });

    } catch (e) {
      console.log(e);
      throw e;
    }

  }
  setJobHash(jobHash) {
    this.jobHash = jobHash;
  }
  setFinish(finish) {
    finish = setToMoment(finish);
    if (finish) {
      this.finishDate = parseFloat(finish.valueOf());
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

module.exports = GameEvent;
