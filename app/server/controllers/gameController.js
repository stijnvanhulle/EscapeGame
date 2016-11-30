/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-28T14:54:43+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-30T23:59:22+01:00
* @License: stijnvanhulle.be
*/

const {io, client} = require('../lib/global');

const moment = require('moment');

const {calculateId, random} = require('./lib/functions');
const scheduleJob = require("../lib/scheduleJob");

const {Game, GameEvent, GameData} = require('../models');

const {promiseFor, setToMoment} = require('../lib/functions');
const {Game: GameModel, GameEvent: GameEventModel, GameMember: GameMemberModel, GameData: GameDataModel} = require('../models/mongo');

const socketNames = require('../lib/socketNames');

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

const updateGameEvent = (obj) => {
  return new Promise((resolve, reject) => {
    if (!obj && obj.id)
      reject('No id for gameEvent');

    if (!obj instanceof GameEvent) {
      reject('No instance of gameEvent');
    }
    obj = obj.json(false);
    GameEventModel.update({
      id: obj.id
    }, {
      isActive: obj.isActive
    }, {
      multi: true
    }, function(err, raw) {
      if (err) {
        reject(err);
      } else {
        resolve(raw);
      }
    });
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

const timeoutEndScheduleRule = (gameData, gameEvent) => {
  if (!gameEvent.endDate)
    throw new Error('No data seconds found in gameData');
  const endDate = setToMoment(gameEvent.endDate);
  if (!endDate)
    reject('Cannot convert endDate to moment object');

  return scheduleJob.addRule(endDate, null, () => {
    return new Promise((resolve, reject) => {
      resolve({runned: true});
    });
  });
};
const addEventScheduleRule = (gameData, gameEvent) => {
  if (!gameEvent.activateDate)
    throw new Error('No data seconds found in gameData');
  const activateDate = setToMoment(gameEvent.activateDate);
  if (!activateDate)
    reject('Cannot convert activateDate to moment object');
  return scheduleJob.addRule(activateDate, gameEvent, () => {
    return new Promise((resolve, reject) => {
      io.emit(socketNames.EVENT_START, {gameData, gameEvent});
      timeoutEndScheduleRule(gameData, gameEvent).then(({runned}) => {
        if (runned) {
          gameEvent.setInactive();
          return updateGameEvent(gameEvent);
        }
      }).then(({ok}) => {
        if(ok){
          io.emit(socketNames.EVENT_END, {gameData, gameEvent});
        }
      });

      resolve({runned: true});
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
        } else {
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

module.exports.getGameData = (id) => {
  return new Promise((resolve, reject) => {
    try {
      if (id) {
        GameDataModel.findOne({id: id}).exec(function(err, doc) {
          if (err) {
            reject(err);
          } else {
            resolve(doc);
          }
        });
      } else {
        reject('No id found');
      }

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
      //TODO:check of gameEvent already exists
      getGameDataFromId(gameEvent.gameDataId).then(gameData => {
        let item = new GameData();
        item.load(gameData);
        addEventScheduleRule(item, gameEvent);

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

            gameMember.save().then(doc => {
              resolve(doc);
            }).catch(err => {
              reject(err);
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
