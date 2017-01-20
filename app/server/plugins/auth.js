/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-16T14:39:10+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-07T13:44:32+01:00
* @License: stijnvanhulle.be
*/
const {Members, Access} = require('../models/mongo');
const moment = require('moment');

var validate = function(decoded, request, callback) {
  decoded.expires_in = decoded.expires_in;
  decoded.access_token = decoded.access_token;
  Access.findOne({access_token: decoded.access_token, expires_in: decoded.expires_in}).exec(function(err, access) {
    if (err)
      console.log(err);
    if (access && moment().isBefore(moment(parseFloat(decoded.expires_in)))) {
      //console.log('Key ok: ', decoded, access);
      return callback(null, true);
    } else {
      console.log('Key expired: ', decoded, access);
      return callback(null, false);
    }
  });
};

module.exports.register = (server, options, next) => {
  server.auth.strategy('token', 'jwt', {
    key: process.env.SECRET, // Never Share your secret key
    validateFunc: validate, // validate function defined above
    verifyOptions: {
      algorithms: ['HS256']
    }
  });

  server.auth.default('token');

  next();

};

module.exports.register.attributes = {
  name: `auth`,
  version: `0.1.0`
};
