import React from 'react';
import { withStyles } from '@material-ui/core';

const RepostIcon = ({ classes, highlighted }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="18.2 25.4 39.6 25.2"
      enableBackground="new 18.2 25.4 39.6 25.2"
      xmlSpace="preserve"
      className={classes.repostIcon}
    >
      <path fill={highlighted ? '#00AF75' : '#848484'} d="M57,40h-6V28.25c0-0.785-0.967-1.25-1.75-1.25H35l4,4h7v9h-6l8.5,9 M26.75,49C25.967,49,25,48.535,25,47.75  V36h-6l8.5-9l8.5,9h-6l-0.065,8.963h6.442L41,49H26.75z" />
    </svg>
  );
};

const styles = () => ({
  repostIcon: {
    width: '1.5em',
    height: '1.2em',
  },
});

export default withStyles(styles)(RepostIcon);
