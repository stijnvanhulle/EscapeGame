/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-05-07T21:14:28+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-03T14:27:40+01:00
* @License: stijnvanhulle.be
*/



import React from 'react';
import {IndexLink} from 'react-router';

const Header = () => {
  return (
    <nav>
      <IndexLink to='/' activeClassName='active'>Home</IndexLink>

    </nav>
  );
};
//{` | `}
//<Link to='/about' activeClassName='active'>About</Link>;

export default Header;
