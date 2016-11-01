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
