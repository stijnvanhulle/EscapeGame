/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-12-05T14:32:42+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-29T22:37:37+01:00
* @License: stijnvanhulle.be
*/

import React, {Component, PropTypes} from 'react';
import TextInput from '../common/textInput';
import {Button} from 'semantic-ui-react';

const PlayerForm = ({player, onSave, onChange, saving, errors}) => {
  return (
    <form onSubmit={onSave}>
      <TextInput name="firstName" required label="firstName" value={player.firstName?player.firstName:""} onChange={onChange} error={errors.firstName}/>

      <TextInput name="lastName" required label="lastName" value={player.lastName?player.lastName:""} onChange={onChange} error={errors.lastName}/>

      <TextInput name="birthday" required label="birthday" value={player.birthday?player.birthday:""} onChange={onChange} error={errors.birthday}/>

      <TextInput name="email" type="email" required label="email" value={player.email?player.email:""} onChange={onChange} error={errors.email}/>

      <Button type="submit" disabled={saving} className="gray" loading={saving}>{saving
        ? 'Adding...'
        : 'Add'}</Button>
    </form>
  );
};

PlayerForm.propTypes = {
  player: React.PropTypes.object.isRequired,
  onSave: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func.isRequired,
  saving: React.PropTypes.bool,
  errors: React.PropTypes.object
};

export default PlayerForm;
