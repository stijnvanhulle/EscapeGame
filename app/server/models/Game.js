/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-13T18:09:11+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-28T15:46:35+01:00
* @License: stijnvanhulle.be
*/
const EventEmitter = require('events');

class Emitter extends EventEmitter {}

class Game {
  //obj of players
  constructor(...players) {
    console.log(players);
    this.reset();
  }

  reset() {
    this.events = new Emitter();
  }

  json(stringify=true) {
    var json;
    try {
      var obj = this;
      var copy = Object.assign({}, obj);
      copy.events = null;
      if(stringify){
        json = JSON.stringify(copy);
      }else{
        json=copy;
      }
    } catch (e) {
      console.log(e);
      json = JSON.stringify({});
    } finally {
      return json;
    }
  }

}

module.exports = Game;
