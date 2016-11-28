/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-11-08T17:36:33+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-28T23:01:46+01:00
 * @License: stijnvanhulle.be
 */
const mongoose = require("mongoose");
const Moment = require("moment");
let model;
let MODEL = "Game";

module.exports.load = () => {
  const db = mongoose.connection;
  const Schema = mongoose.Schema;

  const schema = new Schema({id: Number, date: String, teamName: String});

  model = db.model(MODEL, schema);

  schema.pre('save', function(next) {
    this.date=Moment.valueOf();
    next();
  });

  return model;

};

module.exports.getModel = () => model;

module.exports.load.attributes = {
  name: `mongo_game`,
  version: `0.1.0`
};
