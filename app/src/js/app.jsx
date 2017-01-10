/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-17T21:12:13+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2017-01-07T13:51:13+01:00
* @License: stijnvanhulle.be
*/

import React, {Component, PropTypes} from 'react';
import axios from 'axios';
import {socketConnect} from 'socket.io-react';
import socketNames from 'lib/const/socketNames';
import {runAudio, setCookie, getCookie} from 'lib/functions';
import Header from 'components/header';
import moment from 'moment';
import $ from 'jquery';
import {bindActionCreators} from 'redux';

import {connect} from 'react-redux';
import game from 'lib/game';
import piController from 'lib/piController';
import timer from 'lib/timer';
import url from 'lib/const/url';

import * as gameActions from 'actions/gameActions';

//same as React.creataClass(){};
class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.loadLogin();
    this.loadSocket();

  }
  componentDidMount() {}
  state = {
    username: ``,
    messages: [],
    users: []
  }
  loadOldGame = () => {
    try {
      const gameId = JSON.parse(localStorage.getItem('gameId'));
      if (gameId) {
        game.started = true;
        this.props.actions.getGame(gameId).then(() => {
          console.log('GAME LOADED', this.props.game);
        }).catch(err => {
          localStorage.setItem('gameId', 0);
          location.reload();
          console.log(err);
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
  loadToken = () => {
    try {
      const token = getCookie('token');
      return token;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  loadLogin = () => {
    let email = "stijn.vanhulle@outlook.com";
    let password = "stijn";
    let token = this.loadToken(token);
    if (!token) {
      axios.post(url.LOGIN, {email, password}).then((response) => {
        var {token, expires_in} = response.data;
        game.token = token;
        setCookie('token', token, moment(expires_in));
        axios.defaults.headers.common['Authorization'] = token;
        this.loadOldGame();
      }).catch((err) => {
        game.token = null;
      });
    } else {
      axios.defaults.headers.common['Authorization'] = token;
      this.loadOldGame();
    }

  }
  loadSocket = () => {
    this.socket = this.props.socket;
    this.socket.emit(socketNames.ONLINE, {device: 'screen'});
    this.socket.on(socketNames.ONLINE, this.handleWSOnline);
    this.socket.on(socketNames.EVENT_START, this.handleWSEventStart);
    this.socket.on(socketNames.EVENT_END, this.handleWSEventEnd);
    this.socket.on(socketNames.EVENT_FINISH, this.handleWSEventFinish);
    this.socket.on(socketNames.EVENT_DATA, this.handelWSEventData);

    piController.loadSocket(this.socket);

    window.$ = $;
    window.jquery = $;
    window.socket = this.socket;
    window.moment = moment;
    window.game = game;
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
    const {correct, triesOver, data} = obj;
    const gameData = game.currentGameData;
    const currentData = gameData.data.data;
    const type = gameData.data.type.toLowerCase();

    if (type == "bom") {
      if (!correct) {
        piController.sendText('BOEM');
        game.events.emit('audio', currentData.file);
      }
      game.events.emit('bomStop', correct);
    }

    if (correct) {
      game.letters.push(data.letter);
    }

    if (!triesOver || triesOver > 0) {
      game.events.emit('startCountdown');
    } else {
      game.events.emit('pauseCountdown', correct);
    }

  }
  handleWSEventFinish = obj => {
    console.log('Event finish:', obj);
    game.events.emit('eventFinish');

  }

  handleWSEventStart = obj => {
    console.log('New event:', obj);
    let {gameEvent, gameData, activeEvents} = obj;
    game.currentGameData = gameData;
    game.currentGameEvent = gameEvent;

    this.socket.emit(socketNames.RECALCULATE_START, game.id);

    this.props.actions.updateGameEvent(gameEvent).then(() => {
      const currentData = gameData.data.data;
      const type = gameData.data.type.toLowerCase();
      const timeBetween = gameEvent.timeBetween;

      game.events.emit('eventStart');

      if (type == 'sound' || type == 'anthem') {
        game.events.emit('audio', currentData.file);
      } else if (type == "scan") {
        game.events.emit('image', currentData.file);
      } else if (type == 'bom') {

        if (timeBetween) {
          game.events.emit('bomStart', timeBetween);
        }

      } else {
        game.events.emit('audio', null);
        game.events.emit('image', null);
      }
      if (timeBetween) {
        game.events.emit('startCountdown', timeBetween);
      }

      const hints = gameData.data.data.hints;
      if (hints) {
        timer.startHints(hints, gameData.data.data.maxTime);
      }

      console.log('UPDATED gameEvent');
    }).catch((e) => {
      console.log(e);
    });

    piController.start(gameEvent, gameData);
  }
  handleWSEventEnd = obj => {
    console.log('End event:', obj);
    let {gameEvent, gameData, activeEvents} = obj;
    game.currentGameData = gameData;
    game.currentGameEvent = gameEvent;

    this.props.actions.updateGameEvent(gameEvent).then(() => {
      console.log('UPDATED gameEvent');

      game.events.emit('stopCountdown');
      game.events.emit('eventEnd');
      game.events.emit('letters', game.events);

      if (activeEvents == 0) {
        this.socket.emit(socketNames.EVENT_FINISH, {finish: true});
      }

      timer.stop();
    }).catch((e) => {
      console.log(e);
    });
    piController.end(gameEvent, gameData);
  }

  // EVENTS

  render() {
    return (
      <div className='container'>
        <header><Header/></header>
        <main>
          <div className="logo">
            <img src='/assets/images/logo.png'/>
          </div>
          <div className='container-fluid'>
            {this.props.children}
          </div>
        </main>
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

export default connect(mapStateToProps, mapDispatchToProps)(socketConnect(App));
