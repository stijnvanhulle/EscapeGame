/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-28T21:42:39+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-13T15:05:50+01:00
* @License: stijnvanhulle.be
*/
const {promiseFor} = require('../../lib/functions');

const promise_removeData = (item) => {
  return new Promise((resolve, reject) => {
    if (item) {
      item.remove({}, function(err, ok) {
        if (err) {
          reject(err);
        } else {
          resolve(ok);
        }
      });
    } else {
      const e = new Error("No item find");
      reject(e);
    }
  });
};

const calculateTypesFromName = (name, types) => {
  if (name && types) {
    const newRandom = (arr) => {
      return Math.floor((Math.random() * arr.length - 1) + 1);
    };

    const nameLength = name.replace(' ', '').length;
    const typeKeys = Object.keys(types);
    let amount = 0;
    for (var i = 0; i < typeKeys.length; i++) {
      let typeKey = types[typeKeys[i]];
      amount = amount + typeKey.amount;
    }
    while (nameLength > amount) {
      let random = newRandom(typeKeys);
      let amountType = types[typeKeys[random]].amount;
      if (types[typeKeys[random]].canAdd && types[typeKeys[random]].amount>0) {
        types[typeKeys[random]].amount = amountType + 1;
        amount++;
      }

    }
    return types;

  } else {
    return null;
  }
};

const checkExtra = (gameEvent, extra) => {
  try {
    let {ignore, isActive, only} = extra;
    let change = null;
    let keys = Object.keys(gameEvent);
    if (ignore && ignore.length > 0) {
      change = {};
      for (var i = 0; i < ignore.length; i++) {
        for (var i2 = 0; i2 < keys.length; i2++) {
          let key = keys[i2];
          if (key != ignore[i]) {
            change[key] = gameEvent[key];
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
            change[key] = gameEvent[key];
          }
        }
      }
    }
    return change;
  } catch (e) {
    console.log(e);
    return null
  }

};

const removeDataFromModel = (...models) => {
  return promiseFor(promise_removeData, models);
};

const getRandomType = (array, item, amount) => {
  let newArray = [...array];
  let random;
  const newRandom = () => {
    random = Math.floor((Math.random() * array.length) + 1);
  };

  try {
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

  } catch (e) {
    console.log(e);
  } finally {
    return newArray;
  }
};

const calculateId = (model) => {
  return new Promise((resolve, reject) => {
    try {
      model.findOne({}).sort({'id': -1}).exec(function(err, doc) {
        if (err) {
          reject(err);
        } else {
          let id = 1;
          if (doc && doc.id) {
            id = parseInt(doc.id) + 1;
          }
          resolve(id);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
};
const sortByStartFinish = (arr, eventTypeStart,eventTypeFinish) => {
  let newGameDatas = [];
  let lastItem;
  for (var i = 0; i < arr.length; i++) {
    let item = arr[i];

    if (newGameDatas.length > 0) {
      if (item.typeId == eventTypeFinish.id) {
        lastItem = item;
      } else {
        newGameDatas.push(item);
      }

    } else {
      if (item.typeId == eventTypeStart.id) {
        newGameDatas.push(item);
        i = 0;
      }
    }
  }
  newGameDatas.push(lastItem);
  return newGameDatas;
};
const random = (model) => {
  return new Promise((resolve, reject) => {
    try {
      model.findOne({
        data: {
          $exists: true
        },
        id: {
          $exists: true
        }
      }).sort({'id': -1}).exec(function(err, doc) {
        if (err) {
          reject(err);
        } else {
          let random,
            id;
          try {
            if (doc) {
              var _id = doc.id;
              if (_id) {
                id = parseInt(_id);
              }
              random = Math.floor((Math.random() * id) + 1);
            }
          } catch (e) {
            reject(e);
          } finally {
            if (id) {
              resolve(random);
            } else {
              reject('No id found for random');
            }
          }
        }

      });
    } catch (e) {
      reject(e);
    }

  });
};

module.exports = {
  sortByStartFinish,
  removeDataFromModel,
  calculateId,
  random,
  getRandomType,
  checkExtra,
  calculateTypesFromName
};
