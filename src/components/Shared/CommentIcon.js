import React from 'react';
import { withStyles } from '@material-ui/core';

const CommentIcon = ({ classes, highlighted, width, height }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="2.42 2.64 18.72 18.72"
      className={classes.commentIcon}
      width={width || '1.2em'}
      height={height || '1.2em'}
    >
      <path fill={highlighted ? '#1D9BF0' : '#848484'} d="M4.592,15.305C2.344,9.787,6.403,3.75,12.361,3.75h0.321c4.456,0,8.068,3.612,8.068,8.067  c0,4.961-4.021,8.982-8.982,8.982h-7.82c-0.318,0-0.602-0.2-0.708-0.501c-0.105-0.301-0.01-0.635,0.238-0.834l1.972-1.583  c0.086-0.069,0.117-0.187,0.075-0.289L4.592,15.305z M12.361,5.25c-4.893,0-8.226,4.958-6.38,9.488l0.932,2.289  c0.292,0.717,0.079,1.539-0.524,2.024L6.079,19.3h5.688c4.133,0,7.482-3.35,7.482-7.482c0-3.627-2.94-6.567-6.568-6.567H12.361z" />
    </svg>
  );
};

const styles = () => ({
  commentIcon: {

  },
});

export default withStyles(styles)(CommentIcon);
