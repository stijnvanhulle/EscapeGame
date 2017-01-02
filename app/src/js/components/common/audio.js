/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-12-05T14:31:57+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-01T16:31:29+01:00
* @License: stijnvanhulle.be
*/

import React, {Component, PropTypes} from 'react';
import Chance from 'chance';
class Audio extends Component {
  state = {
    id: ''
  }
  constructor(props, context) {
    super(props, context);
    let c = new Chance();
    let id = c.hash({length: 4});
    this.state.id = id;
  }
  play() {
    var obj = document.getElementById(this.state.id);
    if (obj) {
      obj.currentTime = 0;
      setTimeout(() => {
        if (obj.paused) {
          obj.play();
        }
      }, 150);
    }
  }

  componentDidMount() {
    console.log('audio loaded');
  }
  render() {
    if (this.props.src) {
      let source = '/assets/audio/' + this.props.src.replace('/', '');
      return (
        <div className={this.props.className || 'audio'}>
          <video id={this.state.id} autoPlay={this.props.repeat || false} loop={this.props.repeat || false}>
            <source src={source} type="audio/mpeg"/>

          </video>
        </div>
      );
    } else {
      return (
        <div className={this.props.className || 'audio'}></div>
      );
    }
  }

}

Audio.propTypes = {
  src: PropTypes.string,
  className: PropTypes.string,
  repeat: PropTypes.bool
}

export default Audio;
