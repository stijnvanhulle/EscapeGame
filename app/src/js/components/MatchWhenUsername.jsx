import React, {PropTypes} from 'react';
import {Match, Redirect} from 'react-router';

import isProduction from '../lib/isProduction';

const MatchWhenUsername = ({component: Component, ...rest}) => {

  const {username} = rest;

  return (

    <Match {...rest} render={props => {

      return username ? (
        <Component
          {...props} {...rest}
        />
      ) : (
        <Redirect to={{
          pathname: `/`
        }} />
      );

    }} />

  );
};

if(!isProduction){

  MatchWhenUsername.propTypes = {
    component: PropTypes.func
  };

}

export default MatchWhenUsername;
