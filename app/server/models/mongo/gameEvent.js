/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-11-08T17:36:33+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-29T14:17:11+01:00
 * @License: stijnvanhulle.be
 */
const mongoose = require("mongoose");
const moment = require("moment");
const scheduleJob = require("../../lib/scheduleJob");
let model;
let MODEL = "GameEvent";

module.exports.load = () => {
  const db = mongoose.connection;
  const Schema = mongoose.Schema;

  const schema = new Schema({id: Number, date: String, gameId: Number, gameDataId: Number, typeId: Number});


  schema.pre('save', function(next) {
    //schedule job
    scheduleJob.addRule(moment().add('10','seconds'),this,()=>{
      console.log('success');
    });
    this.date = moment().valueOf();
    next();
  });
  
  model = db.model(MODEL, schema);



  return model;

};

module.exports.getModel = () => model;

module.exports.load.attributes = {
  name: `mongo_gameEvent`,
  version: `0.1.0`
};
