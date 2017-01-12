/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-13T18:09:11+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-10T10:32:09+01:00
* @License: stijnvanhulle.be
*/
const EventEmitter = require('events');
const moment = require('moment');
const {setToMoment, round} = require('../lib/functions');
const {GameEvent: Model} = require('./mongo');

class Emitter extends EventEmitter {}

class GameEvent {
  constructor({gameId}) {
    try {
      this.gameId = parseFloat(gameId) || null;
    } catch (e) {
      console.log(e);
    }

    this.reset();

  }

  reset() {
    this.id = null;
    this.gameDataId = null;
    this.timeBetween = null;
    this.timePlayer = null;
    this.level = null;

    this.activateDate = null;
    this.endDate = null;

    this.finishDate = null;

    this.jobHashStart = null;
    this.jobHashEnd = null;
    this.isCorrect = false;
    this.isActive = true;
    this.letter = '';
    this.tries = 0;
    this.date = null;
    this.model = Model;
    this.events = new Emitter();
  }

  load(data) {
    try {
      const {
        gameId,
        gameDataId,
        date,
        id,
        isActive,
        activateDate,
        endDate,
        finishDate,
        jobHashStart,
        jobHashEnd,
        level,
        isCorrect,
        letter,
        tries
      } = data;
      this.gameId = gameId
        ? parseFloat(gameId)
        : this.gameId;
      this.id = id
        ? parseFloat(id)
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
      this.finishDate = finishDate
        ? parseFloat(finishDate)
        : this.finishDate;
      this.letter = letter
        ? letter
        : this.letter;
      this.level = level
        ? parseFloat(level)
        : this.level;
      this.jobHashStart = jobHashStart
        ? jobHashStart
        : this.jobHashStart;
      this.jobHashEnd = jobHashEnd
        ? jobHashEnd
        : this.jobHashEnd;
      this.tries = tries
        ? parseFloat(tries)
        : this.tries;

    } catch (e) {
      console.log(e);
      throw e;
    }

    return this;
  }
  calculateTimes() {
    const timeBetween = Math.abs(moment(this.activateDate).diff(moment(this.endDate), 'seconds'));
    this.timeBetween = parseFloat(timeBetween);

    if (this.finishDate && this.activateDate) {
      const timePlayed = Math.abs(moment(this.activateDate).diff(moment(this.finishDate), 'seconds'));
      this.timePlayed = parseFloat(timePlayed);

      this.percentSpeed = parseFloat((timePlayed / timeBetween).toFixed(2));
    }

  }
  sort(...onKeys) {
    if (!onKeys || onKeys.length < 0) {
      onKeys = [];
    }
    let newObj = {};
    let json = this.json(false, true);
    let keys = Object.keys(json);

    for (let i = 0; i < onKeys.length; i++) {
      let onKey = onKeys[i];

      for (let i2 = 0; i2 < keys.length; i2++) {
        let key = keys[i2];
        if (key == onKey) {
          newObj[key] = json[key];
          break;
        }
      }
    }

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      if (Object.keys(newObj).indexOf(key) == -1) {
        newObj[key] = json[key];
      }
    }
    return newObj;

  }

  setData({
    gameId,
    gameDataId,
    isActive,
    isCorrect,
    activateDate,
    endDate,
    finishDate,
    date,
    level,
    letter
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
        letter,
        gameId,
        date
      });

    } catch (e) {
      console.log(e);
      throw e;
    }

  }
  setJobHashStart(jobHash) {
    this.jobHashStart = jobHash;

  }
  setJobHashEnd(jobHash) {
    this.jobHashEnd = jobHash;

  }
  clearJobHash() {
    this.jobHashStart = null;
    this.jobHashEnd = null;
  }
  setFinish(finish) {
    try {
      if (finish) {

        finish = setToMoment(finish);

        if (setToMoment(this.activateDate).isAfter(finish)) {
          console.log(moment(this.activateDate).format(),finish.format());
          throw new Error('finishdate not after activatendate', this);
          return;
        }
        this.finishDate = parseFloat(finish.valueOf());
      }
    } catch (e) {
      console.log(e);
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
  setInactive() {
    this.isActive = false;
  }
  addTry() {
    this.tries++;
  }

  json(stringify = true, removeEmpty = false, subDataJson = true) {
    var json;
    try {
      var obj = this;
      var copy = Object.assign({}, obj);
      copy.events = null;
      copy.model = null;
      if (subDataJson) {}

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
