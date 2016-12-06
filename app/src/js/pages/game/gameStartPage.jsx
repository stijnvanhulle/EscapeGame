/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-03T14:00:47+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-06T15:16:58+01:00
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
      } else {
        countdown--;
        self.setState({'countdown': countdown});
      }
    }, 1000);

    self.startGame();
  }
  startGame = () => {
    this.props.actions.createGameEvents({
      game,
      startTime: moment().add('seconds', this.state.countdown).valueOf()
    }).then(() => {
      const gameEvents = this.props.gameEvents;
      console.log('GameEvents v1', gameEvents);
      return this.props.actions.addGameEvent({data: gameEvents, game});
    }).then(() => {
      const gameEvents = this.props.gameEvents;
      console.log('GameEvents v2', gameEvents);
    }).catch(err => {
      console.log(err);
    });
  }
  render() {
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
  return {players: mapState.players, game: mapState.game, gameEvents: mapState.gameEvents};
};
const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(gameActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameStartPage);
