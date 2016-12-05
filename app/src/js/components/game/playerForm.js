/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-12-05T14:32:42+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-05T15:25:26+01:00
* @License: stijnvanhulle.be
*/

import React from 'react';
import TextInput from '../common/TextInput';

const PlayerForm = ({player, onSave, onChange, saving, errors}) => {
  return (
    <form>
      <h1>Add player</h1>
      <TextInput name="firstName" label="firstName" value={player.firstName?player.firstName:""} onChange={onChange} error={errors.firstName}/>

      <TextInput name="lastName" label="lastName" value={player.lastName?player.lastName:""} onChange={onChange} error={errors.lastName}/>

      <TextInput name="birthday" label="birthday" value={player.birthday?player.birthday:""} onChange={onChange} error={errors.birthday}/>

      <TextInput name="email" label="email" value={player.email?player.email:""} onChange={onChange} error={errors.email}/>

      <input type="submit" disabled={saving} value={saving
        ? 'Saving...'
        : 'Save'} className="btn btn-primary" onClick={onSave}/>
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
