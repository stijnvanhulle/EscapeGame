/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-11-08T17:36:33+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-29T14:53:36+01:00
 * @License: stijnvanhulle.be
 */
const mongoose = require("mongoose");
const moment = require("moment");
let model;
let MODEL = "GameMember";

module.exports.load = () => {
  const db = mongoose.connection;
  const Schema = mongoose.Schema;

  if (db.models[MODEL]) {
    return db.models[MODEL];
  }

  const schema = new Schema({gameId: Number, playerId: Number, date: String});

  schema.pre('save', function(next) {
    this.date = moment().valueOf();
    next();
  });

  model = db.model(MODEL, schema);

  return model;

};

module.exports.getModel = () => model;

module.exports.load.attributes = {
  name: `mongo_gameMember`,
  version: `0.1.0`
};
