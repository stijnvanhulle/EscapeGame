/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2017-01-10T09:40:27+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-10T11:11:50+01:00
* @License: stijnvanhulle.be
*/
const moment = require('moment');
const {setToMoment} = require('../lib/functions');
const levels = {
  //duration 60 minutes
  level1: {}
}

let gameLogic = {};
gameLogic.createData = (gameDataId = null, level = 5, startTime = moment().valueOf(), startIn = 10, maxTime = null, timeBetween = null, gameDuration, amount) => {
  try {
    let now = moment();
    if (parseInt(level) > 3) {
      throw new Error('Level is to big');
    }
    if (!startTime)
      throw new Error('Time to start not filled in');
    if (!gameDataId)
      throw new Error('GameDataId not filled in');

    startTime = setToMoment(startTime);
    if (!startTime)
      throw new Error('Time to start not a utc timestamp');

    //delay of 5 seconds for push data
    if (!startTime.isSameOrAfter(now, 'second') || !setToMoment(startTime.valueOf()).add('seconds', 5).isSameOrAfter(now, 'second') || !setToMoment(startTime.valueOf()).add('seconds', startIn).isSameOrAfter(now, 'second')) {
      throw new Error('Time is not in the future ' + startTime.format().toString() + ' now: ' + now.format().toString());
    }

    if (!timeBetween) {
      timeBetween = gameLogic.calculateTimeBetween(gameDuration, level);
    }

    if (maxTime && timeBetween) {
      if (maxTime < timeBetween) {
        timeBetween = maxTime;
      }
    }

    let activateDate = setToMoment(startTime).add('seconds', parseInt(startIn));
    let activateDate_temp = setToMoment(activateDate.valueOf());

    let endDate = activateDate_temp.add('seconds', parseInt(timeBetween));

    if (!setToMoment(endDate).isAfter(setToMoment(activateDate))) {
      throw new Error('endDate not after activatedate');
    }

    return {
      activateDate: parseFloat(activateDate.valueOf()),
      endDate: parseFloat(endDate.valueOf()),
      isActive: true,
      finishDate: null,
      gameDataId,
      level
    };

  } catch (e) {
    console.log(e);
    throw e;
  }

};

gameLogic.calculateTimeBetween = (duration, level = 5) => { //duration in minutes
  var seconds = 0;
  var minutes = 0;
  if (level == 1) {
    minutes = 0; //TODO: set to 10
    seconds = 20;
    timeBetween = seconds + (minutes * 60);
  } else if (level == 2) {
    minutes = 5;
    seconds = 0;
    timeBetween = seconds + (minutes * 60);
  } else if (level == 3) {
    minutes = 2;
    seconds = 0;
    timeBetween = seconds + (minutes * 60);
  }
};
gameLogic.levels = levels;
module.exports.default = gameLogic;
