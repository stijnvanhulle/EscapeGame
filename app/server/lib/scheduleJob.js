/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-29T11:59:30+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-04T21:17:50+01:00
* @License: stijnvanhulle.be
*/
const {setTomoment, promiseFor} = require('./functions');
const fs = require('fs');
const moment = require('moment');
const schedule = require('node-schedule');
const {Game, GameEvent, GameData} = require('../models');
const Chance = require('chance');
const c = new Chance();

schedule.Job.prototype.setData = function(data) {
  this.data = data;
};
schedule.Job.prototype.getData = function() {
  return this.data;
};

const cancelAll = function() {
  return new Promise((resolve, reject) => {
    const jobs = schedule.scheduledJobs;
    let hashes = Object.keys(jobs);

    promiseFor(cancel, hashes).then((items) => {
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
  let job = getJob(jobHash)
  if (job) {
    job.emit('run', data);
    return true;
  } else {
    console.log('job not found', jobHash);
    return false;
  }

};
const getJob = (jobHash) => {
  const jobs = schedule.scheduledJobs;
  let hashes = Object.keys(jobs);

  for (var i = 0; i < hashes.length; i++) {
    let hash = hashes[i];
    let job = jobs[hash];
    if (job.name == jobHash) {
      return job;
    }
  }
  return null;
};
const finishJob = (jobHash, data = {}) => {
  let success;
  let job = getJob(jobHash)
  if (job) {
    data.jobHash = jobHash;
    job.emit('end', data);
    return true;
  } else {
    console.log('job not found', jobHash);
    return false;
  }

};
const finishNextJob = (jobHash, data = {}) => {
  var nextJobHash;
  const jobs = schedule.scheduledJobs;
  let hashes = Object.keys(jobs);

  for (var i = 0; i < hashes.length; i++) {
    let hash = hashes[i];
    let job = jobs[hash];
    if (job.name == jobHash) {
      nextJobHash = hashes[i + 1];
      break;
    }
  }

  data.jobHash = jobHash;
  return finishJob(nextJobHash, data);
};
const updateRule = (jobHash, m, dataRule) => {
  let job = getJob(jobHash)
  if (job) {
    job.setData(dataRule);
    if (m == null) {
      console.log('Not everthing filled in');
      return false;
    }
    m = setTomoment(m);

    var date = m.toDate();
    schedule.rescheduleJob(job, date);
    return true;
  } else {
    console.log('job not found', jobHash);
    return false;
  }

};

const addRule = (m, dataRule, f) => {
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
        hash,
        data: job.getData()
      };

      if (f && f instanceof Function) {
        f(result).then((result) => {
          result.isCanceled = schedule.cancelJob(job);

          result.running = false;
          result.runned = true;
          result.data = job.getData();
        }).catch((err) => {
          console.log(err);
          job.cancel();
        });
      }

    });

    job.setData(dataRule);

    job.on('run', () => {
      job.cancel();
      console.log('New job is done on ' + date + ', hash: ' + hash, moment(date).format(), moment(new Date()).format());
      log();
    });
    job.on('end', (data) => {
      //job.emit('run', true);
      const {scheduleController} = require('../controllers');
      scheduleController.finishGameEventFromHash(data).then((obj) => {

        if(obj){
          let {runned}=obj;
          if (runned) {
            console.log('New job is runned on ' + date + ', hash: ' + hash);
            job.cancel();
            log();
          } else {
            console.log('New job is NOT runned on ' + date + ', hash: ' + hash);
          }
        }

      }).catch(err => {
        console.log(err);
      });

    });

    return job;
  } catch (e) {
    console.log(e);
  }

};
module.exports.addRule = addRule;
module.exports.updateRule = updateRule;
module.exports.finishJob = finishJob;
module.exports.endJob = endJob;
module.exports.getJob = getJob;
module.exports.cancelAll = cancelAll;
module.exports.cancel = cancel;
module.exports.finishNextJob = finishNextJob;
