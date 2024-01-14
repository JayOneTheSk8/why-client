import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { withStyles } from '@material-ui/core';

import constants from './constants';
import withMuiTheme from './withMuiTheme';

import FrontPage from './components/FrontPage';

const {
  endpoints,
} = constants;

const Root = ({ classes }) => {
  return (
    <div className={classes.root}>
      <div className={classes.leftPanel}>LEFT</div>

      <div className={classes.centerPanel}>
        <Router>
          <Routes>
            <Route exact path={endpoints.root} Component={FrontPage} />
            <Route exact path={endpoints.homePage} Component={FrontPage} />
          </Routes>
        </Router>
      </div>

      <div className={classes.rightPanel}>RIGHT</div>
    </div>
  );
};

const styles = () => ({
  '@global': {
    body: {
      overflowY: 'scroll',
    }
  },
  root: {
    display: 'flex',
  },
  centerPanel: {
    width: '50vw',
    marginLeft: '25vw',
  },
  leftPanel: {
    width: '25vw',
    height: '100vh',
    borderRight: '1px solid grey',
    position: 'fixed',
    left: 0,
  },
  rightPanel: {
    width: '21vw',
    height: '100vh',
    position: 'fixed',
    right: 0,
  },
});

export default withStyles(styles)(withMuiTheme(Root));
