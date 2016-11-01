import React, {Component, PropTypes} from 'react';

import isProduction from '../lib/isProduction';

class UsernameInput extends Component {

  state = {
    username: ``
  }

  componentDidMount() {
    this.$el.focus();
  }

  handleKeyUp = ({keyCode}) => {

    const {onSubmitUsername} = this.props;
    const {username} = this.state;

    if(keyCode === 13 && username) {
      this.setState({username: ``});
      onSubmitUsername(username);
    }

  }

  handleChange = () => {
    this.setState({username: this.$el.value});
  }

  render() {

    const {username} = this.state;

    return (
      <input
        className='usernameInput'
        type='text'
        ref={el => this.$el = el}
        value={username}
        onChange={this.handleChange}
        onKeyUp={this.handleKeyUp}
      />
    );

  }

}

if(!isProduction){

  UsernameInput.propTypes = {
    onSubmitUsername: PropTypes.func
  };

}


export default UsernameInput;
