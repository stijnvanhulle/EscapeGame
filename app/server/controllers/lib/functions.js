/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-28T21:42:39+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-06T16:38:57+01:00
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
      reject('No item');
    }
  });
};

module.exports.removeDataFromModel = (...models) => {
  return promiseFor(promise_removeData, models);
};

module.exports.calculateId = (model) => {
  return new Promise((resolve, reject) => {
    try {
      model.findOne({}).sort({'id': -1}).exec(function(err, doc) {
        if (err) {
          reject(err);
        } else {
          let id = 1;
          try {
            if (doc) {
              var _id = doc.id;
              if (_id) {
                id = parseInt(_id) + 1;
              }
            }
          } catch (e) {
            reject(e);
          } finally {
            resolve(id);
          }
        }

      });
    } catch (e) {
      reject(e);
    }

  });
};

module.exports.random = (model) => {
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
