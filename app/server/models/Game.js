/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-13T18:09:11+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-10T10:00:49+01:00
* @License: stijnvanhulle.be
*/
const EventEmitter = require('events');
const {Game: Model} = require('./mongo');
const moment = require('moment');
const Chance = require('chance');
const c = new Chance();

class Emitter extends EventEmitter {}

class Game {
  //obj of players
  constructor(teamName = '', players = [], gameName = 'alien') {
    this.players = players;
    this.teamName = teamName;
    this.gameName = gameName;
    this.reset();

  }

  reset() {
    this.id = null;
    this.model = Model;
    this.date = null;
    this.alienName = null;
    this.isFinished = false;
    this.isPlaying = false;
    this.duration = null;
    this.events = new Emitter();
  }
  generateAlienName() {
    this.alienName = c.name({nationality: "it"});
  }
  setDescription(description) {
    this.description = description;
  }
  calcDuration(gameEvents = [], isTotal) {
    try {
      let duration = 0;
      for (var i = 0; i < gameEvents.length; i++) {
        let gameEvent = gameEvents[i];
        gameEvent.calculateTimes();
        let time;
        if (isTotal) {
          time = gameEvent.timeBetween;
        } else {
          if (gameEvent.timePlayed) {
            time = gameEvent.timePlayed;
          } else {
            time = gameEvent.timeBetween;
          }
        }

        duration += time;
      }

      console.log('DURATION', this.duration);
      return duration;
    } catch (e) {
      console.log(e);
      return null;
    }

  }

  load({
    players,
    teamName,
    date,
    id,
    alienName,
    gameName,
    isFinished,
    isPlaying,
    duration
  }) {
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
      this.gameName = gameName
        ? gameName
        : this.gameName;
      this.isFinished = isFinished
        ? isFinished
        : this.isFinished;
      this.isPlaying = isPlaying
        ? isPlaying
        : this.isPlaying;
      this.duration = duration
        ? parseFloat(duration)
        : this.duration;

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
      copy.description = null;
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

module.exports = Game;
