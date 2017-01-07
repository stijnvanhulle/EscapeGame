/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-11-08T17:36:33+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-06T20:50:41+01:00
 * @License: stijnvanhulle.be
 */
const mongoose = require("mongoose");
const {Member: MemberModel, GameData: GameDataModel, EventType: EventTypeModel, GameEvent: GameEventModel} = require('../models/mongo');
const {Member, GameData, EventType} = require('../models');
const {calculateId, removeDataFromModel} = require('../controllers/lib/functions');
const gameDatas = require("../../private/gameData.json");
const eventTypes = require("../../private/eventType.json");

const {promiseFor} = require('../lib/functions');

const getEventType = (name) => {
  return new Promise((resolve, reject) => {
    if (name) {
      name = name.toLowerCase();
      EventTypeModel.findOne({name: name}).exec(function(err, eventType) {
        if (err) {
          reject(err);
        } else {
          resolve(eventType);
        }
      });

    } else {
      reject('No item');
    }
  });
};

const promise_gameData = (item, i) => {
  return new Promise((resolve, reject) => {
    if (item) {
      let type = item.type;
      if (!type)
        reject('No type of gameData');

      getEventType(type).then((eventType) => {
        if (eventType) {
          let newGameData = new GameData(gameName = 'alien', item, eventType.id);
          calculateId(GameDataModel).then(id => {
            newGameData.id = id + i;
            newGameData.save().then(doc => {
              resolve(doc);
            }).catch(err => {
              reject(err);
            });
          });
        } else {
          reject('No eventType');
        }

      }).catch(err => {
        reject(err);
      });

    } else {
      reject('No item');
    }
  });
};

const promise_eventType = (item, i) => {
  return new Promise((resolve, reject) => {
    if (item) {
      let newEventType = new EventType(item.name);
      calculateId(EventTypeModel).then(id => {
        newEventType.id = id + i;
        newEventType.save().then(doc => {
          resolve(doc);
        }).catch(err => {
          reject(err);
        });
      });

    } else {
      reject('No item');
    }
  });
};

const loadDefaults = () => {
  removeDataFromModel(MemberModel, GameDataModel, EventTypeModel).then((data) => {
    return promiseFor(promise_eventType, eventTypes);
  }).then((item) => {
    console.log('Gametypes added');
    return promiseFor(promise_gameData, gameDatas);
  }).then((item) => {
    console.log('GameData added');
  }).catch(err => {
    console.log(err);
  });
  let newMember = new MemberModel({email: 'stijn.vanhulle@outlook.com', password: 'stijn', firstName: 'Stijn', lastName: 'Van Hulle'});
  newMember.save(function(err, item) {
    if (err)
      console.log(err);
    }
  );

};

module.exports.register = (server, options, next) => {
  var db = mongoose.connection;
  db.on('error', (err) => {
    console.log(err);
    next(err);
  });
  db.once('open', () => {
    console.log('Mongo connected');
    loadDefaults();
    next();
  });

};

module.exports.register.attributes = {
  name: `mongo`,
  version: `0.1.0`
};
