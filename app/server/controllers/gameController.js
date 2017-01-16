/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-28T14:54:43+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-10T10:49:31+01:00
* @License: stijnvanhulle.be
*/
const DELAY = 5; //delay needed for delay of api calls clien<=>server

const {io, client} = require('../lib/app');
const moment = require('moment');

const {calculateId, random, checkExtra, getRandomType} = require('./lib/functions');
const scheduleJob = require("../lib/scheduleJob");
const gameLogic = require('../lib/gameLogic');
const {
  Game,
  GameEvent,
  GameData,
  EventType,
  GamePlayer,
  Player
} = require('../models');
const {
  promiseFor,
  setToMoment
} = require('../lib/functions');
const {
  Game: GameModel,
  GamePlayer: GamePlayerModel,
  Player: PlayerModel,
  GameEvent: GameEventModel,
  GameData: GameDataModel,
  EventType: EventTypeModel
} = require('../models/mongo');

const {mqttNames, socketNames} = require('../lib/const');
const {scheduleController} = require('../controllers');

const getGame = (find) => {
  return new Promise((resolve, reject) => {
    try {
      if (!find) {
        throw new Error('No find for game');
      } else {
        GameModel.findOne(find).exec(function(e, doc) {
          if (e) {
            throw new Error(e);
          } else {
            let game = new Game();
            game.load(doc);
            resolve(game);
          }
        });
      }

    } catch (e) {
      reject(e);
    }
  });
};

const getGameData = (find) => {
  return new Promise((resolve, reject) => {
    try {
      if (!find) {
        throw new Error('No find for gameData');
      } else {
        GameDataModel.findOne(find).exec(function(e, doc) {
          if (e) {
            throw new Error(e);
          } else {
            let gameData = new GameData();
            gameData.load(doc);
            resolve(gameData);
          }
        });
      }
    } catch (e) {
      reject(e);
    }

  });
};

const getGameDatas = (find) => {
  return new Promise((resolve, reject) => {
    try {
      GameDataModel.find(find).sort({'id': 1}).exec(function(e, docs) {
        if (e) {
          throw new Error(e);
        } else {
          let gameDatas = docs.map((item) => {
            let gameData = new GameData();
            gameData.load(item);
            return gameData;
          });
          resolve(gameDatas);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getRandomGameData = () => {
  return new Promise((resolve, reject) => {
    try {
      random(GameDataModel).then(random => {
        if (random) {
          return getGameData({id: random});
        } else {
          throw new Error("No random found");
        }
      }).then(gameDatas => {
        resovle(gameDatas)
      }).catch(e => {
        throw new Error(e);
      });

    } catch (e) {
      reject(e);
    }

  });

};

const getGameEvent = (find) => {
  return new Promise((resolve, reject) => {
    try {
      if (!find) {
        throw new Error('No find for gameEvent');
      } else {
        GameEventModel.findOne(find).exec(function(e, doc) {
          if (e) {
            throw new Error(e);
          } else {
            let gameEvent = new GameEvent({gameId: null});
            gameEvent.load(doc);
            resolve(gameEvent);
          }
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getGameEvents = (find, canSort = false, calcDuration = false) => {
  return new Promise((resolve, reject) => {
    try {
      const promise = (item, i, amount) => {
        return new Promise((resolve, reject) => {
          if (item.gameId) {
            getGame({id: item.gameId}).then(game => {
              item.gameDuration = game.duration;
              resolve(item);
            }).catch(err => {
              reject(err);
            });
          } else {
            reject(new Error('GameId not found in getGameEvents'));
          }
        });
      };

      if (!find) {
        throw new Error('No find for gameEvents');
      } else {
        GameEventModel.find(find).exec(function(e, docs) {
          if (e) {
            throw new Error(e);
          } else {
            let gameEvents = docs.map((item) => {
              let gameEvent = new GameEvent({gameId: null});
              gameEvent.load(item);
              gameEvent.calculateTimes();
              if (canSort) {
                return gameEvent.sort('gameDataId', 'timeBetween', 'percentSpeed', 'timePlayed', 'tries', 'isCorrect', 'level');
              } else {
                return gameEvent;
              }

            });

            promiseFor(promise, gameEvents).then(gameEvents => {
              resolve(gameEvents);
            }).catch(e => {
              throw new Error(e);
            });

          }
        });
      }
    } catch (e) {
      reject(e);
    }

  });
};

const getEventType = (find) => {
  return new Promise((resolve, reject) => {
    try {
      if (!find) {
        throw new Error('No find for gameData');
      } else {
        EventTypeModel.findOne(find).exec(function(e, doc) {
          if (e) {
            throw new Error(e);
          } else {
            let eventType = new EventType();
            eventType.load(doc);
            resolve(eventType);
          }
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getEventTypes = () => {
  return new Promise((resolve, reject) => {
    try {
      EventTypeModel.find().sort({'id': 1}).exec(function(e, docs) {
        if (e) {
          throw new Error(e);
        } else {
          let eventTypes = docs.map((item) => {
            let eventType = new EventType();
            eventType.load(item);
            return eventType;
          });
          resolve(eventTypes);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
};

//add
const addGame = (game) => {
  return new Promise((resolve, reject) => {
    try {
      if (!game instanceof Game) {
        throw new Error('No instance of game');
      }
      calculateId(GameModel).then(id => {
        game.id = id;
        game.generateAlienName();
        return game.save();
      }).then(doc => {
        game.load(doc);
        resolve(game);
      }).catch(e => {
        throw new Error(e);
      });
    } catch (e) {
      reject(e);
    }

  });
};

const getGameDataFromGameName = (gameName, types) => {
  return new Promise((resolve, reject) => {
    try {
      if (gameName) {
        gameName = gameName.toLowerCase();
        if (types) {
          const notTypes = Object.keys(types).filter(item => {
            if (types[item].amount == 0) {
              return item;
            }
          });
          const goodTypes = Object.keys(types).filter(item => {
            if (types[item].amount != 0) {
              return item;
            }
          });
          getEventTypes().then((typeIds) => {
            let typeIdNotObject = {};

            if (typeIds && typeIds.length > 0) {
              let noIn = typeIds.filter((item) => {
                for (var i = 0; i < notTypes.length; i++) {
                  if (item.name == notTypes[i]) {
                    return item;
                  }
                }

              }).map(item => {
                return item.id;
              });
              typeIdNotObject = {
                "$nin": noIn
              };
            }
            GameDataModel.find({gameName: gameName, typeId: typeIdNotObject}).sort({'typeId': 1, 'id': 1}).exec(function(e, docs) {
              if (e) {
                throw new Error(e);
              } else {
                let gameDatas = docs.map((item) => {
                  let gameData = new GameData();
                  gameData.load(item);

                  return gameData;
                });

                typeIds.filter((item) => {
                  for (var i = 0; i < goodTypes.length; i++) {
                    if (item.name == goodTypes[i]) {
                      let newItem = gameDatas.find(a => {
                        if (item.id == a.typeId) {
                          return a;
                        }
                      });
                      let amount = types[item.name].amount;
                      gameDatas = getRandomType(gameDatas, newItem, amount);

                      return item;
                    }
                  }

                });

                resolve(gameDatas);
              }
            });
          }).catch((e) => {
            throw new Error(e);
          });
        } else {
          GameDataModel.find({gameName: gameName}).sort({'typeId': 1, 'id': 1}).exec(function(e, docs) {
            if (e) {
              throw new Error(e);
            } else {
              let gameDatas = docs.map((item) => {
                let gameData = new GameData();
                gameData.load(item);
                return gameData;
              });
              resolve(gameDatas);
            }
          });

        }

      } else {
        throw new Error('No gameName found');
      }
    } catch (e) {
      reject(e);
    }

  });
};

//updates
const updateGame = (find, game) => {
  return new Promise((resolve, reject) => {
    try {
      if (!game && game.id)
        throw new Error('No id for game');

      if (!game instanceof Game)
        throw new Error('No instance of game');

      if (!find)
        throw new Error('No find for updategame');

      game = game.json(stringify = false, removeEmpty = false, subDataJson = true);

      GameModel.findOneAndUpdate(find, {
        teamName: game.teamName,
        gameName: game.gameName,
        alienName: game.alienName,
        isFinished: game.isFinished,
        isPlaying: game.isPlaying,
        duration: game.duration,
        answerData: game.answerData
      }, {
        new: true
      }, function(e, doc) {
        if (e) {
          throw new Error(e);
        } else {
          let game = new Game();
          game.load(doc);
          resolve(game);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateGameEvents = (gameEvents) => {
  return new Promise((resolve, reject) => {
    try {
      const promise = (item, i, amount) => {
        return updateGameEvent({
          id: item.id
        }, item);
      };
      console.log('UPDATE LEVEL ', gameEvents);

      promiseFor(promise, gameEvents).then(gameEvents => {
        resolve(gameEvents);
      }).catch(e => {
        throw new Error(e);
      });
    } catch (e) {
      reject(e);
    }

  });
};
const updateGameEventsAfterGameEvent = (gameEvent, newLevel) => {
  return new Promise((resolve, reject) => {
    try {
      getGameEvents({gameId: gameEvent.gameId, isActive: true, finishDate: null}).then(gameEvents => {
        gameEvents = gameEvents.map(item => {
          item.level = newLevel;
          return item;
        });
        return updateGameEvents(gameEvents);
      }).then(gameEvents => {
        resolve(gameEvents);
      }).catch(e => {
        throw new Error(e);
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateGameEvent = (find, gameEvent, extra = {}) => {
  return new Promise((resolve, reject) => {
    try {
      if (!gameEvent || !gameEvent.id)
        throw new Error('No id for gameEvent');

      if (!gameEvent instanceof GameEvent) {
        throw new Error('No instance of gameEvent');
      }
      if (!find)
        throw new Error('No find for updategameEvent');

      gameEvent = gameEvent.json(stringify = false);
      if (extra.isActive) {
        find.isActive = extra.isActive;
      }
      let change = checkExtra(gameEvent,extra);
      if (change) {
        gameEvent = change;
      }

      console.log('update gameEvent', change, extra);
      GameEventModel.findOneAndUpdate(find, gameEvent, {
        new: true
      }, function(e, doc) {
        if (e) {
          throw new Error(e);
        } else {
          let gameEvent = new GameEvent();
          gameEvent.load(doc);
          resolve(gameEvent);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getGame,
  updateGame,
  getGameData,
  getGameDatas,
  updateGameEvent,
  getGameEvents,
  getGameEvent,
  getEventType,
  getGameDataFromGameName,
  updateGameEventsAfterGameEvent
};
