/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-11-08T16:04:53+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-30T23:21:03+01:00
 * @License: stijnvanhulle.be
 */

const url = require('./lib/url');
const moment = require('moment');
const {Game, GameEvent} = require('../../models');

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
        let {players, teamname: teamName} = request.headers;
        players = JSON.parse(players);
        const game = new Game(teamName, players);

        gameController.add(game).then((doc) => {
          return gameController.addPlayers(game);
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

  }, {
    method: `POST`,
    path: url.GAME_START,
    config: {
      auth: false
    },
    handler: function(request, reply) {
      const {gameController} = require('../../controllers');
      try {
        let {} = request.headers;
        const gameEvent = new GameEvent(gameId = request.params.id);
        gameController.getRandomGameData().then(gameData => {
          gameEvent.setGameData({gameDataId: gameData.id, isActive: gameData.isActive, activateDate: gameData.activateDate, endDate: gameData.endDate});
          console.log(gameEvent);
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

  }, {
    method: `POST`,
    path: url.GAME_EVENT,
    config: {
      auth: false
    },
    handler: function(request, reply) {
      const {gameController} = require('../../controllers');
      try {
        let {gamedataid: gameDataId, isactive: isActive, activatedate: activateDate, enddate: endDate} = request.headers;
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
