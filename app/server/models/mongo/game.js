/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-11-08T17:36:33+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-10T10:00:19+01:00
 * @License: stijnvanhulle.be
 */
const mongoose = require("mongoose");
const moment = require("moment");
let model;
let MODEL = "Game";

module.exports.load = () => {
  const db = mongoose.connection;
  const Schema = mongoose.Schema;

  if (db.models[MODEL]) {
    return db.models[MODEL];
  }

  const schema = new Schema({
    id: Number,
    date: String,
    teamName: String,
    alienName: String,
    gameName: String,
    isFinished: Boolean,
    isPlaying:Boolean,
    duration:Number,
    answerData:String
  });

  schema.pre('save', function(next) {
    this.date = moment().valueOf();
    next();
  });
  model = db.model(MODEL, schema, MODEL);

  return model;

};

module.exports.getModel = () => model;
module.exports.name = () => MODEL;

module.exports.load.attributes = {
  name: `mongo_game`,
  version: `0.1.0`
};
