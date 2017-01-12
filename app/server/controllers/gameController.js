/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-28T14:54:43+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-10T10:49:31+01:00
* @License: stijnvanhulle.be
*/
const DELAY = 2;

const {io, client} = require('../lib/app');
const moment = require('moment');

const {calculateId, random} = require('./lib/functions');
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
const {promiseFor, setToMoment, isBool, convertToBool, randomLetterFrom} = require('../lib/functions');
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
      GameEventModel.findOne({id: id}).exec(function(err, doc) {
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
      console.log('find by hash', find);
      GameEventModel.findOne(find).sort({'id': 1}).exec(function(err, doc) {
        if (err) {
          reject(err);
        } else {
          let gameEvent = new GameEvent({gameId: null});
          gameEvent.load(doc);
          console.log('found by hash', gameEvent);
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
  if (amount == 1) {
    return newArray;
  }

  for (var i = 0; i < amount; i++) {
    let oldRandom = random;
    newRandom();
    if (random == oldRandom) {
      newRandom();
    }
    if (random == array.length - 1) {
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
      isPlaying: obj.isPlaying,
      duration: obj.duration
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

const updateGameEventsAfterGameEvent = (gameEvent, newLevel) => {
  return new Promise((resolve, reject) => {
    const promise = (item, i, amount) => {
      return updateGameEvent(item);
    };
    console.log('UPDATE LEVEL ', gameEvent, newLevel);

    getGameEventFromGame(gameId = gameEvent.gameId, startId = gameEvent.id + 1).then(gameEvents => {
      gameEvents = gameEvents.map(item => {
        item.level = newLevel;
        return item;
      });
      return promiseFor(promise, gameEvents);
    }).then(gameEvents => {
      console.log('ok1', gameEvents);
      resolve(gameEvents);
    }).catch(err => {
      reject(err);
    });
  });
};
const updateGameEvent = (obj, extra = {}) => {
  return new Promise((resolve, reject) => {
    let {ignore, isActive, only} = extra;
    if (!obj && obj.id)
      reject('No id for gameEvent');

    if (!obj instanceof GameEvent) {
      reject('No instance of gameEvent');
    }

    console.log('update gameEvent', obj, extra);
    obj = obj.json(stringify = false);
    let find = {
      id: obj.id
    };
    if (isActive) {
      find = {
        id: obj.id,
        isActive: isActive
      };
    }

    let change = null;
    let keys = Object.keys(obj);
    if (ignore && ignore.length > 0) {
      change = {};
      for (var i = 0; i < ignore.length; i++) {
        for (var i2 = 0; i2 < keys.length; i2++) {
          let key = keys[i2];
          if (key != ignore[i]) {
            change[key] = obj[key];
          }
        }

      }
    }

    if (only && only.length > 0) {
      change = {};
      for (var i = 0; i < only.length; i++) {
        for (var i2 = 0; i2 < keys.length; i2++) {
          let key = keys[i2];
          if (key == only[i]) {
            change[key] = obj[key];
          }
        }
      }
    }

    console.log(find, change);

    GameEventModel.update(find, change || obj, {
      multi: true
    }, function(err, raw) {
      if (err) {
        reject(err);
      } else {
        console.log(raw);
        resolve(raw);
      }
    });

  });
};

const getGameEvents = (find, canSort = false) => {
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
            if (canSort) {
              return gameEvent.sort('gameDataId', 'timeBetween', 'percentSpeed', 'timePlayed', 'tries', 'isCorrect', 'level');
            } else {
              return gameEvent;
            }

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

const addGameEvent = (gameEvent) => {
  return new Promise((resolve, reject) => {
    try {
      if (!gameEvent instanceof GameEvent) {
        throw new Error('No instance of');
      }
      let gameId = gameEvent.gameId;

      //TODO: make for release 2

    } catch (e) {
      console.log(e);
      reject(e);
    }

  });

};

const updateGameEventsFrom = (previousGameEvent, gameEvents = null) => {
  return new Promise((resolve, reject) => {
    try {
      let game;

      let gameDuration;
      let isFirstTime = true;
      console.log('previous', previousGameEvent, moment().valueOf());
      let startTime = setToMoment(previousGameEvent.finishDate).add('seconds', DELAY);

      let {gameId, finishDate} = previousGameEvent;
      let _previousGameEvent = Object.assign({}, previousGameEvent);
      let gameEvents;
      let gameEvents_amount;

      const promise = (item, i, amount) => {
        return new Promise((resolve, reject) => {
          let gameEvent;
          if (item) {
            gameEvent = new GameEvent({gameId});
            gameEvent.load(item);

            if (_previousGameEvent) {
              if (!isFirstTime) {
                startTime = _previousGameEvent.endDate;
              }

            }
            let data = gameLogic.createData({
              gameDataId: gameEvent.gameDataId,
              level: gameEvent.level,
              startTime,
              startIn: DELAY,
              amount: gameEvents_amount,
              gameDuration
            });
            gameEvent.setData(data);
            gameEvent.calculateTimes()
            _previousGameEvent = gameEvent;
            isFirstTime = false;
            console.log(gameEvent);

            getGameDataById(gameEvent.gameDataId).then(gameData => {
              let ok = updateEventScheduleRule(gameEvent);
              if (ok) {
                return updateGameEvent(gameEvent);
              } else {
                reject('update schedule not correct', gameEvent);
              }

            }).then(doc => {
              resolve(gameEvent);
            }).catch(err => {
              reject(err);
            });

          }
        });
      };

      getGameById(gameId).then((item) => {
        game = item;
        return getGameEvents({gameId: game.id});
      }).then(items => {
        gameEvents_amount = items.length;
        game.duration = game.calcDuration(items, isTimeBetween = false);
        gameDuration = game.calcDuration(items, isTimeBetween = true);
        if (!game.duration || !gameDuration)
          reject('No duration');
        return updateGame(game);
      }).then(ok => {
        if (gameEvents) {
          return gameEvents;
        } else {
          return getGameEventFromGame(gameId, startId = previousGameEvent.id + 1);
        }
      }).then(_gameEvents => {
        return promiseFor(promise, _gameEvents);
      }).then(gameEvents => {
        gameEvents = gameEvents.map(item => {
          return item.json(stringify = false, removeEmpty = true);
        });
        resolve(gameEvents);
      }).catch(err => {
        reject(err);
      });

    } catch (e) {
      console.log(e);
      reject(e);
    }

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
    }, ({running, runned, hash, data}) => {
      return new Promise((resolve, reject) => {
        console.log('RUNNING_END', running, ' hash: ', hash);
        endGameEvent(gameData, data.gameEvent).then(ok => {
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
    }, ({running, runned, hash, data}) => {
      return new Promise((resolve, reject) => {
        console.log('RUNNING_START', running, ' hash: ', hash);
        startGameEvent(gameData, data.gameEvent).then(ok => {
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
        return updateGameEvent(gameEvent, {ignore: ['level']});
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
    okUpdate = scheduleJob.updateRule(gameEvent.jobHashStart, gameEvent.activateDate, {gameEvent});
  } else {
    console.log('jobhash start not filled in', gameEvent);
    okUpdate = false;
  }

  if (gameEvent.jobHashEnd && gameEvent.endDate) {
    okUpdate = scheduleJob.updateRule(gameEvent.jobHashEnd, gameEvent.endDate, {gameEvent});
  } else {
    console.log('jobhash end not filled in', gameEvent);
    okUpdate = false;
  }
  return okUpdate;

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
        let letters = inputData.letters;
        let alienName;
        name = name.toString().toLowerCase();

        if (inputData == name || inputData.indexOf('name') != -1) {
          if (isLetter) {
            getGameById(gameEvent.gameId).then(game => {
              alienName = game.alienName;
              return randomLetterFrom(alienName, letters);
            }).then(letter => {
              console.log('random letter', letter, alienName, letters);
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

      console.log('finish form hash', inputData, gameEvent);

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
          gameEvent.setFinish(parseFloat(inputData.finishDate));
          console.log(gameEvent);
          return endGameEvent(gameData, gameEvent, recalculate = true);
        } else {
          updateGameEvent(gameEvent, {ignore: ['level']}).then(() => {
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

      updateGameEvent(gameEvent, {
        ignore: ['level'],
        only: ['jobHashStart', 'jobHashEnd']
      }).then(obj => {
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
        console.log('no finishdate', gameEvent);
        gameEvent.setFinish(gameEvent.endDate);

      }
      gameEvent.calculateTimes();

      updateGameEvent(gameEvent, {ignore: ['level']}).then(obj => {
        return getGameEventByIsActive(true, gameEvent.gameId);
      }).then(data => {
        const amount = data.length;
        io.emit(socketNames.EVENT_END, {
          gameData: gameData.json(false, true, false),
          gameEvent: gameEvent.json(false, true, false),
          activeEvents: amount
        });

        //recalculate levels of timePercent, timePlayed
        // percentspeed: 0.25=> maar een 1/4 nodig gehad om te spelen
        let newLevel = parseFloat(gameEvent.level);

        //if (gameEvent.percentSpeed < 0.4) {
        console.log('percentspeed', gameEvent.percentSpeed);
        if (gameEvent.percentSpeed < 0.4) {
          //kleiner==sneller
          newLevel++;
          recalculate = true;
          return updateGameEventsAfterGameEvent(gameEvent, newLevel);
        } else if (gameEvent.percentSpeed > 0.6) {
          newLevel--;
          recalculate = true;
          return updateGameEventsAfterGameEvent(gameEvent, newLevel);
        } else {
          return Promise.resolve(true);
        }

        //return Promise.resolve(true);
      }).then(ok => {
        if (recalculate) {
          return updateGameEventsFrom(gameEvent);
        } else {
          resolve({runned: true});
        }
      }).then(obj => {
        console.log(obj);
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
  gameDuration,
  types = {}
}) => {
  return new Promise((resolve, reject) => {
    try {
      let promise,
        game,
        gameEvents;
      if (!gameId && !gameName) {
        reject('Gameid, gamename not filled in');
      }
      let _previousGameEvent;
      promise = (gameData, i, amount) => {
        return new Promise((resolve, reject) => {
          if (gameData) {
            const gameEvent = new GameEvent({gameId});
            if (_previousGameEvent) {
              startTime = _previousGameEvent.endDate;
            }

            let data = gameLogic.createData({
              gameDataId: gameData.id,
              level,
              startTime,
              startIn,
              maxTime: gameData.data.maxTime,
              amount,
              gameDuration
            });
            gameEvent.setData(data);
            _previousGameEvent = gameEvent;
            resolve(gameEvent);
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
          amount: 1
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
          amount: 3
        },
        'light': {
          amount: 0
        },
        'scan': {
          amount: 0
        },
        'sound': {
          amount: 0
        }
      };

      getGameById(gameId).then(item => {
        game = item;
        return getGameDataFromGameName(gameName, types);
      }).then(gameDatas => {
        return promiseFor(promise, gameDatas);
      }).then((items) => {
        gameEvents = items;
        game.duration = game.calcDuration(gameEvents, isTotal = true);
        if (!game.duration)
          throw new Error('No duration');
        return updateGame(game);
      }).then(ok => {
        gameEvents = gameEvents.map(item => {
          return item.json(stringify = false, removeEmpty = true);
        });
        resolve(gameEvents);
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
