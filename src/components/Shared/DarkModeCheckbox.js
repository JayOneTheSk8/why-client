import React, { useState } from 'react';
import { withStyles } from '@material-ui/core';

import constants from '../../constants';
import { dispatchEvent } from '../../util';

import SunIcon from './SunIcon';
import MoonIcon from './MoonIcon';

const {
  general: {
    eventTypes: {
      DARK_MODE_EVENT,
    },
    fields: {
      DARK_MODE_CHECKBOX,
    },
  },
  util: {
    tokens: {
      DARK_MODE_ACTIVE,
    },
  },
} = constants;

const DarkModeCheckbox = ({ classes }) => {
  const [darkModeActive, setDarkModeActive] = useState(!!localStorage.getItem(DARK_MODE_ACTIVE));

  const handleDarkModeChange = (e) => {
    dispatchEvent(DARK_MODE_EVENT, { darkMode: e.target.checked });
    setDarkModeActive(e.target.checked);
  };

  return (
    <label
      htmlFor={DARK_MODE_CHECKBOX}
      className={classes.checkboxLabel}
    >
      {
        darkModeActive
          ? <SunIcon />
          : <MoonIcon />
      }
      <input
        id={DARK_MODE_CHECKBOX}
        type="checkbox"
        onChange={handleDarkModeChange}
        checked={darkModeActive}
        className={classes.checkboxInput}
      />
    </label>
  );
};

const styles = () => ({
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
  },
  checkboxInput: {
    width: '1.5em',
    height: '1.5em',
    marginLeft: '0.5em',
  },
});

export default withStyles(styles)(DarkModeCheckbox);
