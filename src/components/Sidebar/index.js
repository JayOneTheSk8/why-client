import React from 'react';
import { withStyles } from '@material-ui/core';

const Sidebar = ({ classes }) => {
  return (
    <div className={classes.sidebar}>
      SIDEBAR
    </div>
  );
};

const styles = () => ({
  sidebar: {}
});

export default withStyles(styles)(Sidebar);
