/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-28T14:54:43+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-28T15:52:51+01:00
* @License: stijnvanhulle.be
*/

const {Player} = require('../models');




module.exports.add = (player) => {
  if(!player instanceof Player){
    throw new Error('No instance of');
  }
  return player.save();
};
