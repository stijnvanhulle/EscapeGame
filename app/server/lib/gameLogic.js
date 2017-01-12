/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2017-01-10T09:40:27+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-10T11:58:48+01:00
* @License: stijnvanhulle.be
*/
const moment = require('moment');
const {setToMoment} = require('../lib/functions');
const levels = {
  //duration 60 minutes
  level1: {
    duration: 1 + 0.9
  },
  level2: {
    duration: 1 + 0.5
  },
  level3: {
    duration: 1 + 0.2
  },
  level4: {
    duration: 1 + 0.1
  },
  level5: {
    duration: 1
  },
  level6: {
    duration: 1 - 0.1
  },
  level7: {
    duration: 1 - 0.1
  },
  level8: {
    duration: 1 - 0.2
  },
  level9: {
    duration: 1 - 0.5
  },
  level10: {
    duration: 1 - 0.9
  }
};

let gameLogic = {};

gameLogic.getLevel = (level) => {
  return levels['level' + level];
};
gameLogic.createData = ({
  gameDataId = null,
  level = 5,
  startTime = moment().valueOf(),
  startIn = 10,
  maxTime = null,
  timeBetween = null,
  gameDuration = 60 * 60,
  amount
}) => {
  try {
    let now = moment();
    if (parseInt(level) > 15) {
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
      timeBetween = gameLogic.calculateTimeBetween(level, gameDuration, amount);
      console.log('timeBetween', timeBetween, gameDuration);
      if (isNaN(timeBetween)) {
        throw new Error('Timebetween not number');
      }
    }

    if (maxTime && timeBetween) {
      if (maxTime < timeBetween) {
        timeBetween = maxTime;
      }
    }

    let activateDate = setToMoment(startTime).add('seconds', parseInt(startIn));
    let activateDate_temp = setToMoment(activateDate.valueOf());

    let endDate = activateDate_temp.add('seconds', timeBetween);

    if (!setToMoment(endDate).isAfter(setToMoment(activateDate))) {
      throw new Error('endDate not after activatedate');
    }

    return {
      activateDate: parseFloat(activateDate.valueOf()),
      endDate: parseFloat(endDate.valueOf()),
      isActive: true,
      finishDate: null,
      gameDataId,
      level,
      timeBetween
    };

  } catch (e) {
    console.log(e);
    throw e;
  }

};

gameLogic.calculateTimeBetween = (level, gameDuration, amount) => { //duration in seconds
  let levelObj = gameLogic.getLevel(level);
  //one amount more because
  //timeBetween=
  let itemDuration = gameDuration / (amount); //in seconds
  let timeBetween = parseFloat(itemDuration) * levelObj.duration;
  console.log('time', timeBetween, levelObj);

  return parseFloat(Math.floor(Math.abs(timeBetween)));

};
gameLogic.levels = levels;
module.exports = gameLogic;
