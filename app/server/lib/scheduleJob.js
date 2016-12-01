/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-29T11:59:30+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-01T21:44:04+01:00
* @License: stijnvanhulle.be
*/
const {setTomoment} = require('./functions');
const schedule = require('node-schedule');
const Chance = require('chance');
const c = new Chance();

const cancelAll = function() {
  for (var i = 0; i < schedule.scheduledJobs.length; i++) {
    schedule.scheduledJobs[i].cancel();
  }
  if (schedule.scheduledJobs && schedule.scheduledJobs.length > 0) {
    console.log('Jobs actief: ' + schedule.scheduledJobs.length);
  } else {
    console.log('Geen jobs actief');
  }

};

const cancel = function(hash) {
  for (var i = 0; i < schedule.scheduledJobs.length; i++) {
    if (schedule.scheduledJobs[i].hash == hash) {
      schedule.scheduledJobs[i].cancel();
    }
  }
  if (schedule.scheduledJobs && schedule.scheduledJobs.length > 0) {
    console.log('Jobs actief: ' + schedule.scheduledJobs.length);
  } else {
    console.log('Geen jobs actief');
  }

};
const addRule = (m, data, f) => {
  return new Promise(function(resolve, reject) {
    try {
      if (m == null) {
        reject('Not everthing filled in');
        return;
      }

      cancelAll();
      m = setTomoment(m);

      var date = m.toDate();
      var hash = c.hash({length: 15});
      console.log('New job will start on ' + date + ', hash: ' + hash);

      const job = schedule.scheduleJob(hash, date, () => {
        let result = {
          running: true,
          runned: false,
          hash
        };

        if (f && f instanceof Function) {
          f(result).then(function(result) {
            job.cancel();
            result.running = false;
            result.runned = true;
            resolve(result);
          }).catch(function(err) {
            console.log(err);
            job.cancel();
            reject(err);
          });
        } else {
          job.cancel();
          result.running = false;
          result.runned = true;
          resolve(result);
        }

      });
    } catch (e) {
      console.log(e);
    }

  });
};
module.exports.addRule = addRule;
module.exports.cancelAll = cancelAll;
module.exports.cancel = cancel;
