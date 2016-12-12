/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-29T11:59:30+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-12T12:22:10+01:00
* @License: stijnvanhulle.be
*/
const {setTomoment, promiseFor} = require('./functions');
const fs = require('fs');
const schedule = require('node-schedule');
const {Game, GameEvent, GameData} = require('../models');
const Chance = require('chance');
const c = new Chance();

const cancelAll = function() {
  return new Promise((resolve, reject) => {
    const jobs = schedule.scheduledJobs;
    let hashes = Object.keys(jobs);

    promiseFor(cancel, hashes).then((items) => {
      console.log(items);
      log('CANCEL_ALL');
      resolve(items);
    }).catch(err => {
      log('CANCEL_ALL');
      reject(err);
    });

  });
};
const log = (text = '-') => {
  const jobs = schedule.scheduledJobs;
  const hashes = Object.keys(jobs);

  if (hashes && hashes.length > 0) {
    console.log(text + ' ', 'Jobs actief: ' + hashes.length);
  } else {
    console.log(text + ' ', 'Geen jobs actief');
  }

};
const cancel = function(jobHash) {
  return new Promise((resolve, reject) => {
    try {
      const jobs = schedule.scheduledJobs;
      const hashes = Object.keys(jobs);

      for (var i = 0; i < hashes.length; i++) {
        let hash = hashes[i];
        let job = jobs[hash];
        if (hash == jobHash) {
          let success = job.cancel();

          if (success) {
            resolve({canceled: true, jobHash, error: null});
          } else {
            resolve({canceled: false, jobHash, error: null});
          }
          break;
          //job.cancel();
        }
      }
    } catch (e) {
      console.log(e);
      reject({canceled: false, jobHash, error: e});
    }
  });
};
const endJob = function(jobHash, data = null) {
  let success;
  const jobs = schedule.scheduledJobs;
  let hashes = Object.keys(jobs);

  for (var i = 0; i < hashes.length; i++) {
    let hash = hashes[i];
    let job = jobs[hash];

    if (hash == jobHash) {
      job.emit('run', data);
      success = true;
    }
  }

  log();
  return success;
};
const finishJob = (jobHash, data = {}) => {
  let success;
  const jobs = schedule.scheduledJobs;
  let hashes = Object.keys(jobs);

  for (var i = 0; i < hashes.length; i++) {
    let hash = hashes[i];
    let job = jobs[hash];
    if (job.hash == jobHash) {
      job.emit('end', data);
      success = true;
      break;
    }
  }
  return success;
};
const finishNextJob = (jobHash, data = {}) => {
  var nextJobHash;
  const jobs = schedule.scheduledJobs;
  let hashes = Object.keys(jobs);

  for (var i = 0; i < hashes.length; i++) {
    let hash = hashes[i];
    let job = jobs[hash];
    if (job.hash == jobHash) {
      nextJobHash = hashes[i + 1];
      break;
    }
  }
  data.jobHash = jobHash;
  return finishJob(nextJobHash, data);
};
const addRule = (m, dataRule, f) => {
  return new Promise(function(resolve, reject) {
    try {
      if (m == null) {
        reject('Not everthing filled in');
        return;
      }
      m = setTomoment(m);

      var date = m.toDate();
      var hash = c.hash({length: 15});
      console.log('New job will start on ' + date + ', hash: ' + hash);

      const job = schedule.scheduleJob(hash, date, () => {
        let result = {
          running: true,
          runned: false,
          isCanceled: false,
          hash
        };

        if (f && f instanceof Function) {
          f(result).then(function(result) {
            result.isCanceled = schedule.cancelJob(job);

            result.running = false;
            result.runned = true;
            resolve(result);
          }).catch(function(err) {
            console.log(err);
            job.cancel();
            reject(err);
          });
        } else {
          result.isCanceled = schedule.cancelJob(job);

          result.running = false;
          result.runned = true;
          resolve(result);
        }

      });

      job.on('run', () => {
        job.cancel();
        console.log('New job is done on ' + date + ', hash: ' + hash);
        log();
      });
      job.on('end', (data) => {
        //job.emit('run', true);
        const gameController = require('../controllers/gameController');
        console.log(data);
        gameController.finishGameEventFromHash(data.jobHash, data.finishDate).then(({runned}) => {
          console.log('RUNNED', runned, ' hash: ', hash);
        }).catch(err => {
          console.log(err);
        });
        console.log('New job is ended on ' + date + ', hash: ' + hash);
        job.cancel();
        log();
      });

      log();
    } catch (e) {
      console.log(e);
    }

  });
};
module.exports.addRule = addRule;
module.exports.finishJob = finishJob;
module.exports.endJob = endJob;
module.exports.cancelAll = cancelAll;
module.exports.cancel = cancel;
module.exports.finishNextJob = finishNextJob;
