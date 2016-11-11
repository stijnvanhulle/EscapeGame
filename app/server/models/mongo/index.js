/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-11-08T17:36:33+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-11T17:42:42+01:00
 * @License: stijnvanhulle.be
 */

const Access = require( "./access" );
const Members = require( "./members" );


module.exports = (() => {
  //load defaults
  Access.load();
  Members.load();

  return {
    Access: Access.getModel(),
    Members: Members.getModel()
  };

})();
