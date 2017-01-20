/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-11-08T16:04:53+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-07T13:38:15+01:00
 * @License: stijnvanhulle.be
 */

const url = require('./lib/url');
const moment = require('moment');
const {Member, Access} = require('../../models/mongo');
const Chance = new(require('chance'));
const JWT = require('jsonwebtoken');
const secret = process.env.SECRET;

module.exports = [
  {
    method: `POST`,
    path: url.LOGIN,
    config: {
      auth: false
    },
    handler: function(request, reply) {
      const {email, password} = request.payload;
      var access_token = Chance.hash({length: 25});
      //checklogin and return token created in new table
      try {
        Member.findOne({email, password}).exec(function(err, member) {
          if (err) {
            reply('Not found');
          }
          if (member) {
            let newAccess = new Access({
              access_token: access_token,
              expires_in: moment().add(1, 'days').valueOf()
            });
            newAccess.save(function(err, item) {
              if (err)
                reply('Not found');
              var token = JWT.sign({
                access_token: newAccess.access_token,
                expires_in: newAccess.expires_in
              }, secret,{ algorithm: 'HS256'});
              reply({token,expires_in:parseFloat(newAccess.expires_in)});
            });

          } else {
            reply('Not found');
          }
        });
      } catch (e) {
        console.log(e);
        reply(e);
      }

    }

  }, {
    method: 'POST',
    path: url.AUTH,
    config: {
      auth: false
    },
    handler: function(request, reply) {
      const {access_token} = request.payload;

      Access.findOne({access_token}).exec(function(err, doc) {
        if (err) {
          reply(err);
        } else {
          reply(doc);
        }
      });

    }
  }
];
