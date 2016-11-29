/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-29T11:59:30+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-29T12:17:34+01:00
* @License: stijnvanhulle.be
*/
const {setTomoment} = require('./functions');
const schedule =require('node-schedule');
const Chance = require('chance');
const c = new Chance();

var cancelAll = function() {
  for (var i = 0; i < schedule.scheduledJobs.length; i++) {
    schedule.scheduledJobs[i].cancel();
  }
  if (schedule.scheduledJobs && schedule.scheduledJobs.length > 0) {
    console.log('Jobs actief: ' + schedule.scheduledJobs.length);
  } else {
    console.log('Geen jobs actief');
  }

};
var addRule = (m, data, f) =>{
  return new Promise(function(resolve, reject) {
    try {
      if (m == null || data == null || f == null) {
        return;
      }

      cancelAll();
      m = setTomoment(m);

      var date = m.toDate();
      var hash = c.hash({length: 15});
      console.log('New job will start on ' + date + ',hash: ' + hash);

      var job = schedule.scheduleJob(hash, date, (result) => {
        f(result).then(function(ok) {
          if (ok) {
            job.cancel();
          }
          resolve(true);
        }).catch(function(err) {
          console.log(err);
          job.cancel();
          reject(err);
        });

      });
    } catch (e) {
      console.log(e);
    }

  });
};
module.exports.addRule=addRule;
module.exports.cancelAll=cancelAll;
