import React, { useState } from 'react';
import { withStyles } from '@material-ui/core';

import constants from '../../constants';

import GlassesIcon from './GlassesIcon';

const {
  general: {
    fields: {
      PASSWORD,
    },
  },
} = constants;

const PasswordInput = ({ classes, id, title, changeFunc }) => {
  const [shrunkenLabel, setShrunkenLabel] = useState(false);
  const [focusedLabel, setFocusedLabel] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const shrinkLabel = (e) => {
    e.preventDefault();

    setFocusedLabel(true);
    setShrunkenLabel(true);
  };

  const expandLabel = (e) => {
    e.preventDefault();

    setFocusedLabel(false);
    if (e.target.value === '') {
      setShrunkenLabel(false);
    }
  };

  return (
    <div className={classes.passwordInputContainer}>
      <div className={classes.passwordInputLabelContainer}>
        <label
          htmlFor={id}
          className={
            `${
              shrunkenLabel ? classes.passwordInputLabelShrunk : classes.passwordInputLabel
            } ${
              focusedLabel ? classes.focusedLabel : ''
            }`
          }
        >
          {title}
        </label>
      </div>

      <input
        id={id}
        type={passwordVisible ? 'text' : PASSWORD}
        spellCheck={false}
        className={`${classes.passwordInput} ${focusedLabel ? classes.focusedInput : ''}`}
        onChange={changeFunc}
        onFocus={shrinkLabel}
        onBlur={expandLabel}
      />

      <div className={classes.passwordVisibilityButtonContainer} onClick={() => setPasswordVisible(!passwordVisible)}>
        <div className={classes.passwordVisibilityButton}>
          <GlassesIcon clear={passwordVisible} />
        </div>
      </div>
    </div>
  );
};

const styles = theme => ({
  passwordInputContainer: {
    display: 'flex',
  },
  passwordInputLabelContainer: {
    width: 0,
    height: 0,
  },
  passwordInputLabelShrunk: {
    transition: 'font-size 0.4s, top 0.4s, left 0.4s',
    color: theme.palette.primary.label.original,
    position: 'relative',
    top: '-0.2em',
    left: '0.5em',
    fontSize: '0.9em',
  },
  passwordInputLabel: {
    transition: 'font-size 0.4s, top 0.4s, left 0.4s',
    color: theme.palette.primary.label.original,
    position: 'relative',
    top: '0.5em',
    left: '0.3em',
    fontSize: '1.6em',
  },
  passwordInput: {
    fontSize: '2em',
    padding: '13px 5px 5px 5px',
    outline: 'none',
    borderRadius: '4px',
    border: `1px solid ${theme.palette.secondary.border}`,
    color: 'inherit',
    backgroundColor: theme.palette.primary.background,
    width: '100%',
  },
  focusedLabel: {
    color: theme.palette.blue.original,
  },
  focusedInput: {
    border: `1px solid ${theme.palette.blue.original}`,
  },
  passwordVisibilityButtonContainer: {
    width: 0,
    height: 0,
  },
  passwordVisibilityButton: {
    position: 'relative',
    top: '1em',
    right: '4em',
    cursor: 'pointer',
  },
});

export default withStyles(styles)(PasswordInput);
