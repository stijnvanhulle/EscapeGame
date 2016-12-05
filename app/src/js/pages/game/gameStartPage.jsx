/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-03T14:00:47+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-05T22:40:05+01:00
* @License: stijnvanhulle.be
*/

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import * as gameActions from '../../actions/gameActions';
import game from '../../lib/game';
class GameStartPage extends Component {
  state = {
    countdown: 2
  }
  constructor(props, context) {
    super(props, context);
    let self = this;
    let countdown = this.state.countdown
    let timer = setInterval(function() {
      if (countdown == 0) {
        clearInterval(timer);
        self.startGame();
      } else {
        countdown--;
        self.setState({'countdown': countdown});
      }
    }, 1000);
  }
  startGame = () => {
    this.props.actions.createGameData({
      game,
      startTime: moment().add('seconds', 20).valueOf()
    }).then(() => {
      const gameData = this.props.gameData;
      console.log('Gamedata v1', gameData);
      return this.props.actions.addGameData({data: gameData, game});
    }).then(() => {
      const gameData = this.props.gameData;
      console.log('Gamedata v2', gameData);
    }).catch(err => {
      console.log(err);
    });
  }
  render() {
    console.log(this.props.gameData);
    let starting;
    if (this.state.countdown != 0) {
      starting = <div>
        starting in {this.state.countdown}
      </div>;
    }
    return (
      <div>
        {starting}
      </div>
    );
  }
}
const mapStateToProps = (mapState, ownProps) => {
  return {players: mapState.players, game: mapState.game, gameData: mapState.gameData};
};
const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(gameActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameStartPage);
