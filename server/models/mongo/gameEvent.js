/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-11-08T17:36:33+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-27T14:38:39+01:00
 * @License: stijnvanhulle.be
 */
const mongoose = require( "mongoose" );
let model;
let MODEL="GameEvent";


module.exports.load = () => {
  const db = mongoose.connection;
  const Schema = mongoose.Schema;

  const schema = new Schema( {
    id: mongoose.Schema.ObjectId,
    date: String,
    gameId: Number,
    data:String,
    type:mongoose.Schema.ObjectId
  } );

  model = db.model( MODEL, schema );
  return model;

};

module.exports.getModel = () => model;

module.exports.load.attributes = {
  name: `mongo_gameEvent`,
  version: `0.1.0`
};
