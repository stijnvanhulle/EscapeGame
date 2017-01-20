/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-03T14:00:47+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-27T17:13:49+01:00
* @License: stijnvanhulle.be
*/

import React, {Component} from 'react';
//have to unwrap members of function of not working
const MembersList = ({members}) => {
  const messageView = (item, i) => {
    return (
      <div key={i}>{item.firstName} {item.lastName}</div>
    );
  };

  

  const amount = members.length;
  return (
    <div>
      {members.map((item, i) => messageView(item, i))}
    </div>
  );

};

export default MembersList;
