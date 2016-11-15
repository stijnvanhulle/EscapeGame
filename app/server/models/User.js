/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-13T18:09:11+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-14T13:29:17+01:00
* @License: stijnvanhulle.be
*/



class Member {

  constructor(id, socketId){
    this.id = id;
    this.socketId = socketId;
    this.nickname = `user${this.id}`;
  }

}


module.exports = Member;
