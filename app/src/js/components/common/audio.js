/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-12-05T14:31:57+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-12T17:16:21+01:00
* @License: stijnvanhulle.be
*/

import React, {PropTypes} from 'react';

const Audio = ({src}) => {
  if (src) {
    let source = '/audio/' + src.replace('/', '');
    return (
      <div>
        <video autoPlay loop>
          <source src={source} type="audio/mpeg"/>

        </video>
      </div>
    );
  } else {
    return (
      <div></div>
    );
  }

};
Audio.propTypes = {
  src: PropTypes.string.isRequired
}

export default Audio;
