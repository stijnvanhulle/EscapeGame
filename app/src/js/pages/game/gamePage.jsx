/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-03T14:00:47+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-02T17:42:28+01:00
* @License: stijnvanhulle.be
*/

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as gameActions from '../../actions/gameActions';
class GamePage extends Component {
  state = {
    member: ``,
    members: []
  }
  constructor(props, context) {
    super(props, context);
  }


  render() {
    return (
      <div>
        <h1>Game</h1>
      </div>
    );
  }
}

const mapStateToProps = (mapState, ownProps) => {
  return {gameEvents: mapState.members};
};
const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(gameActions, dispatch)
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(GamePage);
