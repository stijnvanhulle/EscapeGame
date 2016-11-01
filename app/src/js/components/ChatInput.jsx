import React, {Component, PropTypes} from 'react';

import isProduction from '../lib/isProduction';

class ChatInput extends Component {

  state = {
    message: ``
  }

  componentDidMount() {
    this.$el.focus();
  }

  handleKeyUp = ({keyCode}) => {

    const {onSubmitMessage} = this.props;
    const {message} = this.state;

    if(keyCode === 13 && message) {
      this.setState({message: ``});
      onSubmitMessage(message);
    }

  }

  handleChange = () => {
    this.setState({message: this.$el.value});
  }

  render() {

    const {message} = this.state;

    return (
      <input
        className='inputMessage'
        value={message}
        ref={el => this.$el = el}
        onChange={this.handleChange}
        onKeyUp={this.handleKeyUp}
        placeholder='Type here...'
      />
    );

  }

}

if(!isProduction){

  ChatInput.propTypes = {
    onSubmitMessage: PropTypes.func
  };

}

export default ChatInput;
