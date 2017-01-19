/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-12-02T14:04:11+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-07T13:25:07+01:00
* @License: stijnvanhulle.be
*/

import EventEmitter from 'events';
import moment from 'moment';
import eventNames from 'lib/const/eventNames';

class Emitter extends EventEmitter {
  constructor() {
    super();
  }
  resetEvents(...events) {
    if (!events) {
      events = Object.keys(eventNames);
    }
    for (var i = 0; i < events.length; i++) {
      let eventName = eventNames[events[i]];
      if (!eventName) {
        eventName = events[i];
      }

      if (this.listenerCount(eventName) > 0) {
        this.removeAllListeners(eventName);
      }
    }
  }
  resetEvent(eventName) {
    if (this.listenerCount(eventName) > 0) {
      this.removeAllListeners(eventName);
    }
  }
}

let game = {};
game.reset = () => {
  game.started = false;
  game.currentGameData = null;
  game.currentGameEvent = null;
  game.events = new Emitter();
  game.startTimeout = 10000;
  game.letters = [];
  game.token = null;
  game.beacons = [];
  game.answerData = {};
  game.device = 'screen';
  game.GAMEDURATION = 30 * 60;

  //game.events.setMaxListeners(2);
};
game.reset();
game.load = (item) => {
  game = item;
};

export default game;
