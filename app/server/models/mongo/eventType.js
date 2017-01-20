/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-11-08T17:36:33+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-06T20:51:04+01:00
 * @License: stijnvanhulle.be
 */
const mongoose = require("mongoose");
let model;
let MODEL = "EventType";

module.exports.load = () => {
  const db = mongoose.connection;
  const Schema = mongoose.Schema;

  if (db.models[MODEL]) {
    return db.models[MODEL];
  }

  const schema = new Schema({id: Number, name: String});

  model = db.model(MODEL, schema,MODEL);
  return model;

};

module.exports.getModel = () => model;
module.exports.name = () => MODEL;

module.exports.load.attributes = {
  name: `mongo_eventType`,
  version: `0.1.0`
};
