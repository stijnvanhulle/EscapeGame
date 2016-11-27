/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-10-15T13:55:51+02:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-08T16:40:11+01:00
 * @License: stijnvanhulle.be
 */

const url = require( './api/url' );
const index = {
  method: `GET`,
  path: url.DEFAULT,
  config: {
    auth: false
  },
  handler: function( request, reply ) {
    reply( {

    } );
  }
};


module.exports = [ index,
  ...require( './api/login' )
];
