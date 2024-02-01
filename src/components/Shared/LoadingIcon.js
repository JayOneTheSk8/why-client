import React from 'react';
import { withStyles } from '@material-ui/core';

const LoadingIcon = ({ classes }) => {
  return (
    <svg className={classes.loadingIcon} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="32" strokeWidth="8" stroke="#1d9bf0" strokeDasharray="50.26548245743669 50.26548245743669" fill="none" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="0 50 50;360 50 50" />
      </circle>
    </svg>
  );
};

const styles = () => ({
  loadingIcon: {
    width: '4em',
    height: '4em',
  },
});

export default withStyles(styles)(LoadingIcon);
