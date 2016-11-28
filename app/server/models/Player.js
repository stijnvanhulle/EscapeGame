/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-13T18:09:11+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-28T16:40:41+01:00
* @License: stijnvanhulle.be
*/
const EventEmitter = require('events');
const {Player: PlayerMongo} = require('./mongo');

class Emitter extends EventEmitter {}
class Player {
  constructor({id,firstName, lastName, birthday, email}) {
    this.id=id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthday = birthday;
    this.email = email;

    this.reset();
  }
  reset() {
    this.events = new Emitter();
  }

  save() {
    return new Promise((resolve, reject) => {
      try {
        const item = this.json(false);
        const player = new PlayerMongo(item);
        console.log(player);
        player.save(function(err, item) {
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

  json(stringify = true) {
    var json;
    try {
      var obj = this;
      var copy = Object.assign({}, obj);
      copy.events = null;
      if (stringify) {
        json = JSON.stringify(copy);
      } else {
        json = copy;
      }
    } catch (e) {
      console.log(e);
      if (stringify) {
        json = JSON.stringify({});
      } else {
        json = {};
      }
    } finally {
      return json;
    }
  }

}

module.exports = Player;
