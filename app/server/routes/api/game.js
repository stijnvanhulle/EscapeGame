/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-11-08T16:04:53+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-05T17:17:16+01:00
 * @License: stijnvanhulle.be
 */

const url = require('./lib/url');
const moment = require('moment');
const {Game, GameEvent} = require('../../models');
const {promiseFor} = require('../../lib/functions');

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
        let {players, teamName} = request.payload;
        //players = JSON.parse(players);
        const game = new Game(teamName, players);

        gameController.add(game).then((doc) => {
          game.id = doc.id;
          game.date = doc.id;

          return gameController.addPlayers(game);
        }).then(players => {
          game.players = players;
          reply(game.json(stringify = false, removeEmpty = true));
        }).catch(err => {
          console.log(err);
          reply(err);
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

        gameController.get(gameId).then((doc) => {
          game.load(doc);
          reply(doc);
        }).catch(err => {
          console.log(err);
          reply(err);
        });
      } catch (e) {
        console.log(e);
        reply(e);
      }

    }

  }, {
    method: `POST`,
    path: url.GAME_CREATE,
    config: {
      auth: false
    },
    handler: function(request, reply) {
      const {gameController} = require('../../controllers');
      try {
        let {gameName, level, startTime} = request.payload;
        let gameId = request.params.id;

        gameController.createGameData(gameId, gameName, startTime, level).then(gameEvents => {
          console.log(gameEvents);
          reply(gameEvents);
        }).catch(err => {
          reply(err);
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
        data = JSON.parse(data);

        const promise = (item) => {
          return new Promise((resolve, reject) => {
            if (item) {
              const gameEvent = new GameEvent(gameId = request.params.id);
              console.log(gameEvent);
              gameController.getGameData(item.gameDataId).then(gameData => {
                gameEvent.setGameData({gameDataId: gameData.id, isActive: item.isActive, activateDate: item.activateDate, endDate: item.endDate});
                return gameController.updateEvent(gameEvent);
              }).then(doc => {
                resolve(doc);
              }).catch(err => {
                reject(err);
              });
            }

          });
        };

        gameController.cancelJobs().then(({runned}) => {
          console.log(runned);
          return promiseFor(promise, data);

        }).then((item) => {
          reply(item);
        }).catch(err => {
          reply(err);
        });

      } catch (e) {
        console.log(e);
        reply(e);
      }

    }

  }, {
    method: `POST`,
    path: url.GAME_START,
    config: {
      auth: false
    },
    handler: function(request, reply) {
      const {gameController} = require('../../controllers');
      try {
        let {data} = request.payload;
        data = JSON.parse(data);

        const promise = (item) => {
          return new Promise((resolve, reject) => {
            if (item) {
              const gameEvent = new GameEvent(gameId = request.params.id);
              gameController.getGameData(item.gameDataId).then(gameData => {
                gameEvent.setGameData({gameDataId: gameData.id, isActive: item.isActive, activateDate: item.activateDate, endDate: item.endDate});
                console.log(gameEvent);
                return gameController.addEvent(gameEvent);
              }).then(doc => {
                resolve(doc);
              }).catch(err => {
                reject(err);
              });
            }

          });
        };
        promiseFor(promise, data).then((item) => {
          reply(item);
        }).catch(err => {
          reply(err);
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
        const gameEvent = new GameEvent(gameId = request.params.id);
        gameController.getGameData(gameDataId).then(gameData => {
          console.log(gameData);
          gameEvent.setGameData({gameDataId: gameData.id, isActive, activateDate, endDate});
          return gameController.addEvent(gameEvent);
        }).then(doc => {
          reply(doc);
        }).catch(err => {
          console.log(err);
          reply(err);
        });
      } catch (e) {
        console.log(e);
        reply(e);
      }

    }

  }
];
