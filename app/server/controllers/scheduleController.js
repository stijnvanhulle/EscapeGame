const DELAY = 5; //delay needed for delay of api calls clien<=>server

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
const {
  promiseFor,
  setToMoment,
  isBool,
  convertToBool,
  randomLetterFrom,
  sort,
  checkExtra,
  getRandomType
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

const addEventScheduleRule = (gameData, gameEvent) => {
  return new Promise((resolve, reject) => {
    try {
      const {gameController} = require('../controllers');

      if (!gameEvent.isActive)
        throw new Error('GameEvent not active');

      timeoutStartScheduleRule(gameData, gameEvent).then(job => {
        if (job && job.name) {
          gameEvent.setJobHashStart(job.name);
          return timeoutEndScheduleRule(gameData, gameEvent);
        } else {
          throw new Error('no job or hash', job);
        }

      }).then(job => {
        if (job && job.name) {
          gameEvent.setJobHashEnd(job.name);
          return gameController.updateGameEvent({
            id: gameEvent.id
          }, gameEvent, {ignore: ['level']});
        } else {
          throw new Error('no job or hash', job);
        }
      }).then(data => {
        resolve(data);
      }).catch(e => {
        throw new Error(e);
      });
    } catch (e) {
      reject(e);
    }

  });
};

const timeoutStartScheduleRule = (gameData, gameEvent) => {
  return new Promise((resolve, reject) => {
    try {
      if (!gameEvent.activateDate)
        throw new Error('No data seconds found in gameData');
      const activateDate = setToMoment(gameEvent.activateDate);
      if (!activateDate)
        throw new Error('Cannot convert activateDate to moment object');

      let job = scheduleJob.addRule(activateDate, {
        gameData,
        gameEvent
      }, ({running, runned, hash, data}) => {
        return new Promise((resolve, reject) => {
          console.log('RUNNING_START', running, ' hash: ', hash);
          startGameEvent(gameData, data.gameEvent).then(ok => {
            resolve(runned);
          }).catch(e => {
            throw new Error(e);
          });

        });
      });

      resolve(job);
    } catch (e) {
      reject(e);
    }

  });
};

const timeoutEndScheduleRule = (gameData, gameEvent) => {
  return new Promise((resolve, reject) => {
    try {
      if (!gameEvent.endDate)
        throw new Error('No data seconds found in gameData');
      const endDate = setToMoment(gameEvent.endDate);
      if (!endDate)
        throw new Error('Cannot convert endDate to moment object');

      let job = scheduleJob.addRule(endDate, {
        gameData,
        gameEvent
      }, ({running, runned, hash, data}) => {
        return new Promise((resolve, reject) => {
          console.log('RUNNING_END', running, ' hash: ', hash);
          endGameEvent(gameData, data.gameEvent).then(ok => {
            resolve(runned);
          }).catch(e => {
            throw new Error(e);
          });
        });
      });

      resolve(job);
    } catch (e) {
      reject(e);
    }

  });
};

const startGameEvent = (gameData, gameEvent, recalculate = false) => {
  return new Promise((resolve, reject) => {
    try {
      const {gameController} = require('../controllers');

      gameEvent.calculateTimes();
      gameEvent.setJobHashStart(null);

      gameController.updateGameEvent({
        id: gameEvent.id
      }, gameEvent, {
        ignore: ['level'],
        only: ['jobHashStart', 'jobHashEnd']
      }).then(obj => {
        return gameController.getGameEvent({isActive: true, gameId: gameEvent.gameId});
      }).then(data => {
        const amount = data.length;
        io.sockets.emit(socketNames.EVENT_START, {
          gameData: gameData.json(false, true, false),
          gameEvent: gameEvent.json(false, true, false),
          activeEvents: amount
        });
        resolve({runned: true});
      }).catch((e) => {
        throw new Error(e);
      });

    } catch (e) {
      reject(e);
    }

  });

};
const endGameEvent = (gameData, gameEvent, recalculate = false) => {
  return new Promise((resolve, reject) => {
    try {
      const {gameController} = require('../controllers');

      gameEvent.setInactive();
      gameEvent.setJobHashEnd(null);

      if (!gameEvent.finishDate) {
        console.log('no finishdate', gameEvent);
        gameEvent.setFinish(gameEvent.endDate);

      }
      gameEvent.calculateTimes();

      gameController.updateGameEvent({
        id: gameEvent.id
      }, gameEvent, {ignore: ['level']}).then(obj => {
        return gameController.getGameEvents({isActive: true, gameId: gameEvent.gameId});
      }).then(data => {
        const amount = data.length;
        io.sockets.emit(socketNames.EVENT_END, {
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

          return gameController.updateGameEventsAfterGameEvent(gameEvent, newLevel);
        } else if (gameEvent.percentSpeed > 0.6) {
          newLevel--;
          recalculate = true;
          return gameController.updateGameEventsAfterGameEvent(gameEvent, newLevel);
        } else {
          return true;
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
      }).catch((e) => {
        throw new Error(e);
      });

    } catch (e) {
      reject(e);
    }

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

const updateGameEventsFrom = (previousGameEvent, gameEvents = null) => {
  return new Promise((resolve, reject) => {
    try {
      const {gameController} = require('../controllers');

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

          if (item) {
            let gameEvent = new GameEvent();

            gameController.getGameData({id: item.gameDataId}).then(gameData => {
              gameEvent.load(item);
              if (_previousGameEvent) {
                if (!isFirstTime) {
                  startTime = _previousGameEvent.endDate;
                }

              }
              console.log('max', gameData.data.data.maxTime, startTime, _previousGameEvent);
              let data = gameLogic.createData({
                gameDataId: gameEvent.gameDataId,
                level: gameEvent.level,
                startTime,
                maxTime: gameData.data.data.maxTime,
                startIn: DELAY,
                timeBetween: null,
                amount: gameEvents_amount,
                gameDuration
              });
              gameEvent.setData(data);
              gameEvent.calculateTimes();
              _previousGameEvent = gameEvent;
              isFirstTime = false;
              console.log('max event', gameEvent);

              let ok = updateEventScheduleRule(gameEvent);
              if (ok) {
                return gameController.updateGameEvent({
                  id: gameEvent.id
                }, gameEvent);
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

      gameController.getGame({id: gameId}).then((item) => {
        game = item;
        return gameController.getGameEvents({gameId: game.id});
      }).then(items => {
        gameEvents_amount = items.length;
        game.duration = game.calcDuration(items, isTimeBetween = false);
        gameDuration = game.calcDuration(items, isTimeBetween = true);
        if (!game.duration || !gameDuration)
          reject('No duration');
        return gameController.updateGame({
          id: game.id
        }, game);
      }).then(ok => {
        if (gameEvents) {
          return gameEvents;
        } else {
          return gameController.getGameEvents({gameId: gameId, isActive: true, finishDate: null});
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

const isAnswerCorrect = (inputData, gameData, gameEvent) => {
  return new Promise((resolve, reject) => {
    try {
      const {gameController} = require('../controllers');

      const data = gameData.data.data;
      const isLetter = data.isLetter;
      const answer = data.answer;
      const isFinish = gameData.data.type == "finish";
      const fromAnswerData = gameData.data.fromAnswerData;

      console.log('INPUTDATA', inputData);
      if (inputData.input) {
        inputData.input = inputData.input.toString().toLowerCase();
      }

      if (answer) {
        let {value, data: answerData} = answer;

        let letters = inputData.letters;
        let alienName;
        value = value.toString().toLowerCase();
        //TODO: CHECK OF WORKING BECAUSE END==FINISHDATE
        let checkBool = (d, v) => {
          if (isBool(d) && isBool(d)) {
            return convertToBool(d) == convertToBool(v);
          } else {
            return false;
          }
        };

        if (inputData.input == value || checkBool(inputData.input, value) || inputData.input.indexOf(value) != -1) {
          if (isLetter) {
            gameController.getGame({id: gameEvent.gameId}).then(game => {
              alienName = game.alienName.toLowerCase();
              return randomLetterFrom(alienName, letters);
            }).then(letter => {
              console.log('random letter', letter, alienName, letters);
              resolve({
                data: {
                  answerData,
                  letter
                },
                correct: true
              });

            }).catch(e => {
              throw new Error(e);
            });
          } else {
            resolve({data: null, correct: true});
          }

        } else {
          resolve({data: null, correct: false});
        }

      } else {
        //old check for bom
        /*if (isBool(inputData.input) && convertToBool(inputData.input) === true) {
          resolve({data: null, correct: true});
        } else {
          resolve({data: null, correct: false});
        }*/
        //TODO: check of it is working
        if (isFinish) {
          gameController.getGame({id: gameEvent.gameId}).then(game => {
            let {alienName} = game;
            alienName = alienName.toLowerCase();
            if (inputData.input == alienName || inputData.input.indexOf(alienName) != -1) {
              resolve({data: null, correct: true});
            } else {
              resolve({data: null, correct: false});
            }
          }).catch(e => {
            throw new Error(e);
          });

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
      const {gameController} = require('../controllers');

      let gameEvent;
      let gameData;

      let currentData;
      if (!inputData || !inputData.jobHash) {
        reject('Not all data filled in');
      }

      console.log('finish form hash', inputData);

      gameController.getGameEvent({
        $or: [
          {
            jobHashEnd: inputData.jobHash
          }, {
            jobHashStart: inputData.jobHash
          }
        ]
      }).then(item => {
        gameEvent = item;
        return gameController.getGameData({id: gameEvent.gameDataId});
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

        console.log('answer correct: ', data, correct, triesOver);

        io.sockets.emit(socketNames.EVENT_DATA, {data, inputData, gameEvent, correct, triesOver});

        if ((currentData.retries != null && currentData.maxTries <= gameEvent.tries) || correct || triesOver == 0) {
          //gameEvent.setFinish(parseFloat(inputData.finishDate) || moment().valueOf());
          gameEvent.setFinish(moment().valueOf());
          console.log('Gameevent finish', gameEvent);
          return endGameEvent(gameData, gameEvent, recalculate = true);
        } else {
          return gameController.updateGameEvent({
            id: gameEvent.id
          }, gameEvent, {ignore: ['level']});
        }
      }).then(data => {
        if (data.runned != null) {
          return data;
        } else {
          return {runned: false};
        }
      }).then(data => {
        console.log('data', data);
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
      const {gameController} = require('../controllers');

      let promise,
        game,
        gameEvents;
      if (!gameId && !gameName) {
        throw new Error('Gameid, gamename not filled in');
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
              timeBetween: null,
              maxTime: gameData.data.data.maxTime,
              amount,
              gameDuration
            });
            gameEvent.setData(data);
            _previousGameEvent = gameEvent;

            //start gameventADD
            addGameEvent(gameEvent, i).then(doc => {
              console.log('GAMEVENT', gameEvent);
              gameEvent.load(doc);
              resolve(gameEvent);
            }).catch(err => {
              console.log(err);
              reject(err);
            });
            //end gameventADD
            //resovle(gameEvent);
          } else {
            reject('No item');
          }
        });
      };

      //TODO: CAHNGE TYPES TO NAME SO more types of beacon can be used.
      types = {
        'description': {
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
          amount: 1
        },
        'light': {
          amount: 0
        },
        'scan': {
          amount: 1
        },
        'beacon': {
          amount: 2
        },
        'sound': {
          amount: 0
        },
        'finish': {
          amount: 1
        },
        'anthem': {
          amount: 0
        }
      };
      let eventTypeFinish;

      gameController.getGame({id: gameId}).then(item => {
        game = item;
        let alienName = game.alienName;
        //TODO: change amount for length alienName where letter is true
        //types = calculateTypesFromName(alienName,types);

        return gameController.getEventType({name: 'finish'});
      }).then((item) => {
        eventTypeFinish = item;
        return gameController.getGameDataFromGameName(gameName, types);
      }).then(gameDatas => {

        gameDatas = sort(gameDatas, 'custom', on = 'typeId', extra = {
          where: eventTypeFinish.id
        });
        console.log('gamedatas', gameDatas);
        return promiseFor(promise, gameDatas);
      }).then((items) => {
        gameEvents = items;
        game.duration = game.calcDuration(gameEvents, isTotal = true);
        if (!game.duration)
          throw new Error('No duration');
        return gameController.updateGame({
          id: game.id
        }, game);
      }).then(ok => {
        gameEvents = gameEvents.map(item => {
          return item.json(stringify = false, removeEmpty = true);
        });
        resolve(gameEvents);
      }).catch(e => {
        throw new Error(e);
      })

    } catch (e) {
      console.log(e);
      reject(e);
    }

  });
};

const addGameEvent = (gameEvent, i) => {
  return new Promise((resolve, reject) => {
    try {
      const {gameController} = require('../controllers');

      if (!gameEvent instanceof GameEvent) {
        throw new Error('No instance of');
      }
      let gameData;
      gameController.getGameData({id: gameEvent.gameDataId}).then(_gameData => {
        gameData = _gameData;
        return calculateId(GameEventModel);
      }).then(id => {
        gameEvent.id = id + i;
        return gameEvent.save();
      }).then(doc => {
        gameEvent.load(doc);
        return addEventScheduleRule(gameData, gameEvent);
      }).then(data => {
        resolve(data);
      }).catch(e => {
        throw new Error(e);
      });
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

module.exports = {
  addGameEvent,
  addEventScheduleRule,
  timeoutStartScheduleRule,
  startGameEvent,
  endGameEvent,
  updateEventScheduleRule,
  updateGameEventsFrom,
  isAnswerCorrect,
  finishGameEventFromHash,
  createGameEvents,
  cancelJobs
};
