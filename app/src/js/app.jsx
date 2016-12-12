/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-17T21:12:13+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-12T17:17:58+01:00
* @License: stijnvanhulle.be
*/

import React, {Component, PropTypes} from 'react';
import socketNames from './lib/socketNames';
import {runAudio} from './lib/functions';
import Header from './components/header';
import moment from 'moment';
import {bindActionCreators} from 'redux';
import io from 'socket.io-client';
import {connect} from 'react-redux';
import game from './lib/game';

import * as gameActions from './actions/gameActions';

//same as React.creataClass(){};
class App extends Component {

  constructor(props, context) {
    super(props, context);
    this.loadSocket();
    this.loadOldGame();
  }
  state = {
    username: ``,
    messages: [],
    users: []
  }
  loadOldGame = () => {
    try {
      const gameId = JSON.parse(localStorage.getItem('gameId'));
      if (gameId) {
        game.id = gameId;
        game.started = true;
        this.props.actions.getGame(gameId).then(() => {
          console.log('GAME LOADED', this.props.game);

        }).catch(err => {
          console.log(err);
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  loadSocket = () => {
    this.socket = io(`/`);
    this.socket.emit(socketNames.ONLINE, {device: 'screen'});
    this.socket.on(socketNames.ONLINE, this.handleWSOnline);
    this.socket.on(socketNames.EVENT_START, this.handleWSEventStart);
    this.socket.on(socketNames.EVENT_END, this.handleWSEventEnd);
    this.socket.on(socketNames.EVENT_DATA, this.handelWSEventData);

    window.socket = this.socket;
    window.moment = moment;
  }

  addMessage = (type, message) => {
    const {messages} = this.state;
    messages.push({type, message});
    this.setState({messages});
  }

  // WS

  handleWSOnline = obj => {
    console.log(obj);
  }

  handelWSEventData = obj => {
    console.log('Event data:', obj);
  }

  handleWSEventStart = obj => {
    console.log('New event:', obj);

    let {gameEvent, gameData} = obj;
    game.currentGameData = gameData;
    game.currentGameEvent = gameEvent;
    this.props.actions.updateGameEvent(gameEvent).then(() => {
      const currentData = gameData.data.data;
      if (gameData.data.type.toLowerCase() == 'sound') {
        game.events.emit('audio', currentData.file);
      } else {
        game.events.emit('audio', null);
      }

      console.log('UPDATED gameEvent');
    }).catch((e) => {
      console.log(e);
    });
  }
  handleWSEventEnd = obj => {
    console.log('End event:', obj);
    let {gameEvent, gameData} = obj;
    game.currentGameData = null;
    game.currentGameEvent = gameEvent;
    this.props.actions.updateGameEvent(gameEvent).then(() => {
      console.log('UPDATED gameEvent');
    }).catch((e) => {
      console.log(e);
    });
  }

  // EVENTS

  render() {
    return (
      <div className='container-fluid'>
        <Header/> {this.props.children}
      </div>
    );

  }

}
App.propTypes = {
  children: PropTypes.object.isRequired
};

const mapStateToProps = (mapState, ownProps) => {
  return {players: mapState.players, game: mapState.game, gameEvents: mapState.gameEvents};
};
const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(gameActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
