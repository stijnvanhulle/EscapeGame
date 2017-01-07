/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-11-08T17:36:33+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-06T20:51:12+01:00
 * @License: stijnvanhulle.be
 */
const mongoose = require("mongoose");
const moment = require("moment");
let model;
let MODEL = "GameEvent";

module.exports.load = () => {
  const db = mongoose.connection;
  const Schema = mongoose.Schema;

  if (db.models[MODEL]) {
    return db.models[MODEL];
  }

  const schema = new Schema({
    id: Number,
    date: String,
    gameId: Number,
    gameDataId: Number,
    isActive: Boolean,
    activateDate: String,
    finishDate: String,
    endDate: String,
    jobHashStart: String,
    jobHashEnd: String,
    level: Number,
    tries: Number
  });

  schema.pre('save', function(next) {
    //schedule job
    this.date = moment().valueOf();
    next();
  });

  model = db.model(MODEL, schema, MODEL);

  return model;

};

module.exports.getModel = () => model;
module.exports.name = () => MODEL;

module.exports.load.attributes = {
  name: `mongo_gameEvent`,
  version: `0.1.0`
};
