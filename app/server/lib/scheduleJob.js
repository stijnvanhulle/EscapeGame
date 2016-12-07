/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-29T11:59:30+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-07T18:18:08+01:00
* @License: stijnvanhulle.be
*/
const {setTomoment} = require('./functions');
const schedule = require('node-schedule');
const Chance = require('chance');
const c = new Chance();

const cancelAll = function() {
  const jobs = schedule.scheduledJobs;
  let hashes = Object.keys(jobs);
  for (var i = 0; i < hashes.length; i++) {
    let hash = hashes[i];
    let job = jobs[hash];
    job.cancel();
  }

  log();
};
const log = () => {
  const jobs = schedule.scheduledJobs;
  let hashes = Object.keys(jobs);

  if (hashes && hashes.length > 0) {
    console.log('Jobs actief: ' + hashes.length);
  } else {
    console.log('Geen jobs actief');
  }
};
const cancel = function(jobHash) {
  let success;
  for (var i = 0; i < schedule.scheduledJobs.length; i++) {
    let job = schedule.scheduledJobs[i];
    if (hash == jobHash) {
      success = schedule.cancelJob(job.hash);
    }
  }

  log();
  return success;
};
const endJob = function(jobHash) {
  let success;
  const jobs = schedule.scheduledJobs;
  let hashes = Object.keys(jobs);

  for (var i = 0; i < hashes.length; i++) {
    let hash = hashes[i];
    let job = jobs[hash];

    if (hash == jobHash) {
      job.emit('run', true);
      success = true;
    }
  }

  log();
  return success;
};
const finishJob = (jobHash) => {
  let success;
  const jobs = schedule.scheduledJobs;
  let hashes = Object.keys(jobs);

  for (var i = 0; i < hashes.length; i++) {
    let hash = hashes[i];
    let job = jobs[hash];
    if (job.hash == jobHash) {
      job.emit('end', true);
      success = true;
      break;
    }
  }
  log();
  return success;
};
const finishNextJob = (jobHash) => {
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
  return finishJob(nextJobHash);
};
const addRule = (m, data, f) => {
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
        console.log('New job is done on ' + date + ', hash: ' + hash);
      });
      job.on('end', () => {
        console.log(true);
        job.emit('run', true);
        const {gameData, gameEvent} = data;
        const gameController = require('../controllers/gameController');

        gameController.endGameEvent(gameData, gameEvent).then(({runned}) => {
          console.log('RUNNED', runned, ' hash: ', hash);
        }).catch(err => {
          console.log(err);
        });
        console.log('New job is ended on ' + date + ', hash: ' + hash);
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
