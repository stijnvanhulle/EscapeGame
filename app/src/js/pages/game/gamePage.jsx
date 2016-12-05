/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-11-03T14:00:47+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-05T17:14:54+01:00
* @License: stijnvanhulle.be
*/

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as gameActions from '../../actions/gameActions';
import PlayerAddPage from './playerAddPage';
import GameStartPage from './gameStartPage';

import TextInput from '../../components/common/TextInput';

class GamePage extends Component {
  state = {
    teamName: '',
    error: '',
    isgameStarted: false
  }
  constructor(props, context) {
    super(props, context);
    try {
      const gameId = JSON.parse(localStorage.getItem('gameId'));
      if (gameId) {
        this.props.actions.getGame(gameId).then(() => {
          this.setState({isgameStarted: true});
          console.log('GAME LOADED', this.props.game);
        }).catch(err => {
          console.log(err);
        });
      }
    } catch (e) {
      console.log(e);
    }

  }

  startGame = (e) => {
    const gamers = this.prop;
    if (this.state.teamName) {
      this.props.actions.createGame(this.props.players, this.state.teamName).then(() => {
        const {id: gameId} = this.props.game;
        if (gameId)
          localStorage.setItem('gameId', gameId)

        this.setState({isgameStarted: true});
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
    const playerAdd = <div>
      <h1>Game</h1>

      <button onClick={this.startGame}>Start game</button>
      <TextInput name="teamName" label="teamName" value={this.state.teamName} onChange={this.onChangeTeamName} error={this.state.error}/>
      <PlayerAddPage/> {this.props.players.map((item, i) => messageView(item, i))}
    </div>;
    const gameStart = <div>
      <h1>Game</h1>
      <GameStartPage/>
    </div>;
    if (this.state.isgameStarted) {
      return (gameStart)
    } else {
      return (playerAdd);
    }
  }
}

const messageView = (item, i) => {
  return (
    <div key={i}>{item.firstName} {item.lastName}</div>
  );
};

const mapStateToProps = (mapState, ownProps) => {
  return {players: mapState.players, game: mapState.game};
};
const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(gameActions, dispatch)
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(GamePage);
