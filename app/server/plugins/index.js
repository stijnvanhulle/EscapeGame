/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-10-12T15:38:39+02:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-11T17:12:51+01:00
 * @License: stijnvanhulle.be
 */



const fs = require( `fs` );
const path = require( 'path' );
const pluginHandler = require( `../lib/pluginHandler` );

const readPlugins = ( server ) => {
  return new Promise( function( resolve, reject ) {
    fs.readdirSync( __dirname ).forEach( file => {
      if ( file === `index.js` || !file.endsWith( `.js` ) || file.startsWith( `_` ) ) return;
      server.register( require( `./${  file}` ), pluginHandler );
    } );
    resolve();
  } );
};


module.exports.register = ( server, options, next ) => {

  readPlugins( server )
    .then( () => {
      next();
    } )
    .catch( err => {
      next(err);
    } );


};

module.exports.register.attributes = {
  name: `modules`,
  version: `0.2.0`
};
