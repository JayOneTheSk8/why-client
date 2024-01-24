import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { withStyles } from '@material-ui/core';

import constants from './constants';
import withMuiTheme from './withMuiTheme';
import { AuthRoutes } from './routes';
import { AuthContext } from './authContext';
import { useOnClickOutsideRef } from './hooks';
import { axiosInstance } from './axiosInstance';

import FrontPage from './components/FrontPage';
import Sidebar from './components/Sidebar';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import WhyCon from './components/Shared/WhyCon';

const {
  components: {
    auth: {
      LOG_IN,
      SIGN_UP,
    },
    accountMenu: {
      logoutText,
    },
  },
  endpoints: {
    frontend: {
      homePage,
      root,
      signIn,
      signUp,
    },
    backend: {
      logOut,
      sessions,
    },
  },
  util: {
    tokens: {
      CURRENT_USER,
    },
  },
} = constants;

const Root = ({ classes }) => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem(CURRENT_USER);

  const [accountMenuDisplayed, setAccountMenuDisplayed] = useState(false);

  const clickRef = useOnClickOutsideRef(() => accountMenuDisplayed && setAccountMenuDisplayed(false));

  const logoutUser = useCallback(() => {
    // Attempt server logout; regardless of outcome, logout in auth context and refresh page
    axiosInstance.get(logOut)
      .finally(() => {
        context.logout();
        window.location.reload();
      });
  }, [context]);

  useEffect(() => {
    if (isLoggedIn) {
      axiosInstance.get(sessions)
        .then((res) => context.login(res.data))
        .catch((err) => {
          if (err.response) {
            const { response } = err;

            if (response.status === 404) {
              logoutUser();
            }
          }
        });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={classes.root}>
      <div className={classes.leftPanel}>
        <div className={classes.leftPanelSeparator}></div>

        <div className={classes.leftPanelDetails}>
          <div className={classes.rootWhyCon} onClick={() => navigate(homePage)}>
            <WhyCon />
          </div>
          <Sidebar />
          {
            (
              isLoggedIn &&
              context.displayName &&
              context.username
            )
              ? <>
                <div className={classes.userInfo} onClick={() => setAccountMenuDisplayed(!accountMenuDisplayed)} ref={clickRef}>
                  <div className={classes.userIcon}>{context.displayName && context.displayName[0].toUpperCase()}</div>

                  <div className={classes.namesContainer}>
                    <div className={classes.displayName}>{context.displayName}</div>
                    <div className={classes.username}>{`¿${context.username}`}</div>
                  </div>

                  <div className={classes.accountMenuIcon}>...</div>

                  <div className={classes.accountMenuContainer}>
                    {
                      <div
                        className={
                          accountMenuDisplayed
                            ? classes.accountMenu
                            : classes.hiddenAccountMenu
                        }
                      >
                        <div className={classes.accountMenuItem} onClick={logoutUser}>{logoutText(context.username)}</div>
                        <div className={classes.accountMenuOuterArrow}></div>
                        <div className={classes.accountMenuInnerArrow}></div>
                      </div>
                    }
                  </div>
                </div>
              </>
              : <>
                <div className={classes.authButtons}>
                  <div className={classes.authButton} onClick={() => navigate(signIn)}>{LOG_IN}</div>
                  <div className={classes.authButton} onClick={() => navigate(signUp)}>{SIGN_UP}</div>
                </div>
              </>
          }
        </div>
      </div>

      <div className={classes.centerPanel}>
        <Routes>
          <Route exact path={root} Component={FrontPage} />
          <Route path={homePage} Component={FrontPage} />

          <Route element={AuthRoutes(isLoggedIn)}>
            <Route path={signIn} Component={SignIn} />
            <Route path={signUp} Component={SignUp} />
          </Route>
        </Routes>
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
    display: 'flex',
    justifyContent: 'space-between',
  },
  leftPanelSeparator: {

  },
  leftPanelDetails: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  rootWhyCon: {
    marginTop: '1em',
    width: 'max-content',
    cursor: 'pointer',
  },
  rightPanel: {
    width: '21vw',
    height: '100vh',
    position: 'fixed',
    right: 0,
  },
  userInfo: {
    marginBottom: '1em',
    marginRight: '1em',
    border: '1px solid black',
    padding: '0.5em',
    borderRadius: '60px',
    alignItems: 'center',
    display: 'flex',
    cursor: 'pointer',
    width: '16em',
    height: '6em',
  },
  userIcon: {
    fontSize: '3em',
    color: 'white',
    margin: '0.1em',
    border: '1px solid grey',
    backgroundColor: 'black',
    borderRadius: '54%',
    height: '1.5em',
    width: '2em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  namesContainer: {
    marginLeft: '0.6em'
  },
  displayName: {
    fontSize: '1.2em',
    fontWeight: '600',
    width: '6.5em',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  username: {
    fontSize: '1em',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    width: '7.7em',
  },
  accountMenuIcon: {
    fontWeight: 'bold',
    fontSize: '1.7em',
    marginBottom: '0.4em',
    marginLeft: '0.1em',
  },
  accountMenu: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    right: '16.3em',
    bottom: '6.5em',
    border: '1px solid black',
    borderRadius: '12px',
    padding: '5px',
    background: 'white',
    width: '19em',
  },
  accountMenuContainer: {
    width: 0, // Prevents from taking up space
  },
  hiddenAccountMenu: {
    display: 'none',
  },
  accountMenuItem: {
    fontSize: '1.3em',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    padding: '10px',
    borderRadius: '7px',
  },
  accountMenuOuterArrow: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: '-1em',
    width: 0,
    height: 0,
    borderLeft: '1em solid transparent',
    borderRight: '1em solid transparent',
    borderTop: '1em solid black',
  },
  accountMenuInnerArrow: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: '-0.9em',
    width: 0,
    height: 0,
    borderLeft: '1em solid transparent',
    borderRight: '1em solid transparent',
    borderTop: '1em solid white',
  },
  authButtons: {
    display: 'flex',
    flexDirection: 'column',
  },
  authButton: {
    width: '10em',
    border: '1px solid black',
    cursor: 'pointer',
    height: '2em',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '1em',
    borderRadius: '60px',
    marginBottom: '1em',
    fontSize: '1.5em',
    fontWeight: 600,
  },
});

export default withStyles(styles)(withMuiTheme(Root));
