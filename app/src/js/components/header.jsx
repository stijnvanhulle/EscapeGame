/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-05-07T21:14:28+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-05T14:26:47+01:00
* @License: stijnvanhulle.be
*/



import React from 'react';
import {IndexLink, Link} from 'react-router';

const Header = () => {
  return (
    <nav>
      <IndexLink to='/' activeClassName='active'>Home</IndexLink>
      {` | `}
      <Link to='/members' activeClassName='active'>Members</Link>
    </nav>
  );
};


export default Header;
