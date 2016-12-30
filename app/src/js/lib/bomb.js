/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-12-02T14:04:11+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-30T20:35:51+01:00
* @License: stijnvanhulle.be
*/

import EventEmitter from 'events';
import game from './game';

class Emitter extends EventEmitter {}

class Bomb {
  constructor(element = null, i) {
    this.element = element;

    this.i = i;
    if (this.element) {
      this.element.addClass('hide');
      this.element.addClass('bomb');

    }

    this.reset();
  }
  reset() {
    this.isDestroyed = false;
    this.isExploding = false;
    this.events = new Emitter();
  }
  startExploding = (howLong) => {
    this.isExploding = true;

    setTimeout(() => {
      this.hide();
    }, howLong * 1000);
  }

  static updateBombs = (bombs, newBom) => {
    let newBombs = bombs.map(item => {
      if (item.id == newBom.id) {
        item = newBom;
      }
      return item;
    });
    return bombs;
  }
  stop = (isDestroyed) => {
    this.isDestroyed = isDestroyed;
    this.isExploding = false;
    this.hide();
  }
  hide = () => {
    this.element.addClass('hide');
  }
  show = () => {
    this.element.removeClass('hide');
  }

}

export default Bomb;
