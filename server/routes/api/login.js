/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-11-08T16:04:53+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-11T18:02:49+01:00
 * @License: stijnvanhulle.be
 */

const url = require( './url' );
const moment = require( 'moment' );
const {
  Members,
  Access
} = require( '../../models/mongo' );
const Chance = new( require( 'chance' ) );
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
      email,
      password
    } = request.headers;
    var access_token = Chance.hash( {
      length: 25
    } );
    //checklogin and return token created in new table
    Members.findOne( {
      email: email,
      password: password
    } ).exec( function( err, member ) {
      if ( member ) {
        let newAccess = new Access( {
          access_token: access_token,
          expires_in: moment().add(1, 'days').valueOf()
        } );
        newAccess.save( function( err, item ) {
          if ( err ) console.log( err );
          var token = JWT.sign( {
            access_token: newAccess.access_token,
            expires_in: newAccess.expires_in
          }, secret );
          reply( {
            token
          } );
        } );

      }
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
