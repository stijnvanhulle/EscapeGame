/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-12-05T14:31:57+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-29T22:37:18+01:00
* @License: stijnvanhulle.be
*/

import React, {Component, PropTypes} from 'react';

const Audio = ({src, repeat, className}) => {
  if (src) {
    let source = '/assets/audio/' + src.replace('/', '');
    return (
      <div className={className || 'audio'}>
        <video autoPlay loop={repeat || false}>
          <source src={source} type="audio/mpeg"/>

        </video>
      </div>
    );
  } else {
    return (
      <div className={className || 'audio'}></div>
    );
  }

};
Audio.propTypes = {
  src: PropTypes.string.isRequired,
  className: PropTypes.string,
  repeat: PropTypes.bool
}

export default Audio;
