/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-17T21:12:13+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-01T15:57:44+01:00
* @License: stijnvanhulle.be
*/



import React, {Component} from 'react';
import {Match, BrowserRouter as Router} from 'react-router';

import {MatchWhenUsername} from '../components/';
import {Chat, ChooseUsername} from './';

import MessageType from '../const/MessageType';

import io from 'socket.io-client';

class App extends Component {

  state = {
    username: ``,
    messages: [],
    users: []
  }

  addMessage = (type, message) => {
    const {messages} = this.state;
    messages.push({type, message});
    this.setState({messages});
  }

  // WS

  handleWSLogin = users => {

    this.addMessage(
      MessageType.STATUS,
      `Welcome to Devine Chat`
    );

    this.addMessage(
      MessageType.STATUS,
      `There are ${users.length} users in Devine chat`
    );

    this.setState({users});

  }

  handleWSPublicMsg = ({username, message}) => {
    this.addMessage(
      MessageType.MESSAGE,
      `${username}: ${message}`
    );
  }

  handleWSJoin = username => {
    this.addMessage(
      MessageType.STATUS,
      `${username} joined the chat`
    );
  }

  handleWSLeave = username => {
    this.addMessage(
      MessageType.STATUS,
      `${username} left the chat`
    );
  }

  // EVENTS

  handleSubmitUsername = username => {

    this.setState({username});

    this.socket = io(`/`);

    this.socket.on(`login`, this.handleWSLogin);

    this.socket.on(`publicMsg`, this.handleWSPublicMsg);

    this.socket.on(`leave`, this.handleWSLeave);
    this.socket.on(`join`, this.handleWSJoin);

    this.socket.emit(`joined`, username);

  }

  handleSubmitMessage = message => {
    const {username} = this.state;
    this.socket.emit(`publicMsg`, {username, message});
  }

  render() {

    const {username, messages} = this.state;

    return (
      <Router>

        <main>

          <Match
            exactly pattern='/'
            render={() => (
              <ChooseUsername
                onSubmitUsername={this.handleSubmitUsername}
              />
            )}
          />

          <MatchWhenUsername
            exactly pattern='/chat'
            component={Chat}
            onSubmitMessage={this.handleSubmitMessage}
            {...{username, messages}}
          />

        </main>

      </Router>
    );

  }

}

export default App;
