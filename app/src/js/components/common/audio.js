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
    id: '',
    source: '',
    repeat: false
  }
  constructor(props, context) {
    super(props, context);
    let c = new Chance();
    let id = c.hash({length: 4});
    this.state.id = id;
  }
  play(source, repeat) {
    this.setState({source, repeat});

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
  pause() {

    var obj = document.getElementById(this.state.id);
    if (obj) {
      obj.currentTime = 0;
      obj.pause();
    }
    this.setState({source: '', repeat: false});
  }

  componentDidMount() {
    console.log('audio loaded');
  }
  render() {
    if (this.state.source) {
      let src = this.state.source.indexOf('/') == 0
        ? this.state.source.substring(1)
        : this.state.source;
      let source = '/assets/audio/' + src;
      return (
        <div className={this.props.className || 'audio'}>
          <video id={this.state.id} loop={this.state.repeat}>
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
  className: PropTypes.string
}

export default Audio;
