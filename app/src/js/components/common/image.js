/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-12-05T14:31:57+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-29T22:37:22+01:00
* @License: stijnvanhulle.be
*/

import React, {Component, PropTypes} from 'react';

const Image = ({src, className}) => {
  if (src) {
    let source = '/images/' + src.replace('/', '');
    return (
      <div className={className}>
        <img src={source}/>
      </div>
    );
  } else {
    return (
      <div className={className}></div>
    );
  }

};
Image.propTypes = {
  className: PropTypes.string,
  src: PropTypes.string.isRequired
}

export default Image;
