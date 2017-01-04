/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-12-05T14:31:57+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-03T22:31:01+01:00
* @License: stijnvanhulle.be
*/

import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import piController from 'lib/piController';
import {calculateTimeFormat} from 'lib/functions';

class Countdown extends Component {
  state = {
    intervalObj: null,
    interval: 1000,
    time: 0,
    isStopped: false
  }
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    const {howLong} = this.props;
    if (howLong && howLong != 0) {
      this.start(howLong);
    }

  }
  componentWillUnmount() {
    clearInterval(this.state.intervalObj);
  }
  timer = () => {
    var newTime = this.state.time - this.state.interval;
    if (newTime >= 0) {
      if(this.props.sendToPi){
        let timeFormat = calculateTimeFormat(newTime);
        piController.tickBom(timeFormat);
      }

      this.setState({time: newTime});
    } else {

      this.stop();
      this.props.isDone(true);
    }
  }
  pause = () => {
    clearInterval(this.state.intervalObj);
    this.setState({intervalObj: null});
  }
  stop = () => {
    this.pause();
    this.setState({isStopped: true});

  }
  start = (howLong) => {
    this.pause();
    let intervalObj = setInterval(this.timer, this.state.interval);

    if (howLong) {
      this.setState({
        intervalObj,
        time: howLong * 1000,
        isStopped: false
      });
    } else {
      this.setState({intervalObj, isStopped: false});
    }

  }

  render() {
    const {time, isStopped} = this.state;
    let timeFormat = calculateTimeFormat(time);

    let className = this.props.className || 'countdown';

    if (time == 0) {
      className += ' hide';
    }
    if (isStopped) {
      return (
        <div className={className}>
          <span>Loading ...</span>
        </div>
      );
    } else {
      return (
        <div className={className}>
          <span>{timeFormat}</span>
        </div>
      );
    }

  }

}
Countdown.propTypes = {
  className: PropTypes.string,
  howLong: PropTypes.number.isRequired,
  isDone: PropTypes.func,
  sendToPi:PropTypes.bool
}

export default Countdown;
