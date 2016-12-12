/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-12-02T14:04:11+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-12T16:00:22+01:00
* @License: stijnvanhulle.be
*/

import EventEmitter from 'events';
import moment from 'moment';

class Emitter extends EventEmitter {}

let game = {};
game.id = null;
game.name = 'alien';
game.level = 1;
game.started = false;
game.currentGameData = null;
game.currentGameEvent = null;
game.events = new Emitter();

export default game;
