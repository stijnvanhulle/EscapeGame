/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-03T14:00:47+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-12T16:56:43+01:00
* @License: stijnvanhulle.be
*/

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import * as gameActions from '../../actions/gameActions';
import game from '../../lib/game';
import socketNames from '../../lib/socketNames';
import TextInput from '../../components/common/textInput';
import Audio from '../../components/common/audio';

class GameStartPage extends Component {
  state = {}
  constructor(props, context) {
    super(props, context);
    this.socket = window.socket;
    let self = this;
    let countdown = 2;

    this.state = {
      countdown: countdown,
      startTime: moment().add('seconds', countdown).valueOf(),
      input: '',
      error: '',
      audioSrc: ''
    };

    let timer = setInterval(function() {
      if (countdown == 0) {
        clearInterval(timer);
      } else {
        countdown--;
        self.setState({'countdown': countdown});
      }
    }, 1000);

    self.startGame();

    game.events.on('audio', (src) => {
      if (src) {
        this.setState({audioSrc: src});
      }

    });
  }
  startGame = () => {
    console.log(this.state.startTime);
    this.props.actions.createGameEvents({game, startTime: this.state.startTime}).then(() => {
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
  onChangeInput = (e) => {
    const field = e.target.name;
    return this.setState({input: e.target.value});
  }
  sendInput = () => {
    const input = this.state.input;
    if (input) {
      if (game.currentGameEvent.isActive) {
        this.socket.emit(socketNames.INPUT, {
          input,
          jobHash: game.currentGameEvent.jobHash,
          finishDate: moment().valueOf()
        });
      }

    }
  }

  render() {
    let starting;
    let div;
    if (this.state.countdown != 0) {
      div = <div>
        starting in {this.state.countdown}
      </div>;

    } else if (game.currentGameData) {
      div = <div>
        {game.currentGameData.data.data.description}
        <TextInput name="input" label="teamName" value={this.state.input} onChange={this.onChangeInput} error={this.state.error}/>
        <button onClick={this.sendInput}>Send Input</button>
        <Audio src={this.state.audioSrc}/>
      </div>;
    } else {
      div = <div></div>;
    }
    return (div);

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
