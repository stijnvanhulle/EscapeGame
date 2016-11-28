/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-03T15:03:43+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-03T15:11:00+01:00
* @License: stijnvanhulle.be
*/



import React from 'react';
import {Link} from 'react-router';

const NotFound = () => {
  return (
    <div>
      <h1>Page Not Found</h1>
      <p>Whoops! Sorry, there is nothing to see here.</p>
      <p>
        <Link to='app'>Back to Home</Link>
      </p>
    </div>
  );

};
export default NotFound;
