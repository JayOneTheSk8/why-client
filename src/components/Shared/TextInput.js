import React, { useState } from 'react';
import { withStyles } from '@material-ui/core';

const TextInput = ({ classes, id, title, changeFunc, maxLength, defaultValue, reference, overrideShrinkLabel }) => {
  const [shrunkenLabel, setShrunkenLabel] = useState(overrideShrinkLabel || !!defaultValue);
  const [focusedLabel, setFocusedLabel] = useState(false);

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
    <div className={classes.textInputContainer}>
      <div className={classes.textInputLabelContainer}>
        <label
          htmlFor={id}
          className={
            `${
              (overrideShrinkLabel || shrunkenLabel) ? classes.textInputLabelShrunk : classes.textInputLabel
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
        type="text"
        spellCheck={false}
        maxLength={maxLength || ''}
        defaultValue={defaultValue || ''}
        ref={reference}
        className={`${classes.textInput} ${focusedLabel ? classes.focusedInput : ''}`}
        onChange={changeFunc}
        onFocus={shrinkLabel}
        onBlur={expandLabel}
      />
    </div>
  );
};

const styles = theme => ({
  textInputContainer: {
    display: 'flex',
  },
  textInputLabelContainer: {
    width: 0,
    height: 0,
  },
  textInputLabelShrunk: {
    transition: 'font-size 0.4s, top 0.4s, left 0.4s',
    color: theme.palette.primary.label.original,
    position: 'relative',
    top: '-0.2em',
    left: '0.5em',
    fontSize: '0.9em',
    whiteSpace: 'nowrap',
  },
  textInputLabel: {
    transition: 'font-size 0.4s, top 0.4s, left 0.4s',
    color: theme.palette.primary.label.original,
    position: 'relative',
    top: '0.5em',
    left: '0.3em',
    fontSize: '1.6em',
    whiteSpace: 'nowrap',
  },
  textInput: {
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
});

export default withStyles(styles)(TextInput);
