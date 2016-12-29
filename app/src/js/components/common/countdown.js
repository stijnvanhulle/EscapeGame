/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-12-05T14:31:57+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-29T23:15:51+01:00
* @License: stijnvanhulle.be
*/

import React, {Component, PropTypes} from 'react';
import moment from 'moment';

class Countdown extends Component {
  state = {
    intervalObj: null,
    interval: 1000,
    time: 0
  }
  constructor(props, context) {
    super(props, context);
  }
 
  componentDidMount() {
    const {howLong} = this.props;
    let intervalObj = setInterval(this.timer, this.state.interval);

    this.setState({
      intervalObj,
      time: howLong * 1000
    });
  }
  componentWillUnmount() {
    clearInterval(this.state.intervalObj);
  }
  timer = () => {
    var newCount = this.state.time - this.state.interval;
    if (newCount >= 0) {

      this.setState({time: newCount});
    } else {

      clearInterval(this.state.intervalObj);
      this.props.isDone(true);
    }
  }

  render() {
    const {time} = this.state;
    let timeFormat = '00:00:00';

    function pad(num, size) {
      var s = "0000" + num;
      return s.substr(s.length - size);
    }

    var seconds = Math.floor(time / 1000);
    var minutes = Math.floor(seconds / 60);
    seconds = seconds - (minutes * 60);

    timeFormat = pad(minutes, 2) + ':' + pad(seconds, 2);

    let className = this.props.className || 'countdown';

    if (time == 0) {
      className += ' hide';
    }
    return (
      <div className={className}>
        <span>{timeFormat}</span>
      </div>
    );
  }

}
Countdown.propTypes = {
  className: PropTypes.string,
  howLong: PropTypes.number.isRequired,
  isDone: PropTypes.func
}

export default Countdown;
