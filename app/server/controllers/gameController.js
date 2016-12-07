/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-28T14:54:43+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-07T18:01:17+01:00
* @License: stijnvanhulle.be
*/

const {io, client} = require('../lib/global');

const moment = require('moment');

const {calculateId, random} = require('./lib/functions');
const scheduleJob = require("../lib/scheduleJob");

const {Game, GameEvent, GameData} = require('../models');

const {promiseFor, setToMoment} = require('../lib/functions');
const {Game: GameModel, GameEvent: GameEventModel, GameMember: GameMemberModel, GameData: GameDataModel, EventType: EventTypeModel} = require('../models/mongo');

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

module.exports.get = (id) => {
  return new Promise((resolve, reject) => {
    try {
      if (!id)
        reject('No id for game');

      GameModel.findOne({id: id}).exec(function(err, doc) {
        if (err) {
          reject(err);
        } else {
          resolve(doc);
        }
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

const getEventType = (name) => {
  return new Promise((resolve, reject) => {
    if (name) {
      name = name.toLowerCase();
      EventTypeModel.findOne({name: name}).exec(function(err, eventType) {
        if (err) {
          reject(err);
        } else {
          resolve(eventType);
        }
      });

    } else {
      reject('No item');
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
    obj = obj.json(stringify = false);
    //
    GameEventModel.update({
      id: obj.id
    }, {
      isActive: obj.isActive,
      jobHash: obj.jobHash
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

const timeoutEndScheduleRule = (gameData, gameEvent) => {
  if (!gameEvent.endDate)
    throw new Error('No data seconds found in gameData');
  const endDate = setToMoment(gameEvent.endDate);
  if (!endDate)
    reject('Cannot convert endDate to moment object');

  return scheduleJob.addRule(endDate, {gameData, gameEvent});
};
const addEventScheduleRule = (gameData, gameEvent) => {
  if (!gameEvent.activateDate)
    throw new Error('No data seconds found in gameData');
  const activateDate = setToMoment(gameEvent.activateDate);
  if (!activateDate)
    reject('Cannot convert activateDate to moment object');

  return scheduleJob.addRule(activateDate, {
    gameData,
    gameEvent
  }, ({running, runned, hash}) => {
    console.log('RUNNING', running, ' hash: ', hash);
    return new Promise((resolve, reject) => {
      gameEvent.setJobHash(hash);
      io.emit(socketNames.EVENT_START, {
        gameData: gameData.json(false, true, false),
        gameEvent: gameEvent.json(false, true, false)
      });
      timeoutEndScheduleRule(gameData, gameEvent).then(({running, runned, hash}) => {
        console.log('RUNNED', runned, ' hash: ', hash);
        if (runned) {
          return endGameEvent(gameData, gameEvent);
        }
      }).then(({runned}) => {
        resolve(runned);
      }).catch((err) => {
        reject(err);
      });

    });
  });
};

const endGameEvent = (gameData, gameEvent) => {
  return new Promise((resolve, reject) => {
    try {
      gameEvent.setInactive();
      gameEvent.setJobHash(null);
      updateGameEvent(gameEvent).then((doc) => {
        console.log('doc', doc);
        if (doc) {
          io.emit(socketNames.EVENT_END, {
            gameData: gameData.json(false, true, false),
            gameEvent: gameEvent.json(false, true, false)
          });
          resolve({runned: true});
        }
      }).catch((err) => {
        reject(err);
      });

    } catch (e) {
      console.log(e);
      reject(e);
    }

  });

};
module.exports.endGameEvent = endGameEvent;

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

const getGameDataFromGameName = (gameName, ...notTypes) => {
  return new Promise((resolve, reject) => {
    try {
      if (gameName) {
        gameName = gameName.toLowerCase();
        if (notTypes) {
          promiseFor(getEventType, notTypes).then((typeIds) => {
            GameDataModel.find({
              gameName: gameName,
              typeId: {
                '$ne': typeIds[0].id
              }
            }).sort({'typeId': 1, 'id': 1}).exec(function(err, docs) {
              if (err) {
                reject(err);
              } else {
                resolve(docs);
              }
            });
          }).catch((err) => {
            console.log(err);
          });
        } else {
          GameDataModel.find({gameName: gameName}).sort({'typeId': 1, 'id': 1}).exec(function(err, docs) {
            if (err) {
              reject(err);
            } else {
              resolve(docs);
            }
          });

        }

      } else {
        reject('No gameName found');
      }
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

module.exports.createGameData = (gameId, gameName, startTime, level) => {
  return new Promise((resolve, reject) => {
    try {
      if (!gameId && !gameName && !startTime) {
        reject('Gameid, gamename and startttime not filled in');
      }
      let previousGameEvent = null;

      const promise = (item, i) => {
        return new Promise((resolve, reject) => {
          if (item) {
            const gameEvent = new GameEvent(gameId);
            let gameData = new GameData();
            gameData.load(item);
            if (previousGameEvent) {
              startTime = previousGameEvent.endDate;
            }

            gameEvent.createGameData(gameDataId = gameData.id, level, startTime = setToMoment(startTime), startIn = 10, maxTime = gameData.data.maxTime, timeBetween = null);
            previousGameEvent = gameEvent;
            resolve(gameEvent.json(stringify = false, removeEmpty = true));
          } else {
            reject('No item');
          }
        });
      };

      getGameDataFromGameName(gameName, 'finish').then(docs => {
        promiseFor(promise, docs).then((items) => {
          resolve(items);
        }).catch(err => {
          reject(err);
        });
      }).catch(err => {
        reject(err);
      })

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

module.exports.updateEvent = (gameEvent) => {
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
        return updateGameEvent(gameEvent);
        //waiteing on with return ....
      }).then(value => {
        resolve(value);
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

module.exports.cancelJobs = (hash) => {
  return new Promise((resolve, reject) => {
    try {
      if (hash) {
        scheduleJob.cancel(hash);
      } else {
        scheduleJob.cancelAll();
      }
      resolve({runned: true})

    } catch (e) {
      console.log(e);
      reject(e);
    }

  });

};
