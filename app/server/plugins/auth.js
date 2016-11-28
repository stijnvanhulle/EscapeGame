/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-16T14:39:10+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-11T18:06:37+01:00
* @License: stijnvanhulle.be
*/
const {Members, Access} = require('../models/mongo');
const moment = require('moment');

var validate = function(decoded, request, callback) {
  Access.findOne({access_token: decoded.access_token, expires_in: decoded.expires_in}).exec(function(err, access) {
    if (err)
      console.log(err);
    if (access && moment().isAfter(moment(decoded.expires_in))) {
      return callback(null, true);
    } else if (!moment().isAfter(moment(decoded.expires_in))) {
      console.log('Key expired: ',decoded);
      return callback(null, false);
    } else {
      return callback(null, false);
    }
  });

};

module.exports.register = (server, options, next) => {
  server.auth.strategy('jwt', 'jwt', {
    key: process.env.SECRET, // Never Share your secret key
    validateFunc: validate, // validate function defined above
    verifyOptions: {
      algorithms: ['HS256']
    } // pick a strong algorithm
  });

  server.auth.default('jwt');

  next();

};

module.exports.register.attributes = {
  name: `auth`,
  version: `0.1.0`
};
