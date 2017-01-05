/**
* @Author: Stijn Van Hulle <stijnvanhulle>
* @Date:   2016-12-05T14:31:57+01:00
* @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-12-29T22:37:33+01:00
* @License: stijnvanhulle.be
*/

import {Input} from 'semantic-ui-react'
import React, {Component, PropTypes} from 'react';

const TextInput = ({
  name,
  label,
  onChange,
  placeholder,
  value,
  error,
  type,
  required
}) => {
  let wrapperClass = `form-group`;
  if (error && error.length > 0) {
    wrapperClass += ` ` + `has-error`;
  }
  if (!type)
    type = `text`;

  if (required) {
    required = `required`;
  } else {
    required = ``;
  }
  if (!placeholder) {
    placeholder = label;
  }

  return (
    <div className={wrapperClass}>
      <label htmlFor={name}>{label}</label>
      <div className='field'>
        <Input required={required} type={type} name={name} placeholder={placeholder} value={value} onChange={onChange}/> {error && <p className='alert alert-danger'>{error}</p>}
      </div>
    </div>
  );
};

TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  type: PropTypes.string,
  error: PropTypes.string
};

export default TextInput;
