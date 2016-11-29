/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-11-08T17:36:33+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-29T17:22:47+01:00
 * @License: stijnvanhulle.be
 */
const mongoose = require("mongoose");
const {Member: MemberModel, GameData: GameDataModel} = require('../models/mongo');
const {Member, GameData} = require('../models');
const {calculateId} = require('../controllers/lib/functions');

const loadDefaults = () => {

  //remove first
  MemberModel.remove({});
  MemberModel.remove({});

  let newMember = new MemberModel({email: 'stijn.vanhulle@outlook.com', password: 'stijn', firstName: 'Stijn', lastName: 'Van Hulle'});
  newMember.save(function(err, item) {
    if (err)
      console.log(err);
  });

  let newGameData=new GameData({
    seconds:2
  });

  calculateId(GameDataModel).then(id => {
    newGameData.id = id;
    newGameData.save(function(err, item) {
      if (err)
        console.log(err);
    });
  });

};

module.exports.register = (server, options, next) => {
  var db = mongoose.connection;
  db.on('error', (err) => {
    console.log(err);
    next(err);
  });
  db.once('open', () => {
    console.log('Mongo connected');
    loadDefaults();
    next();
  });

};

module.exports.register.attributes = {
  name: `mongo`,
  version: `0.1.0`
};
