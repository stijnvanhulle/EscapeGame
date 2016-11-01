import React, {PureComponent, PropTypes} from 'react';
import {UsernameInput} from '../components';

import isProduction from '../lib/isProduction';

//TODO: hoe hou ik dit component functional?

class ChooseUsername extends PureComponent {

  handleSubmitUsername = message => {

    const {onSubmitUsername} = this.props;
    onSubmitUsername(message);

    //TODO: wil dit doen in App, maar dan kan ik niet aan de router
    this.context.router.transitionTo(`/chat`);

  }

  render() {

    return (
      <section className='login page'>
        <div className='form'>
          <header>
            <h1 className='title'>What's your nickname?</h1>
          </header>
          <UsernameInput onSubmitUsername={this.handleSubmitUsername} />
        </div>
      </section>
    );

  }

}

if(!isProduction){

  ChooseUsername.propTypes = {
    onSubmitUsername: PropTypes.func
  };

}

ChooseUsername.contextTypes = {
  router: PropTypes.object
};

export default ChooseUsername;
