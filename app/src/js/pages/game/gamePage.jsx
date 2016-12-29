/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-03T14:00:47+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-29T23:50:00+01:00
* @License: stijnvanhulle.be
*/

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Button} from 'semantic-ui-react';

import TextInput from '../../components/common/textInput';

import GameNew from './common/gameNew';
import GameStart from './common/gameStart';

import * as gameActions from '../../actions/gameActions';
import game from '../../lib/game';

class GamePage extends Component {
  state = {
    teamName: '',
    error: '',
    isGameStarted: false,
    data: {}
  }
  constructor(props, context) {
    super(props, context);
    if (game.id) {
      this.state = {
        teamName: '',
        error: '',
        isGameStarted: true,
        data: {}
      };
    }
  }

  componentDidMount = () => {
    this.loadEvents();

  }

  loadEvents = () => {
    game.events.on('end', () => {
      self.setState({isGameStarted: true});
      self.props.actions.stopGame();
      game.reset();
    });
  }
  startGame = (e) => {
    const data = this.state.data;
    if (data.teamName) {
      this.props.actions.createGame(this.props.players, data.teamName).then(() => {
        const {id: gameId} = this.props.game;
        if (gameId) {
          localStorage.setItem('gameId', gameId);
          game.id = gameId;
          game.started = true;
          this.setState({isGameStarted: true});
        }

      }).catch(err => {
        console.log(err);
      });
    } else {
      this.setState({error: 'Teamname not filled in'});
    }

  }

  onChangeTeamName = (e) => {
    const field = e.target.name;
    let teamName = e.target.value.toString();

    return this.setState({teamName: teamName});
  }

  render() {

    if (this.props.game && this.props.game.id) {
      return (
        <div className=''><GameStart/></div>
      );
    } else {
      return (
        <div className='box'>
          {!game.started && <GameNew players={this.props.players} onStart={this.startGame} data={this.state.data} error={this.state.error}/>}
        </div>
      );
    }

  }
}

const mapStateToProps = (mapState, ownProps) => {
  return {players: mapState.players, game: mapState.game};
};
const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(gameActions, dispatch)
  }
};

GameStart.propTypes = {
  players: PropTypes.array,
  game: PropTypes.object,
  actions: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(GamePage);
