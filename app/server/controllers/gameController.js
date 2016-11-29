/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-28T14:54:43+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-29T17:14:35+01:00
* @License: stijnvanhulle.be
*/

const moment = require('moment');

const {calculateId, random} = require('./lib/functions');
const scheduleJob = require("../lib/scheduleJob");

const {Game, GameEvent, GameData} = require('../models');

const {promiseFor} = require('../lib/functions');
const {Game: GameModel, GameEvent: GameEventModel, GameMember: GameMemberModel, GameData: GameDataModel} = require('../models/mongo');

module.exports.add = (game) => {
  return new Promise((resolve, reject) => {
    try {
      if (!game instanceof Game) {
        throw new Error('No instance of');
      }

      calculateId(GameModel).then(id => {
        game.id = id;
        game.save().then((doc) => {
          resolve(doc);
        }).catch(err => {
          reject(err);
        });
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }

  });

};

const getGameDataFromId = (id) => {
  return new Promise((resolve, reject) => {
    if (!id)
      reject('No id for gameData');
    GameDataModel.findOne({id: id}).exec(function(err, gameData) {
      if (err) {
        reject(err);
      } else {
        resolve(gameData);
      }
    });
  });
};
const addEventScheduleRule = (gameData, gameEvent) => {
  let obj = new GameData();
  obj.load(gameData);
  if (!obj.data.seconds)
    throw new Error('No data seconds found in gameData');
  return scheduleJob.addRule(moment().add(obj.data.seconds, 'seconds'), gameEvent, (data) => {
    return new Promise((resolve, reject) => {
      console.log('success');
      resolve(data);
    });
  });
};

module.exports.getRandomGameData = () => {
  return new Promise((resolve, reject) => {
    try {
      random(GameDataModel).then(random => {
        if (random) {
          GameDataModel.findOne({id: random}).exec(function(err, doc) {
            if (err) {
              reject(err);
            } else {
              resolve(doc);
            }
          });
        }else{
          reject('No random found');
        }
      }).catch(err => {
        reject(err);
      });

    } catch (e) {
      console.log(e);
      reject(e);
    }

  });

};

module.exports.addEvent = (gameEvent) => {
  return new Promise((resolve, reject) => {
    try {
      if (!gameEvent instanceof GameEvent) {
        throw new Error('No instance of');
      }

      getGameDataFromId(gameEvent.gameDataId).then(gameData => {
        addEventScheduleRule(gameData, gameEvent);

        //waiteing on with return ....
      }).then(value => {

        calculateId(GameEventModel).then(id => {
          gameEvent.id = id;
          gameEvent.save().then((doc) => {
            resolve(doc);
          }).catch(err => {
            reject(err);
          });
        });
      }).catch(err => {
        reject(err);
      });

    } catch (e) {
      console.log(e);
      reject(e);
    }

  });

};

module.exports.addPlayers = ({players, id: gameId}) => {
  return new Promise((resolve, reject) => {
    try {
      if (!players instanceof Array) {
        throw new Error('No instance of');
      }
      const promise = (item) => {
        return new Promise((resolve, reject) => {
          if (item) {
            const gameMember = new GameMemberModel({gameId, playerId: item.id});
            console.log(gameMember);

            gameMember.save(function(err, item) {
              if (err) {
                reject(err);
              } else {
                resolve(item);
              }
            });
          } else {
            reject('No item');
          }
        });
      };
      promiseFor(promise, players).then((item) => {
        resolve(item);
      }).catch(err => {
        reject(err);
      });

      //save players
    } catch (e) {
      console.log(e);
      reject(e);
    }

  });

};
