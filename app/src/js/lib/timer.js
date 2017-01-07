/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-12-02T14:04:11+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-07T13:04:57+01:00
* @License: stijnvanhulle.be
*/

import EventEmitter from 'events';
import game from './game';

class Emitter extends EventEmitter {}

let timerObj;

let timer = {};
timer.start = (howLong) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, howLong * 1000);
  });
};

timer.startCountdown = (howLong) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      game.events.emit('stopCountdown', true);
      resolve(true);
    }, howLong * 1000);
  });
};
timer.startHints = (hints, howLong) => {
  if (hints && howLong) {
    howLong = parseFloat(howLong);
    let i = 0;
    let when = howLong / (hints.length);

    timerObj = setInterval(() => {
      i++;
      let hint=hints[i];
      game.events.emit('hint', hint);
      console.log(hint);
      if (i == hints.length) {
        timer.stop();
      }
    }, when * 1000);

  }
};

timer.stop = () => {
  clearInterval(timerObj);
  timerObj = null;
};

export default timer;
