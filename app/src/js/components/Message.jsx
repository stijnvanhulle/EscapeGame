/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-17T21:33:05+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-01T19:01:40+01:00
* @License: stijnvanhulle.be
*/



import React, {PropTypes} from 'react';

import isProduction from '../lib/isProduction';

const Message = ({type, message}) => (
  <li className={type}>{message}</li>
);
if(!isProduction){

  Message.propTypes = {
    message: PropTypes.string,
    type: PropTypes.string
  };

}

export default Message;
