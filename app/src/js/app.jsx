/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-17T21:12:13+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-03T15:17:29+01:00
* @License: stijnvanhulle.be
*/

import React, {Component, PropTypes} from 'react';
import Header from './components/header';

import io from 'socket.io-client';

//same as React.creataClass(){};
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

    this.addMessage(`STATUS`, `Welcome to Devine Chat`);

    this.addMessage(`STATUS`, `There are ${users.length} users in Devine chat`);

    this.setState({users});

  }

  handleWSPublicMsg = ({username, message}) => {
    this.addMessage(`MESSAGE`, `${username}: ${message}`);
  }

  handleWSJoin = username => {
    this.addMessage(`STATUS`, `${username} joined the chat`);
  }

  handleWSLeave = username => {
    this.addMessage(`STATUS`, `${username} left the chat`);
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

    return (
      <div className='container-fluid'>
        <Header />
          {this.props.children}
      </div>
    );

  }

}
App.propTypes = {
  children: PropTypes.object.isRequired
};

export default App;
