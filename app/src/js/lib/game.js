/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-12-02T14:04:11+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-20T16:40:37+01:00
* @License: stijnvanhulle.be
*/

import EventEmitter from 'events';
import moment from 'moment';

class Emitter extends EventEmitter {}

let game = {};
game.reset = () => {
  game = {};
  game.id = null;
  game.name = 'alien';
  game.level = 1;
  game.started = false;
  game.currentGameData = null;
  game.currentGameEvent = null;
  game.events = new Emitter();
};
game.reset();
game.load = (item) => {
  game = item;
};

export default game;
