/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-11-08T16:04:53+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-28T17:49:47+01:00
 * @License: stijnvanhulle.be
 */

const url = require('./lib/url');
const moment = require('moment');
const {Game, GameEvent} = require('../../models');
const {promiseFor} = require('../../lib/functions');

module.exports = [
  {
    method: `POST`,
    path: url.GAME_CREATE,
    config: {
      auth: false
    },
    handler: function(request, reply) {
      const {gameController} = require('../../controllers');
      try {
        let {players, teamName} = request.payload;
        //players = JSON.parse(players);
        const game = new Game(teamName, players);

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
    method: `POST`,
    path: url.GAME_CANCEL,
    config: {
      auth: false
    },
    handler: function(request, reply) {
      const {gameController} = require('../../controllers');
      try {
        let {players, teamName} = request.payload;
        //players = JSON.parse(players);
        const game = new Game(teamName, players);

        gameController.cancelJobs().then((doc) => {
          reply(true);
        }).catch(err => {
          throw new Error(err);
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
      auth: false
    },
    handler: function(request, reply) {
      const {gameController} = require('../../controllers');
      try {
        let gameId = request.params.id;
        const game = new Game();
        let eventType;

        gameController.getGameById(gameId).then((doc) => {
          game.load(doc);
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
    method: `POST`,
    path: url.GAME_DATA,
    config: {
      auth: false
    },
    handler: function(request, reply) {
      const {gameController} = require('../../controllers');
      try {
        let {gameName, level, startTime, startIn} = request.payload;
        let gameId = request.params.id;

        gameController.createGameData({gameId, gameName, startTime, startIn, level}).then(gameEvents => {
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
    path: url.GAME_UPDATE,
    config: {
      auth: false
    },
    handler: function(request, reply) {
      const {gameController} = require('../../controllers');
      try {

        let {data} = request.payload;
        gameController.updateGameData(datadata).then((item) => {
          reply(item);
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
    path: url.GAME_ADD,
    config: {
      auth: false
    },
    handler: function(request, reply) {
      const {gameController} = require('../../controllers');
      try {
        let {data} = request.payload;
        //data = JSON.parse(data);

        const promise = (item, i) => {
          return new Promise((resolve, reject) => {
            if (item) {
              const gameEvent = new GameEvent({gameId: request.params.id});
              gameController.getGameDataById(item.gameDataId, i).then(gameData => {
                gameEvent.setGameData({gameDataId: gameData.id, isActive: item.isActive, activateDate: item.activateDate, endDate: item.endDate});
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
        let {gameDataId, isActive, activateDate, endDate} = request.payload;
        const gameEvent = new GameEvent({gameId: request.params.id});
        gameController.getGameDataById(gameDataId).then(gameData => {
          gameEvent.setGameData({gameDataId: gameData.id, isActive, activateDate, endDate});
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

  }
];
