/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-16T14:39:10+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-08T17:18:29+01:00
* @License: stijnvanhulle.be
*/
var people = { // our "users database"
  123: {
    id: 1,
    name: 'Jen Jones'
  }
};

var validate = function(decoded, request, callback) {
  if (people[decoded.id]) {
    return callback(null, true);
  } else {
    return callback(null, false);
  }
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
