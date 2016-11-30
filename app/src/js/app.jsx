/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-10-17T21:12:13+02:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-11-30T23:03:57+01:00
* @License: stijnvanhulle.be
*/

import React, {Component, PropTypes} from 'react';
import socketNames from './lib/socketNames';
import Header from './components/header';
import moment from 'moment';
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

  handleWSOnline = obj => {
    console.log(obj);
  }
  handleWSEventStart = obj => {
    console.log('New event:',obj);
  }
  handleWSEventEnd = obj => {
    console.log('End event:',obj);
  }

  // EVENTS

  render() {
    this.socket = io(`/`);
    window.socket = this.socket;
    window.moment = moment;
    this.socket.emit('socketNames.ONLINE',{device:'screen'});
    this.socket.on(socketNames.ONLINE, this.handleWSOnline);
    this.socket.on(socketNames.EVENT_START, this.handleWSEventStart);
      this.socket.on(socketNames.EVENT_END, this.handleWSEventEnd);

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

export default App;
