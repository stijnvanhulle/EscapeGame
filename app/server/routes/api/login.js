/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-11-08T16:04:53+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-08T17:16:00+01:00
 * @License: stijnvanhulle.be
 */

const url = require( './url' );
const moment = require( 'moment' );
const JWT = require( 'jsonwebtoken' );
const secret = process.env.SECRET;

module.exports = [ {
  method: `POST`,
  path: url.LOGIN,
  config: {
    auth: false
  },
  handler: function( request, reply ) {
    console.log( 'headers: ', request.headers );
    const {
      login,
      password
    } = request.headers;
    //checklogin and return token created in new table

    var obj = {
      access_token: login,
      expires_in: moment()
    }; // object/info you want to sign
    //var token = JWT.sign( obj, secret );
    //
    var obj = {
      id: 123,
      "name": "Charlie"
    }; // object/info you want to sign
    var token = JWT.sign( obj, secret );
    reply( {
      token
    } );
  }
}, {
  method: 'GET',
  path: url.MEMBERS,
  config: {
    auth: 'jwt'
  },
  handler: function( request, reply ) {
    reply( {
        text: 'You used a Token!'
      } )
      .header( "Authorization", request.headers.authorization );
  }
} ];
