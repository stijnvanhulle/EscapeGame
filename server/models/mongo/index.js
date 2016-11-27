/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-11-08T17:36:33+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-27T14:04:53+01:00
 * @License: stijnvanhulle.be
 */

const Access = require("./access");
const Member = require("./members");
const EventType = require("./eventType");
const Game = require("./game");
const GameEvent = require("./gameEvent");

module.exports.load = () => {
  Access.load();
  Member.load();
  EventType.load();
  Game.load();
  GameEvent.load();

};

module.exports.getModels = () => {
  return {Access: Access.getModel(), Member: Member.getModel(), EventType: EventType.getModel(), Game: EventType.getModel(), GameEvent: GameEvent.getModel()};
};
