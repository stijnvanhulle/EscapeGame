/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-11-08T17:36:33+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-27T14:40:30+01:00
 * @License: stijnvanhulle.be
 */
const mongoose = require("mongoose");
const mongoLib=require('../models/mongo');

const loadDefaults = ({Member}) => {
  //remove first
  Member.remove({}, function(err) {
    if (err)
      console.log(err);
    }
  );

  let newMember = new Member({email: 'stijn.vanhulle@outlook.com', password: 'stijn', firstName: 'Stijn', lastName: 'Van Hulle'});
  newMember.save(function(err, item) {
    if (err)
      console.log(err);
    console.log('stijn added');
  });
};

module.exports.register = (server, options, next) => {
  var db = mongoose.connection;
  db.on('error',(err)=>{
    next(err);
  });
  db.once('open', ()=> {
    console.log('Mongo connected');
    mongoLib.load();
    loadDefaults(mongoLib.getModels());
    next();
  });

};

module.exports.register.attributes = {
  name: `mongo`,
  version: `0.1.0`
};
