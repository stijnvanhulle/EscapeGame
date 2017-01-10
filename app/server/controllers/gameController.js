/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-28T14:54:43+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-05T12:50:20+01:00
* @License: stijnvanhulle.be
*/

const {io, client} = require('../lib/global');

const moment = require('moment');

const {calculateId, random} = require('./lib/functions');
const scheduleJob = require("../lib/scheduleJob");

const {
  Game,
  GameEvent,
  GameData,
  EventType,
  GamePlayer,
  Player
} = require('../models');
const {promiseFor, setToMoment, isBool, convertToBool} = require('../lib/functions');
const {
  Game: GameModel,
  Player: PlayerModel,
  GameEvent: GameEventModel,
  GamePlayer: GamePlayerModel,
  GameData: GameDataModel,
  EventType: EventTypeModel
} = require('../models/mongo');

const {mqttNames, socketNames} = require('../lib/const');

const addGame = (game) => {
  return new Promise((resolve, reject) => {
    try {
      if (!game instanceof Game) {
        throw new Error('No instance of');
      }
      calculateId(GameModel).then(id => {
        game.id = id;
        game.generateAlienName();

        game.save().then((doc) => {
          let game = new Game();
          game.load(doc);
          resolve(game);
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
          let game = new Game();
          game.load(doc);
          resolve(game);
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
        GameDataModel.findOne({id: id}).exec(function(err, doc) {
          if (err) {
            reject(err);
          } else {
            let gameData = new GameData();
            gameData.load(doc);
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

const getGameDataByGameName = (gameName) => {
  return new Promise((resolve, reject) => {
    try {
      if (gameName) {
        GameDataModel.find({gameName: gameName}).exec(function(err, docs) {
          if (err) {
            reject(err);
          } else {
            let gameDatas = docs.map((item) => {
              let gameData = new GameData();
              gameData.load(item);
              return gameData;
            });
            resolve(gameDatas);

          }
        });
      } else {
        reject('No gameName found');
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
      EventTypeModel.findOne({name: name}).exec(function(err, doc) {
        if (err) {
          reject(err);
        } else {
          let eventType = new EventType();
          eventType.load(doc);
          resolve(eventType);
        }
      });

    } else {
      reject('no data');
    }
  });
};

const getEventTypes = () => {
  return new Promise((resolve, reject) => {
    EventTypeModel.find().sort({'id': 1}).exec(function(err, docs) {
      if (err) {
        reject(err);
      } else {
        let eventTypes = docs.map((item) => {
          let eventType = new EventType();
          eventType.load(item);
          return eventType;
        });
        resolve(eventTypes);
      }
    });

  });
};
const getGameEventById = (id) => {
  return new Promise((resolve, reject) => {
    if (id) {
      GameEventModel.findOne({id: id}).sort({'id': 1}).exec(function(err, doc) {
        if (err) {
          reject(err);
        } else {
          let gameEvent = new GameEvent({gameId: null});
          gameEvent.load(doc);
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
      let find = {
        $or: [
          {
            jobHashEnd: jobHash
          }, {
            jobHashStart: jobHash
          }
        ]
      };
      GameEventModel.findOne(find).sort({'id': 1}).exec(function(err, doc) {
        if (err) {
          reject(err);
        } else {
          let gameEvent = new GameEvent({gameId: null});
          gameEvent.load(doc);
          resolve(gameEvent);
        }
      });

    } else {
      reject('No gameEvent hash item');
    }
  });
};
const getGameEventByIsActive = (isActive, gameId) => {
  return new Promise((resolve, reject) => {
    if (isActive != null) {
      let find = {
        isActive
      };
      if (gameId) {
        find = {
          isActive,
          gameId
        };
      }
      GameEventModel.find(find).sort({'id': 1}).exec(function(err, docs) {
        if (err) {
          reject(err);
        } else {
          let gameEvents = docs.map((item) => {
            let gameEvent = new GameEvent({gameId: gameId});
            gameEvent.load(item);
            return gameEvent;
          });
          resolve(gameEvents);
        }
      });

    } else {
      reject('No gameEvent isActive item');
    }
  });
};
const getGameEventFromGame = (gameId, startId = null) => {
  return new Promise((resolve, reject) => {
    if (gameId) {
      GameEventModel.find({gameId: gameId, isActive: true, finishDate: null}).sort({'id': 1}).exec(function(err, docs) {
        if (err) {
          reject(err);
        } else {
          if (startId) {
            docs.filter((item) => {
              if (item.id != startId) {
                return item;
              }
            });
          }
          let gameEvents = docs.map((item) => {
            let gameEvent = new GameEvent({gameId: null});
            gameEvent.load(item);
            return gameEvent;
          });
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
    GameDataModel.findOne({id: id}).exec(function(err, doc) {
      if (err) {
        reject(err);
      } else {
        let gameData = new GameData();
        gameData.load(doc);
        resolve(gameData);
      }
    });
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
            GameDataModel.find({gameName: gameName, typeId: typeIdNotObject}).sort({'typeId': 1, 'id': 1}).exec(function(err, docs) {
              if (err) {
                reject(err);
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
                      gameDatas = addOnRandomArray(gameDatas, newItem, amount);

                      return item;
                    }
                  }

                });

                resolve(gameDatas);
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
        reject('No gameName found');
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }

  });
};

const addOnRandomArray = (array, item, amount) => {
  let newArray = [...array];
  let random;
  const newRandom = () => {
    random = Math.floor((Math.random() * array.length) + 1);
  };
  for (var i = 0; i < amount; i++) {
    let oldRandom = random;
    newRandom();
    if (random == oldRandom) {
      newRandom();
    }
    if (random > 1 && newArray[random - 1] && newArray[random - 1].typeId == item.typeId) {
      newRandom();
    }
    if (random > 1 && newArray[random + 1] && newArray[random + 1].typeId == item.typeId) {
      newRandom();
    }
    newArray.splice(random, 0, item);

  }

  return newArray;
};

//updates

const updateGame = (obj) => {
  return new Promise((resolve, reject) => {
    if (!obj && obj.id)
      reject('No id for game');

    if (!obj instanceof Game) {
      reject('No instance of game');
    }
    obj = obj.json(stringify = false);
    //
    console.log(obj);
    GameModel.update({
      id: obj.id
    }, {
      teamName: obj.teamName,
      gameName: obj.gameName,
      alienName: obj.alienName,
      isFinished: obj.isFinished,
      isPlaying: obj.isPlaying
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
        level: obj.level,
        tries: obj.tries
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
        level: obj.level,
        tries: obj.tries
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

const getGameEvents = (find) => {
  return new Promise((resolve, reject) => {
    try {
      GameEventModel.find(find).exec(function(err, docs) {
        if (err) {
          reject(err);
        } else {
          let gameEvents = docs.map((item) => {
            let gameEvent = new GameEvent({gameId: null});
            gameEvent.load(item);
            gameEvent.calculateTimes();
            return gameEvent.sort('gameDataId', 'timeBetween', 'percentSpeed', 'timePlayed', 'tries', 'isCorrect', 'level');
          });
          resolve(gameEvents);

        }
      });

    } catch (e) {
      console.log(e);
      reject(e);
    }

  });
};

const updateGameEventsFrom = (previousGameEvent, gameEvents) => {
  return new Promise((resolve, reject) => {
    let isFirstTime = true;
    let startTime = setToMoment(previousGameEvent.finishDate).add('seconds', 5);
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
          gameEvent.createData(gameDataId = gameEvent.gameDataId, gameEvent.level, startTime = startTime, startIn = 0, maxTime = null, timeBetween = null);
          _previousGameEvent = gameEvent;
          isFirstTime = false;

          getGameDataById(gameEvent.gameDataId).then(gameData => {
            let ok = updateEventScheduleRule(gameEvent);
            if (ok) {
              return updateGameEvent(gameEvent);
            } else {
              reject('update schedule not correct', gameEvent);
            }

          }).then(doc => {
            resolve(doc);
          }).catch(err => {
            reject(err);
          });

        }
      });
    };

    Promise.resolve(true).then(() => {
      if (gameEvents) {
        return gameEvents;
      } else {
        return getGameEventFromGame(gameId, startId = previousGameEvent.id + 1);
      }
    }).then(_gameEvents => {
      return promiseFor(promise, _gameEvents);
    }).then(data => {
      resolve(data);
    }).catch(err => {
      reject(err);
    })
  });
};

//functions

const timeoutEndScheduleRule = (gameData, gameEvent) => {
  return new Promise((resolve, reject) => {
    if (!gameEvent.endDate)
      reject('No data seconds found in gameData');
    const endDate = setToMoment(gameEvent.endDate);
    if (!endDate)
      reject('Cannot convert endDate to moment object');

    let job = scheduleJob.addRule(endDate, {
      gameData,
      gameEvent
    }, ({running, runned, hash}) => {
      return new Promise((resolve, reject) => {
        console.log('RUNNING_END', running, ' hash: ', hash);
        endGameEvent(gameData, gameEvent).then(data => {
          resolve(runned);
        }).catch(err => {
          reject(err);
        });
      });
    });

    resolve(job);
  });
};

const timeoutStartScheduleRule = (gameData, gameEvent) => {
  return new Promise((resolve, reject) => {
    if (!gameEvent.activateDate)
      reject('No data seconds found in gameData');
    const activateDate = setToMoment(gameEvent.activateDate);
    if (!activateDate)
      reject('Cannot convert activateDate to moment object');

    let job = scheduleJob.addRule(activateDate, {
      gameData,
      gameEvent
    }, ({running, runned, hash}) => {
      return new Promise((resolve, reject) => {
        console.log('RUNNING_START', running, ' hash: ', hash);
        startGameEvent(gameData, gameEvent).then(data => {
          resolve(runned);
        }).catch(err => {
          reject(err);
        });

      });
    });

    resolve(job);
  });
};
const addEventScheduleRule = (gameData, gameEvent) => {
  return new Promise((resolve, reject) => {
    if (!gameEvent.isActive) {
      resolve(true);
    }

    timeoutStartScheduleRule(gameData, gameEvent).then(job => {
      if (job && job.name) {
        gameEvent.setJobHashStart(job.name);
        return timeoutEndScheduleRule(gameData, gameEvent);
      } else {
        reject('no job or hash', job);
      }

    }).then(job => {
      if (job && job.name) {
        gameEvent.setJobHashEnd(job.name);
        return updateGameEvent(gameEvent);
      } else {
        reject('no job or hash', job);
      }
    }).then(data => {
      resolve(data);
    }).catch(err => {
      reject(err);
    })

  });
};

const updateEventScheduleRule = (gameEvent) => {
  let okUpdate = false;

  if (gameEvent.jobHashStart && gameEvent.activateDate) {
    okUpdate = scheduleJob.updateRule(gameEvent.jobHashStart, gameEvent.activateDate);
  } else {
    console.log('jobhash start not filled in');
    okUpdate = false;
  }

  if (gameEvent.jobHashEnd && gameEvent.endDate) {
    okUpdate = scheduleJob.updateRule(gameEvent.jobHashEnd, gameEvent.endDate);
  } else {
    console.log('jobhash end not filled in');
    okUpdate = false;
  }
  return okUpdate;

};

const randomLetterFrom = (sentence) => {
  return new Promise((resolve, reject) => {
    resolve('l');
  });
};

const isAnswerCorrect = (inputData, gameData, gameEvent) => {
  return new Promise((resolve, reject) => {
    try {
      const data = gameData.data.data;
      const isLetter = data.isLetter;
      const answer = data.answer;

      console.log('INPUTDATA', inputData);

      if (answer) {
        let {value, name} = answer;
        inputData = inputData.input.toString().toLowerCase();
        name = name.toString().toLowerCase();

        if (inputData == name || inputData.indexOf('name') != -1) {
          if (isLetter) {
            getGameById(gameEvent.gameId).then(game => {
              const sentence = game.sentence;
              return randomLetterFrom(sentence);
            }).then(letter => {
              resolve({data: {
                  letter
                }, correct: true});

            }).catch(err => {
              reject(err);
            });
          } else {
            resolve({data: null, correct: false});
          }

        } else {
          resolve({data: null, correct: false});
        }

      } else {
        if (isBool(inputData.input) && convertToBool(inputData.input) === true) {
          resolve({data: null, correct: true});
        } else {
          resolve({data: null, correct: false});
        }
      }
    } catch (e) {
      reject(e);
    }

  });
};

const finishGameEventFromHash = (inputData) => {
  return new Promise((resolve, reject) => {
    try {
      let gameEvent;
      let gameData;

      let currentData;
      if (!inputData || !inputData.jobHash) {
        reject('Not all data filled in');
      }

      getGameEventByHash(inputData.jobHash).then(item => {
        gameEvent = item;
        return getGameDataById(gameEvent.gameDataId);
      }).then(item => {
        gameData = item;
        currentData = gameData.data.data;
        if (gameData && gameEvent) {

          return isAnswerCorrect(inputData, gameData, gameEvent);
        } else {
          reject('gamedata or gamevent not filled in', gameEvent, gameData);
        }

      }).then(({data, correct}) => {
        gameEvent.addTry();
        gameEvent.isCorrect = correct;

        let triesOver = null;
        if (currentData.maxTries != null) {
          triesOver = currentData.maxTries - gameEvent.tries;
        }

        console.log('answer correct: ', correct, triesOver);

        io.emit(socketNames.EVENT_DATA, {data, inputData, gameEvent, correct, triesOver});

        if ((currentData.retries != null && currentData.maxTries <= gameEvent.tries) || gameEvent.isCorrect || triesOver == 0) {
          return endGameEvent(gameData, gameEvent, recalculate = true);
        } else {
          gameEvent.setFinish(inputData.finishDate || gameEvent.endDate);
          updateGameEvent(gameEvent).then(() => {
            return {runned: false};
          }).catch(() => {
            reject('Cannot update gameevent');
          });

        }

      }).then(data => {
        console.log('resolve', data);
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

const startGameEvent = (gameData, gameEvent, recalculate = false) => {
  return new Promise((resolve, reject) => {
    try {

      gameEvent.calculateTimes();
      gameEvent.setJobHashStart(null);

      updateGameEvent(gameEvent).then(obj => {
        return getGameEventByIsActive(true, gameEvent.gameId);
      }).then(data => {
        const amount = data.length;
        io.emit(socketNames.EVENT_START, {
          gameData: gameData.json(false, true, false),
          gameEvent: gameEvent.json(false, true, false),
          activeEvents: amount
        });
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
const endGameEvent = (gameData, gameEvent, recalculate = false) => {
  return new Promise((resolve, reject) => {
    try {
      gameEvent.setInactive();
      gameEvent.setJobHashEnd(null);
      if (!gameEvent.finishDate) {
        gameEvent.setFinish(moment().valueOf());
      }

      updateGameEvent(gameEvent).then(obj => {
        return getGameEventByIsActive(true, gameEvent.gameId);
      }).then(data => {
        const amount = data.length;
        io.emit(socketNames.EVENT_END, {
          gameData: gameData.json(false, true, false),
          gameEvent: gameEvent.json(false, true, false),
          activeEvents: amount
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
              let gameData = new GameData();
              gameData.load(doc);
              resolve(gameData);
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

const createGameEvents = ({
  gameId,
  gameName,
  startTime,
  startIn,
  level,
  types = {}
}) => {
  return new Promise((resolve, reject) => {
    try {
      let promise;
      if (!gameId && !gameName) {
        reject('Gameid, gamename not filled in');
      }
      let _previousGameEvent;
      promise = (gameData, i) => {
        return new Promise((resolve, reject) => {
          if (gameData) {
            const gameEvent = new GameEvent({gameId});
            if (_previousGameEvent) {
              startTime = _previousGameEvent.endDate;
            }

            gameEvent.createData(gameDataId = gameData.id, level, startTime, startIn = startIn, maxTime = gameData.data.maxTime, timeBetween = null);
            _previousGameEvent = gameEvent;
            resolve(gameEvent.json(stringify = false, removeEmpty = true));
          } else {
            reject('No item');
          }
        });
      };
      types = {
        'description': {
          amount: 0
        },
        'finish': {
          amount: 0
        },
        'anthem': {
          amount: 0
        },
        'find': {
          amount: 0
        },
        'book': {
          amount: 0
        },
        'bom': {
          amount: 2
        },
        'sound': {
          amount: 0
        }
      };
      getGameDataFromGameName(gameName, types).then(gameDatas => {
        return promiseFor(promise, gameDatas);
      }).then((items) => {
        resolve(items);
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
      let gameData;
      getGameDataFromId(gameEvent.gameDataId).then(_gameData => {
        gameData = _gameData;

        calculateId(GameEventModel).then(id => {
          gameEvent.id = id + i;
          gameEvent.save().then((doc) => {
            return doc;
          }).catch(err => {
            reject(err);
          });
        });
      }).then(value => {
        return addEventScheduleRule(gameData, gameEvent);
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

const addPlayers = ({players, id: gameId}) => {
  return new Promise((resolve, reject) => {
    try {
      if (!players instanceof Array) {
        throw new Error('No instance of');
      }
      const promise = (item) => {
        return new Promise((resolve, reject) => {
          if (item) {
            const gamePlayer = new GamePlayerModel({gameId, playerId: item.id});

            gamePlayer.save().then(doc => {
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

const getPlayers = (gameId) => {
  return new Promise((resolve, reject) => {
    try {
      if (!gameId) {
        throw new Error('Gameid not set');
      } else {
        const promise = (item) => {
          return new Promise((resolve, reject) => {
            if (item) {
              PlayerModel.findOne({id: item.playerId}).exec(function(err, doc) {
                if (err) {
                  reject(err);
                } else {
                  const player = new Player({firstName: doc.firstName, lastName: doc.lastName, birthday: doc.birthday, email: doc.email});
                  player.load(doc);
                  item.player = player;
                  resolve(player);
                }
              });

            } else {
              reject('No item');
            }
          });
        };

        GamePlayerModel.find({gameId: gameId}).exec(function(err, docs) {
          if (err) {
            reject(err);
          } else {
            let gamePlayers = docs.map((item) => {
              let gamePlayer = new GamePlayer();
              gamePlayer.load(item);
              return gamePlayer;
            });

            promiseFor(promise, gamePlayers).then((item) => {
              resolve(item);
            }).catch(err => {
              reject(err);
            });

          }
        });

      }

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
module.exports.updateGame = updateGame;
module.exports.getGameById = getGameById;
module.exports.updateGameEvent = updateGameEvent;
module.exports.getGameEvents = getGameEvents;
module.exports.endGameEvent = endGameEvent;
module.exports.getGameDataById = getGameDataById;
module.exports.updateGameEventsFrom = updateGameEventsFrom;
module.exports.createGameEvents = createGameEvents;
module.exports.addEvent = addEvent;
module.exports.getEventType = getEventType;
module.exports.addPlayers = addPlayers;
module.exports.getPlayers = getPlayers;
module.exports.cancelJobs = cancelJobs;
module.exports.finishGameEventFromHash = finishGameEventFromHash;
module.exports.getGameDataByGameName = getGameDataByGameName;