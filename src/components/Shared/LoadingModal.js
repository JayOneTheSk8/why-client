import React from 'react';
import { withStyles } from '@material-ui/core';

import LoadingIcon from './LoadingIcon';

const LoadingModal = ({ classes }) => {
  return (
    <div className={classes.loadingModal}>
      <LoadingIcon />
    </div>
  );
};

const styles = () => ({
  loadingModal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: 'rgb(0, 0, 0, 0.6)',
    zIndex: 6,
  },
});

export default withStyles(styles)(LoadingModal);
