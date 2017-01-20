/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-28T14:54:43+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-29T16:17:46+01:00
* @License: stijnvanhulle.be
*/
const {calculateId} = require('./lib/functions');
const {promiseFor, setToMoment, isBool, convertToBool} = require('../lib/functions');
const {Player, GamePlayer} = require('../models');
const {GamePlayer: GamePlayerModel, Player: PlayerModel} = require('../models/mongo');

const add = (player) => {
  return new Promise((resolve, reject) => {
    try {
      if (!player instanceof Player) {
        reject('No instance of');
      }

      calculateId(PlayerModel).then(id => {
        player.id = id;
        return player.save();
      }).then((doc) => {
        resolve(doc);
      }).catch(e => {
        reject(e);
      });
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
        reject('Gameid not set');
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

        GamePlayerModel.find({gameId: gameId}).exec(function(e, docs) {
          if (e) {
            reject(e);
          } else {
            let gamePlayers = docs.map((item) => {
              let gamePlayer = new GamePlayer();
              gamePlayer.load(item);
              return gamePlayer;
            });

            promiseFor(promise, gamePlayers).then((item) => {
              resolve(item);
            }).catch(e => {
              reject(e);
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

const addPlayers = ({players, id: gameId}) => {
  return new Promise((resolve, reject) => {
    try {
      if (!players instanceof Array) {
        reject('No instance of');
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
      }).catch(e => {
        reject(e);
      });

      //save players
    } catch (e) {
      console.log(e);
      reject(e);
    }

  });

};

module.exports = {
  addPlayers,
  add,
  getPlayers
}
