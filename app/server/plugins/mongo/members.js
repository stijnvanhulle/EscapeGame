/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-08T17:36:33+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-08T17:37:27+01:00
* @License: stijnvanhulle.be
*/



module.exports.register = (server, options, next) => {
  var db = server.plugins['hapi-mongoose'].connection; // Get the current connection for this server instance
  var mongoose = server.plugins['hapi-mongoose'].lib;
  var Schema = mongoose.Schema;

  var memberSchema = new Schema({
    //tank props
  });

  var Member = db.model('Member', memberSchema);

  var small = new Member({ size: 'small' });

  small.save(function (err) {
    if (err) return handleError(err);
    // saved!
  })

  next();

};

module.exports.register.attributes = {
  name: `mongo_members`,
  version: `0.1.0`
};
