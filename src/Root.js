import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { withStyles } from '@material-ui/core';

import constants from './constants';
import { AuthRoutes } from './routes';
import { AuthContext } from './authContext';
import { useOnClickOutsideRef, useWindowDimensions } from './hooks';
import { axiosInstance } from './axiosInstance';
import { dispatchEvent } from './util';

import FrontPage from './components/FrontPage';
import Sidebar from './components/Sidebar';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import CommentPage from './components/MessagePages/CommentPage';
import PostPage from './components/MessagePages/PostPage';
import ProfilePage from './components/ProfilePage';
import FollowersPage from './components/FollowPages/FollowersPage';
import FollowingPage from './components/FollowPages/FollowingPage';
import SearchPage from './components/SearchPage';

import SearchBar from './components/SearchPage/SearchBar';

import LoadingModal from './components/Shared/LoadingModal';
import WhyCon from './components/Shared/WhyCon';
import DarkModeCheckbox from './components/Shared/DarkModeCheckbox';

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
      commentPage,
      homePage,
      postPage,
      root,
      signIn,
      signUp,
      search,
      usersPage,
      followers,
      following,
    },
    backend: {
      logOut,
      sessions,
    },
  },
  general: {
    eventTypes: {
      RESIZE_BORDER_EXTENSION,
    },
    fieldTexts: {
      usernameWithSymbol,
    },
  },
  util: {
    limits: {
      MOBILE_VIEW_PIXEL_LIMIT,
    },
    tokens: {
      CURRENT_USER,
    },
  },
} = constants;

const Root = ({ classes }) => {
  const context = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { width } = useWindowDimensions();

  const isLoggedIn = !!localStorage.getItem(CURRENT_USER);

  const [isLoggingInUser, setIsLoggingInUser] = useState(false);
  const [accountMenuDisplayed, setAccountMenuDisplayed] = useState(false);
  const [mobileView, setMobileView] = useState(false);

  const clickRef = useOnClickOutsideRef(() => accountMenuDisplayed && setAccountMenuDisplayed(false));
  const borderExtensionRef = useRef(null);

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
      setIsLoggingInUser(true);

      axiosInstance.get(sessions)
        .then((res) => context.login(res.data))
        .catch((err) => {
          if (err.response) {
            const { response } = err;

            if (response.status === 404) {
              logoutUser();
            }
          }
        })
        .finally(() => setIsLoggingInUser(false));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handler = () => {
      if (borderExtensionRef.current) {
        const { current: borderExtension } = borderExtensionRef;

        borderExtension.style.height = '100vh';
        const newHeight = borderExtension.clientHeight - borderExtension.previousSibling.clientHeight;
        borderExtension.style.height = `${(newHeight > 0 ? newHeight : 0) + 1}px`;
      }
    };

    window.addEventListener(RESIZE_BORDER_EXTENSION, handler);

    return () => window.removeEventListener(RESIZE_BORDER_EXTENSION, handler);
  }, [borderExtensionRef, classes]);

  useEffect(() => {
    dispatchEvent(RESIZE_BORDER_EXTENSION);

    if (width < MOBILE_VIEW_PIXEL_LIMIT) {
      setMobileView(true);
    } else {
      setMobileView(false);
    }
  }, [width]);

  return (
    <div className={classes.root}>
      {isLoggingInUser && <LoadingModal />}

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
                <div
                  className={`${classes.userInfo} ${accountMenuDisplayed ? classes.userInfoHighlighted : ''}`}
                  onClick={() => setAccountMenuDisplayed(!accountMenuDisplayed)}
                  ref={clickRef}
                >
                  <div className={classes.userIcon}>{context.displayName && context.username[0].toUpperCase()}</div>

                  {
                    mobileView ||
                      <>
                        <div className={classes.namesContainer}>
                          <div className={classes.displayName}>{context.displayName}</div>
                          <div className={classes.username}>{usernameWithSymbol(context.username)}</div>
                        </div>

                        <div className={classes.accountMenuIcon}>...</div>
                      </>
                  }

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

      <div className={mobileView ? classes.mobileCenterPanel : classes.centerPanel}>
        <Routes>
          <Route exact path={root} Component={FrontPage} />
          <Route path={homePage} Component={FrontPage} />
          <Route path={`${commentPage}/:id`} Component={CommentPage} />
          <Route path={`${postPage}/:id`} Component={PostPage} />
          <Route path={`${usersPage}/:username`} Component={ProfilePage} />
          <Route path={`${usersPage}/:username${followers}`} Component={FollowersPage} />
          <Route path={`${usersPage}/:username${following}`} Component={FollowingPage} />
          <Route path={search} Component={SearchPage} />

          <Route element={AuthRoutes(isLoggedIn)}>
            <Route path={signIn} Component={SignIn} />
            <Route path={signUp} Component={SignUp} />
          </Route>
        </Routes>
        <div className={classes.borderExtension} ref={borderExtensionRef}></div>
      </div>

      {
        mobileView ||
          <div className={classes.rightPanel}>
            {
              location.pathname !== search &&
                <div className={classes.searchBar}>
                  <SearchBar fromPage={'Root'} />
                </div>
            }

            <div className={classes.darkModeCheckboxContainer}>
              <DarkModeCheckbox />
            </div>
          </div>
      }
    </div>
  );
};

const styles = theme => ({
  '@global': {
    body: {
      overflowY: 'scroll',
      backgroundColor: theme.palette.primary.background,
      color: theme.palette.primary.text,
    }
  },
  root: {
    display: 'flex',
  },
  centerPanel: {
    width: theme.centerPanel.width,
    marginLeft: '25vw',
  },
  mobileCenterPanel: {
    width: theme.centerPanel.mobileWidth,
    marginLeft: '25vw',
    borderRight: `1px solid ${theme.palette.primary.border}`,
  },
  leftPanel: {
    width: '25vw',
    height: '100vh',
    borderRight: `1px solid ${theme.palette.primary.border}`,
    position: 'fixed',
    left: 0,
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: '1em',
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
    padding: '0.5em',
    borderRadius: '60px',
    alignItems: 'center',
    display: 'flex',
    cursor: 'pointer',
    width: '16em',
    height: '6em',
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: theme.palette.primary.hover,
    },
  },
  userInfoHighlighted: {
    backgroundColor: theme.palette.primary.hover,
  },
  userIcon: {
    fontSize: '3em',
    color: 'white',
    margin: '0.1em',
    border: '3px solid grey',
    backgroundColor: 'black',
    borderRadius: '54%',
    height: '1.5em',
    width: '1.5em',
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
    border: `1px solid ${theme.palette.primary.border}`,
    borderRadius: '12px',
    padding: '5px',
    background: theme.palette.primary.background,
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
    '&:hover': {
      backgroundColor: theme.palette.primary.hover,
    },
  },
  accountMenuOuterArrow: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: '-1em',
    width: 0,
    height: 0,
    borderLeft: '1em solid transparent',
    borderRight: '1em solid transparent',
    borderTop: `1em solid ${theme.palette.primary.border}`,
  },
  accountMenuInnerArrow: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: '-0.9em',
    width: 0,
    height: 0,
    borderLeft: '1em solid transparent',
    borderRight: '1em solid transparent',
    borderTop: `1em solid ${theme.palette.primary.background}`,
  },
  authButtons: {
    display: 'flex',
    flexDirection: 'column',
  },
  authButton: {
    width: '10em',
    border: `1px solid ${theme.palette.secondary.border}`,
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
  borderExtension: {
    width: '100%',
    height: '100vh',
    borderRight: `1px solid ${theme.palette.primary.border}`,
    borderTop: `1px solid ${theme.palette.primary.border}`,
  },
  darkModeCheckboxContainer: {
    marginTop: '1em',
  },
  searchBar: {
    width: '90%',
    marginTop: '1em',
  },
});

export default withStyles(styles)(Root);
