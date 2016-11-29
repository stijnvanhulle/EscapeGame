/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-28T14:54:43+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-29T11:52:13+01:00
* @License: stijnvanhulle.be
*/
const {calculateId} = require('./lib/functions');

const {Game} = require('../models');
const {Game: GameModel} = require('../models/mongo');
const {GameMember: GameMemberModel} = require('../models/mongo');

module.exports.add = (game) => {
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
    }

  });

};

const promiseFor = (promise, array) => {
  console.log(promise, array);
  return new Promise((resolve, reject) => {
    var fn = function asyncMultiplyBy2(item) { // sample async action
      if (item) {
        return promise(item);
      } else {
        return reject('no item');
      }

    };

    var actions = array.map(fn);
    var results = Promise.all(actions);

    results.then(function(doc) {
      resolve(doc);
    }).catch(function(err) {
      reject(err);
    });
  });
};

module.exports.addPlayers = ({players, id: gameId}) => {
  return new Promise((resolve, reject) => {
    try {
      if (!players instanceof Array) {
        throw new Error('No instance of');
      }
      const promise = (item) => {
        return new Promise((resolve, reject) => {
          if (item) {
            const gameMember = new GameMemberModel({gameId, playerId: item.id});
            console.log(gameMember);

            gameMember.save(function(err, item) {
              if (err) {
                reject(err);
              } else {
                resolve(item);
              }
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
    }

  });

};
