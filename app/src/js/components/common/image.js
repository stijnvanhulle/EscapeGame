/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-12-05T14:31:57+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-13T16:26:24+01:00
* @License: stijnvanhulle.be
*/

import React, {PropTypes} from 'react';

const Image = ({src}) => {
  if (src) {
    let source = '/images/' + src.replace('/', '');
    return (
      <div>
          <img src={source} />
      </div>
    );
  } else {
    return (
      <div></div>
    );
  }

};
Image.propTypes = {
  src: PropTypes.string.isRequired
}

export default Image;
