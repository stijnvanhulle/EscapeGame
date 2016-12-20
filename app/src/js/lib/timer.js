/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-12-02T14:04:11+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-20T16:22:46+01:00
* @License: stijnvanhulle.be
*/

import EventEmitter from 'events';
import game from './game';

class Emitter extends EventEmitter {}

let timerObj;

let timer = {};
timer.start=()=>{

};
timer.startHints = (hints, howLong) => {
  if (hints && howLong) {
    howLong = parseFloat(howLong);
    let i = 0;
    let when = howLong / (hints.length);

    timerObj = setInterval(() => {
      i++;
      game.events.emit('hint', hints[i]);
      console.log(hints[i]);
      if (i == hints.length) {
        timer.stop();
      }
    }, when * 10);

  }
};

timer.stop = () => {
  clearInterval(timerObj);
  timerObj = null;
};

export default timer;
