/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-28T14:54:43+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-28T22:06:32+01:00
* @License: stijnvanhulle.be
*/
const {calculateId} = require('./lib/functions');

const {Player} = require('../models');
const {Player: PlayerMongo} = require('../models/mongo');

module.exports.add = (player) => {
  return new Promise((resolve, reject) => {
    try {
      if (!player instanceof Player) {
        throw new Error('No instance of');
      }

      calculateId(PlayerMongo).then(id=>{
        player.id=id;
        player.save().then((player) => {
          resolve(player);
        }).catch(err => {
          reject(err);
        });
      });



    } catch (e) {
      console.log(e);
    }

  });

};
