/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-28T14:54:43+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-12T12:19:56+01:00
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

const addGame = (game) => {
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

const getGameById = (id) => {
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

const getGameDataById = (id) => {
  return new Promise((resolve, reject) => {
    try {
      if (id) {
        GameDataModel.findOne({id: id}).exec(function(err, gameData) {
          if (err) {
            reject(err);
          } else {
            resolve(gameData);
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
const getGameEventById = (id) => {
  return new Promise((resolve, reject) => {
    if (id) {
      GameEventModel.findOne({id: id}).sort({'id': 1}).exec(function(err, gameEvent) {
        if (err) {
          reject(err);
        } else {
          resolve(gameEvent);
        }
      });

    } else {
      reject('No item');
    }
  });
};
const getGameEventByHash = (jobHash) => {
  return new Promise((resolve, reject) => {
    if (jobHash) {
      GameEventModel.findOne({jobHash: jobHash}).sort({'id': 1}).exec(function(err, gameEvent) {
        if (err) {
          reject(err);
        } else {
          resolve(gameEvent);
        }
      });

    } else {
      reject('No gameEvent hash item');
    }
  });
};
const getGameEventFromGame = (gameId, startId = null) => {
  return new Promise((resolve, reject) => {
    if (gameId) {
      GameEventModel.find({gameId: gameId, isActive: true, finishDate: null}).sort({'id': 1}).exec(function(err, gameEvents) {
        if (err) {
          reject(err);
        } else {
          if (startId) {
            gameEvents.filter((item) => {
              if (item.id != startId) {
                return item;
              }
            });
          }

          resolve(gameEvents);
        }
      });

    } else {
      reject('No item');
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
const getGameDataFromGameName = (gameName, ...notTypes) => {
  return new Promise((resolve, reject) => {
    try {
      if (gameName) {
        gameName = gameName.toLowerCase();
        if (notTypes) {
          promiseFor(getEventType, notTypes).then((typeIds) => {
            let typeIdNotObject = {};

            if (typeIds && typeIds.length > 0) {
              console.log(typeIds);
              typeIdNotObject = {
                '$ne': typeIds[0].id
              };
            }
            GameDataModel.find({gameName: gameName, typeId: typeIdNotObject}).sort({'typeId': 1, 'id': 1}).exec(function(err, docs) {
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

//updates

const updateGameEvent = (obj, isActive) => {
  return new Promise((resolve, reject) => {
    if (!obj && obj.id)
      reject('No id for gameEvent');

    if (!obj instanceof GameEvent) {
      reject('No instance of gameEvent');
    }
    obj = obj.json(stringify = false);
    //
    if (isActive == null) {
      GameEventModel.update({
        id: obj.id
      }, {
        isActive: obj.isActive,
        jobHash: obj.jobHash,
        finishDate: obj.finishDate,
        activateDate: obj.activateDate,
        endDate: obj.endDate,
        gameDataId: obj.gameDataId,
        level: obj.level
      }, {
        multi: true
      }, function(err, raw) {
        if (err) {
          reject(err);
        } else {
          resolve(raw);
        }
      });
    } else {
      GameEventModel.update({
        id: obj.id,
        isActive: isActive
      }, {
        isActive: obj.isActive,
        jobHash: obj.jobHash,
        finishDate: obj.finishDate,
        activateDate: obj.activateDate,
        endDate: obj.endDate,
        gameDataId: obj.gameDataId,
        level: obj.level
      }, {
        multi: true
      }, function(err, raw) {
        if (err) {
          reject(err);
        } else {
          resolve(raw);
        }
      });
    }

  });
};

const updateGameEventsFrom = (previousGameEvent) => {
  return new Promise((resolve, reject) => {
    let isFirstTime = true;
    let startTime = setToMoment(previousGameEvent.finishDate).add('seconds', 10);
    let {gameId, finishDate} = previousGameEvent;
    let _previousGameEvent = previousGameEvent;

    const promise = (item) => {
      return new Promise((resolve, reject) => {
        if (item) {
          let gameEvent = new GameEvent({gameId});
          gameEvent.load(item);

          if (_previousGameEvent) {
            if (!isFirstTime) {
              startTime = _previousGameEvent.endDate;
            }

          }
          gameEvent.createGameData(gameDataId = gameEvent.gameDataId, gameEvent.level, startTime = startTime, startIn = 10, maxTime = null, timeBetween = null);
          _previousGameEvent = gameEvent;
          isFirstTime = false;

          getGameDataById(gameEvent.gameDataId).then(data => {
            let gameData = new GameData();
            gameData.load(data);
            addEventScheduleRule(gameData, gameEvent);

            return updateGameEvent(gameEvent);
          }).then(doc => {
            resolve(doc);
          }).catch(err => {
            reject(err);
          });

        }
      });
    };

    cancelJobs().then(ok => {
      return getGameEventFromGame(gameId, startId = previousGameEvent.id + 1);
    }).then(gameEvents => {
      return promiseFor(promise, gameEvents);
    }).then(data => {
      resolve(data);
    }).catch(err => {
      reject(err);
    })
  });
};

//functions

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

  if (!gameEvent.isActive) {
    resolve(true);
    return;
  }
  return scheduleJob.addRule(activateDate, {
    gameData,
    gameEvent
  }, ({running, runned, hash}) => {
    console.log('RUNNING', running, ' hash: ', hash);
    return new Promise((resolve, reject) => {
      gameEvent.setJobHash(hash);
      //updategameEvent
      //
      updateGameEvent(gameEvent).then(doc => {
        io.emit(socketNames.EVENT_START, {
          gameData: gameData.json(false, true, false),
          gameEvent: gameEvent.json(false, true, false)
        });
        return timeoutEndScheduleRule(gameData, gameEvent);
      }).then(({running, runned, hash}) => {
        console.log('RUNNED', runned, ' hash: ', hash);
        if (runned) {
          return finishGameEvent(gameData, gameEvent);
        }
      }).then(({runned}) => {
        resolve(runned);
      }).catch((err) => {
        reject(err);
      });

    });
  });
};

const finishGameEventFromHash = (jobHash, finishDate) => {
  return new Promise((resolve, reject) => {
    try {
      let gameEvent = new GameEvent({gameId: null});
      let gameData = new GameData();

      getGameEventByHash(jobHash).then(item => {
        gameEvent.load(item);
        gameEvent.setFinish(finishDate);
        return getGameDataById(gameEvent.gameDataId);
      }).then(item => {
        gameData.load(item);
        if (gameData && gameEvent) {
          return finishGameEvent(gameData, gameEvent, recalculate = true);
        } else {
          reject('gamedata or gamevent not filled in', gameEvent, gameData);
        }

      }).then(data => {
        resolve(data);
      }).catch(err => {
        reject(err);
      });

    } catch (e) {
      console.log(e);
      reject(e);
    }

  });
};

const finishGameEvent = (gameData, gameEvent, recalculate = false) => {
  return new Promise((resolve, reject) => {
    try {
      gameEvent.setInactive();
      gameEvent.setJobHash(null);

      updateGameEvent(gameEvent).then(obj => {
        io.emit(socketNames.EVENT_END, {
          gameData: gameData.json(false, true, false),
          gameEvent: gameEvent.json(false, true, false)
        });
        if (recalculate) {
          return updateGameEventsFrom(gameEvent);
        } else {
          resolve({runned: true});
        }

      }).then(obj => {
        resolve({runned: true});
      }).catch((err) => {
        reject(err);
      });

    } catch (e) {
      console.log(e);
      reject(e);
    }

  });

};

const getRandomGameData = () => {
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

const createGameData = ({gameId, gameName, startTime, level}) => {
  return new Promise((resolve, reject) => {
    try {
      let promise;
      if (!gameId && !gameName && !startTime) {
        reject('Gameid, gamename and startttime not filled in');
      }
      let _previousGameEvent;
      promise = (item, i) => {
        return new Promise((resolve, reject) => {
          if (item) {
            const gameEvent = new GameEvent({gameId});
            let gameData = new GameData();
            gameData.load(item);
            if (_previousGameEvent) {
              startTime = _previousGameEvent.endDate;
            }

            gameEvent.createGameData(gameDataId = gameData.id, level, startTime = setToMoment(startTime), startIn = 10, maxTime = gameData.data.maxTime, timeBetween = null);
            _previousGameEvent = gameEvent;
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

//add

const addEvent = (gameEvent, i) => {
  return new Promise((resolve, reject) => {
    try {
      if (!gameEvent instanceof GameEvent) {
        throw new Error('No instance of');
      }
      //TODO:check of gameEvent already exists
      getGameDataFromId(gameEvent.gameDataId).then(data => {
        let gameData = new GameData();
        gameData.load(data);
        addEventScheduleRule(gameData, gameEvent);

        //waiteing on with return ....
      }).then(value => {

        calculateId(GameEventModel).then(id => {
          gameEvent.id = id + i;
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

const addPlayers = ({players, id: gameId}) => {
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

const cancelJobs = (hash) => {
  if (hash) {
    return scheduleJob.cancel(hash);
  } else {
    return scheduleJob.cancelAll();
  }
};

module.exports.addGame = addGame;
module.exports.getGameById = getGameById;
module.exports.updateGameEvent = updateGameEvent;
module.exports.finishGameEvent = finishGameEvent;
module.exports.getGameDataById = getGameDataById;
module.exports.updateGameEventsFrom = updateGameEventsFrom;
module.exports.createGameData = createGameData;
module.exports.addEvent = addEvent;
module.exports.addPlayers = addPlayers;
module.exports.cancelJobs = cancelJobs;
module.exports.finishGameEventFromHash = finishGameEventFromHash;
