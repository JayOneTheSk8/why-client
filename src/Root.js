import React from 'react';
import { withStyles } from '@material-ui/core';

import withMuiTheme from './withMuiTheme';

const Root = ({ classes }) => {
  return (
    <div className={classes.root}>
      HOME PAGE
    </div>
  );
};

const styles = () => ({
  root: {}
});

export default withStyles(styles)(withMuiTheme(Root));
