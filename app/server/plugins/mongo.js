/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-11-08T17:36:33+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-11T18:17:47+01:00
 * @License: stijnvanhulle.be
 */
const mongoose = require( "mongoose" );

const loadDefaults = ( {
  Members
} ) => {
  //remove first
  Members.remove( {}, function( err ) {
    if ( err ) console.log( err );
  } );

  let newMember = new Members( {
    email: 'stijn.vanhulle@outlook.com',
    password: 'stijn',
    firstName: 'Stijn',
    lastName: 'Van Hulle'
  } );
  newMember.save( function( err, item ) {
    if ( err ) console.log( err );
    console.log( 'stijn added' );
  } );
};

module.exports.register = ( server, options, next ) => {
  var db = mongoose.connection;
  db.on( 'error', console.error.bind( console, 'connection error:' ) );
  db.once( 'open', function() {
    loadDefaults( require( '../models/mongo' ) );
    console.log( 'Mongo connected' );
  } );

  next();

};

module.exports.register.attributes = {
  name: `mongo`,
  version: `0.1.0`
};
