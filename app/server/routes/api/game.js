/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-11-08T16:04:53+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-10T10:00:28+01:00
 * @License: stijnvanhulle.be
 */

const url = require('./lib/url');
const {io, client} = require('../../lib/app');
const {mqttNames, socketNames} = require('../../lib/const');
const moment = require('moment');
const scheduleJob = require('../../lib/scheduleJob');
const {Game, GameEvent} = require('../../models');
const {promiseFor, convertToCsv} = require('../../lib/functions');

const Chance = require('chance');
const c = new Chance();

module.exports = [
  {
    method: `POST`,
    path: url.GAME,
    config: {
      auth: false
    },
    handler: function(request, reply) {
      const {gameController} = require('../../controllers');
      try {
        let {players, teamName, duration} = request.payload;
        //players = JSON.parse(players);
        const game = new Game(teamName, players, duration);

        gameController.addGame(game).then((doc) => {
          return gameController.addPlayers(game);
        }).then(players => {
          game.players = players;
          reply(game.json(stringify = false, removeEmpty = true));
        }).catch(err => {
          throw new Error(err);
        });
      } catch (e) {
        console.log(e);
        reply(e);
      }

    }

  }, {
    method: `PUT`,
    path: url.GAME_GET,
    config: {
      auth: false
    },
    handler: function(request, reply) {
      const {gameController} = require('../../controllers');
      try {
        let gameId = request.params.id;
        gameId = parseFloat(gameId);

        let data = request.payload;
        const game = new Game();
        game.load(data);

        gameController.updateGame(game).then((doc) => {
          reply(doc);
        }).catch(e => {
          console.log(e);
          throw new Error(e);
        });
      } catch (e) {
        console.log(e);
        reply(e);
      }

    }

  }, {
    method: `GET`,
    path: url.GAME_GET,
    config: {
      auth: 'token'
    },
    handler: function(request, reply) {
      const {gameController} = require('../../controllers');
      try {
        let gameId = request.params.id;
        gameId = parseFloat(gameId);
        let game;
        let eventType;

        gameController.getGameById(gameId).then((item) => {
          game = item;
          return gameController.getEventType('description');
        }).then(item => {
          eventType = item;
          return gameController.getPlayers(game.id);
        }).then(players => {
          game.players = players;
          return gameController.getGameDataByGameName(game.gameName);
        }).then(gameDatas => {
          const description = gameDatas.filter(item => {
            if (item.typeId == eventType.id) {
              return item;
            }
          })[0].data.data.description;
          game.setDescription(description);
          reply(game);
        }).catch(e => {
          console.log(e);
          throw new Error(e);
        });
      } catch (e) {
        console.log(e);
        reply(e);
      }

    }

  }, {
    method: `GET`,
    path: url.GAME_EVENTS,
    config: {
      auth: false
    },
    handler: function(request, reply) {
      const {gameController} = require('../../controllers');
      try {
        let gameId = request.params.id;
        gameId = parseFloat(gameId);
        let find = {
          isActive: false
        };
        if (gameId) {
          find = {
            gameId,
            isActive: false
          };
        }

        gameController.getGameEvents(find).then(gameEvents => {
          reply(gameEvents);
        }).catch(err => {
          throw new Error(err);
        });

      } catch (e) {
        console.log(e);
        reply(e);
      }

    }

  }, {
    method: `POST`,
    path: url.GAME_EVENTS_CSV,
    config: {
      auth: false
    },
    handler: function(request, reply) {
      const {gameController, fileController} = require('../../controllers');
      try {
        let gameId = request.params.id;
        gameId = parseFloat(gameId);

        let find = {
          isActive: false
        };
        if (gameId) {
          find = {
            gameId,
            isActive: false
          };
        }

        gameController.getGameEvents(find, canSort = true).then(gameEvents => {
          if (gameEvents && gameEvents.length > 0) {
            return fileController.save(c.hash({length: 15}) + '.csv', convertToCsv(gameEvents, fields = null));
          } else {
            return null;
          }

        }).then(fileName => {
          reply({fileName: fileName});
        }).catch(err => {
          console.log(err);
          throw new Error(err);
        });

      } catch (e) {
        console.log(e);
        reply(e);
      }

    }

  }, {
    method: `POST`,
    path: url.GAME_EVENTS,
    config: {
      auth: false
    },
    handler: function(request, reply) {
      const {gameController} = require('../../controllers');
      try {
        let {gameName, level, startTime, startIn, gameDuration} = request.payload;
        let gameId = request.params.id;

        gameId = parseFloat(gameId);

        gameController.createGameEvents({
          gameId,
          gameName,
          startTime,
          startIn,
          level,
          gameDuration
        }).then(gameEvents => {
          reply(gameEvents);
        }).catch(err => {
          throw new Error(err);
        });

      } catch (e) {
        console.log(e);
        reply(e);
      }

    }
  }, {
    method: `PUT`,
    path: url.GAME_EVENTS_UPDATE,
    config: {
      auth: false
    },
    handler: function(request, reply) {
      const {gameController} = require('../../controllers');
      try {

        reply({implemented: false});

      } catch (e) {
        console.log(e);
        reply(e);
      }

    }

  }, {
    method: `POST`,
    path: url.GAME_EVENTS_ADD,
    config: {
      auth: false
    },
    handler: function(request, reply) {
      const {gameController} = require('../../controllers');
      try {
        let {data} = request.payload;
        let gameId = request.params.id;
        gameId = parseFloat(gameId);
        //data = JSON.parse(data);

        const promise = (item, i) => {
          return new Promise((resolve, reject) => {
            if (item) {
              const gameEvent = new GameEvent({gameId});
              gameController.getGameDataById(item.gameDataId, i).then(gameData => {
                gameEvent.setData({gameDataId: gameData.id, isActive: item.isActive, activateDate: item.activateDate, endDate: item.endDate, level: item.level});
                return gameController.addEvent(gameEvent, i);
              }).then(doc => {
                gameEvent.load(doc);
                resolve(gameEvent.json(stringify = false, removeEmpty = true));
              }).catch(err => {
                console.log(err);
                reject(err);
              });
            }

          });
        };
        promiseFor(promise, data).then((item) => {
          reply(item);
        }).catch(err => {
          console.log(err);
          throw new Error(err);
        });

      } catch (e) {
        console.log(e);
        reply(e);
      }

    }

  }, {
    method: `POST`,
    path: url.GAME_EVENT,
    config: {
      auth: false
    },
    handler: function(request, reply) {
      const {gameController} = require('../../controllers');
      try {
        let gameId = request.params.id;
        gameId = parseFloat(gameId);

        let {gameDataId, isActive, activateDate, endDate} = request.payload;
        const gameEvent = new GameEvent({gameId});
        gameController.getGameDataById(gameDataId).then(gameData => {
          gameEvent.setData({gameDataId: gameData.id, isActive, activateDate, endDate});
          return gameController.addEvent(gameEvent);
        }).then(doc => {
          reply(doc);
        }).catch(err => {
          throw new Error(err);
        });
      } catch (e) {
        console.log(e);
        reply(e);
      }

    }

  }, {
    method: `POST`,
    path: url.GAME_EVENTS_RECAL,
    config: {
      auth: false
    },
    handler: function(request, reply) {
      const {gameController} = require('../../controllers');
      try {

        let gameId = request.params.id;
        gameId = parseFloat(gameId);

        gameController.getGameEvents({
          gameId
        }, canSort = true).then(gameEvents => {
          io.sockets.emit(socketNames.RECALCULATE_START, gameEvents);
          reply(gameEvents);
        }).catch(err => {
          throw new Error(err);
        });
      } catch (e) {
        console.log(e);
        reply(e);
      }

    }

  }
];
