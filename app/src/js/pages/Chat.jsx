import React, {PropTypes} from 'react';

import {Message, ChatInput} from '../components';
import isProduction from '../lib/isProduction';

const Chat = ({messages, onSubmitMessage: handleSubmitMessage}) => (

  <section className='chat page'>
    <div className='chatArea'>
      <ul className='messages'>
        {messages.reverse().map((m, i) => <Message key={i} {...m} />)}
      </ul>
    </div>
    <ChatInput onSubmitMessage={handleSubmitMessage} />
  </section>

);

if(!isProduction){

  Chat.propTypes = {
    messages: PropTypes.array,
    onSubmitMessage: PropTypes.func
  };

}

export default Chat;
