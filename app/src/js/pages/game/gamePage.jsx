/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-03T14:00:47+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-02T21:23:59+01:00
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
    data: {}
  }
  constructor(props, context) {
    super(props, context);
    if (game.id) {
      this.state = {
        teamName: '',
        error: '',
        data: {}
      };
    }
  }

  componentDidMount = () => {
    this.loadEvents();

  }

  loadEvents = () => {
    game.events.on('eventFinish', () => {
      $('body').removeClass('horizon');
      $('.prison svg #background').removeClass('horizon');

      this.props.actions.stopGame(game).then(() => {
        const {id: gameId} = this.props.game;
        if (gameId) {
          game.isFinised = true;
        }

      }).catch(err => {
        console.log(err);
      });

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
  onNewGame = (e) => {
    localStorage.setItem('gameId', 0);
    game.events.emit('resetGame');
    location.relaod();
  }

  render() {

    if (this.props.game && this.props.game.id) {
      if (this.props.game.isFinished) {
        return (
          <div className="box">
            <h1>FINISHED</h1>
            <Button onClick={this.onNewGame}>New Game</Button>
          </div>

        )
      } else {
        return (
          <div className=''><GameStart/></div>
        );
      }

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
