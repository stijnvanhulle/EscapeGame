/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-11-08T17:36:33+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-11T17:32:18+01:00
 * @License: stijnvanhulle.be
 */

const mongoose = require( "mongoose" );
let model;

module.exports.load = () => {
  const db = mongoose.connection;
  const Schema = mongoose.Schema;

  const accessSchema = new Schema( {
    access_token: String,
    expires_in: String
  } );

  const Access = db.model( 'Access', accessSchema );

  model = Access;
  return model;

};

module.exports.getModel = () => model;

module.exports.load.attributes = {
  name: `mongo_access`,
  version: `0.1.0`
};
