/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-11-08T17:36:33+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-28T16:54:01+01:00
 * @License: stijnvanhulle.be
 */
const mongoose = require("mongoose");
let model;
let MODEL = "EventType";

module.exports.load = () => {
  const db = mongoose.connection;
  const Schema = mongoose.Schema;

  const schema = new Schema({id: Number, name: String});

  model = db.model(MODEL, schema);
  return model;

};

module.exports.getModel = () => model;

module.exports.load.attributes = {
  name: `mongo_eventType`,
  version: `0.1.0`
};
