import React from 'react';
import { useNavigate } from 'react-router-dom';
import { withStyles } from '@material-ui/core';

const BackIcon = ({ classes, endpointOverride }) => {
  const navigate = useNavigate();

  return (
    <svg onClick={() => navigate(endpointOverride || -1)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" className={classes.backIcon}>
      <path d="M224 480h640a32 32 0 110 64H224a32 32 0 010-64z" />
      <path d="M237.248 512l265.408 265.344a32 32 0 01-45.312 45.312l-288-288a32 32 0 010-45.312l288-288a32 32 0 1145.312 45.312L237.248 512z" />
    </svg>
  );
};

const styles = () => ({
  backIcon: {
    width: '2em',
    height: '2em',
    cursor: 'pointer',
  },
});

export default withStyles(styles)(BackIcon);
