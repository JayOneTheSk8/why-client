import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { withStyles } from '@material-ui/core';

import constants from '../../constants';
import { axiosInstance } from '../../axiosInstance';
import { useWindowDimensions } from '../../hooks';
import { dispatchEvent } from '../../util';

import BackIcon from '../Shared/BackIcon';

import ProfileItem from '../Shared/ProfileItem';
import LoadingIcon from '../Shared/LoadingIcon';

const {
  endpoints,
  components: {
    profilePage: {
      FOLLOWING,
      FOLLOWERS,
    },
    followPages: {
      NO_FOLLOWERS_TEXT,
    },
  },
  errors: {
    componentMessages: {
      errorFormat,
    },
    keys: {
      GENERAL_ERROR,
    },
  },
  general: {
    eventTypes: {
      RESIZE_BORDER_EXTENSION,
    },
    fieldTexts: {
      REFRESH,
    },
  },
  util: {
    limits: {
      MOBILE_VIEW_PIXEL_LIMIT,
    },
  },
} = constants;

const FollowersPage = ({ classes }) => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { width } = useWindowDimensions();

  const [mobileView, setMobileView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => getData(username), [username]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => dispatchEvent(RESIZE_BORDER_EXTENSION), [isLoading]);

  useEffect(() => {
    if (width < MOBILE_VIEW_PIXEL_LIMIT) {
      setMobileView(true);
    } else {
      setMobileView(false);
    }
  }, [width]);

  const getData = (username) => {
    setIsLoading(true);
    setErrors({});

    axiosInstance.get(endpoints.backend.followers(username))
      .then((res) => setData(res.data))
      .catch(err => {
        if (err.response) {
          const { data: errorData } = err.response;

          if (errorData.errors) {
            setErrors({ ...errors, [GENERAL_ERROR]: errorData.errors.join(', ') });
          } else {
            setErrors({ ...errors, [GENERAL_ERROR]: err.message });
          }
        } else {
          setErrors({ ...errors, [GENERAL_ERROR]: err.message });
        }
      })
      .finally(() => setIsLoading(false));
  };

  const profileItems = (followers) => {
    return followers.map((u, idx) => {
      return (
        <ProfileItem key={`FollowersPage${idx}`} user={u} />
      );
    });
  };

  if (Object.keys(errors).length) return <div className={classes.errorsContainer}>
    <div className={classes.errorsHeader}>{errorFormat(Object.values(errors).join(', '))}</div>
    <div className={classes.refreshPage} onClick={() => getData(username)}>{REFRESH}</div>
  </div>;

  return (
    <div className={classes.followersPage}>
      <div className={mobileView ? classes.mobileNavbar : classes.navbar}>
        {/* User Data */}
        <div className={classes.userData}>
          <div className={classes.backButton}>
            <BackIcon endpointOverride={endpoints.frontend.userPage(username)} />
          </div>

          <div className={classes.userInfo}>
            <div className={classes.navbarDisplayName}>{isLoading ? username : data.display_name}</div>
            <div className={classes.navbarUsername}>{isLoading ? username : data.username}</div>
          </div>
        </div>

        {/* Following/Followers */}
        <div className={classes.pageNavbar}>
          <div
            className={classes.followingPageLinkContainer}
            onClick={() => navigate(endpoints.frontend.followingPage(username))}
          >
            <div className={classes.followingPageLink}>{FOLLOWING}</div>
          </div>

          <div className={classes.followersPageLinkContainer}>
            <div className={classes.followersPageLink}>{FOLLOWERS}</div>
            <div className={classes.followersSelected}></div>
          </div>
        </div>
      </div>

      {
        isLoading
          ? <div className={classes.loadingIcon}>
            <LoadingIcon />
          </div>
          : data.followers.length
            ? profileItems(data.followers)
            : <div className={classes.noFollowersText}>
              {NO_FOLLOWERS_TEXT}
            </div>
      }
    </div>
  );
};

const styles = theme => ({
  followersPage: {
    paddingTop: '8.6em',
  },
  loadingIcon: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRight: `1px solid ${theme.palette.primary.border}`
  },
  errorsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '1em',
    borderRight: `1px solid ${theme.palette.primary.border}`,
  },
  errorsHeader: {
    fontSize: '2em',
    fontWeight: 600,
    textAlign: 'center',
  },
  refreshPage: {
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  navbar: {
    display: 'flex',
    flexDirection: 'column',
    width: theme.centerPanel.width,
    position: 'fixed',
    top: 0,
    backgroundColor: theme.palette.primary.navbar,
    backdropFilter: 'blur(2px)',
  },
  mobileNavbar: {
    display: 'flex',
    flexDirection: 'column',
    width: theme.centerPanel.mobileWidth,
    position: 'fixed',
    top: 0,
    backgroundColor: theme.palette.primary.navbar,
    backdropFilter: 'blur(2px)',
  },
  userData: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.5em',
    borderRight: `1px solid ${theme.palette.primary.border}`,
  },
  backButton: {
    marginRight: '1em',
  },
  userInfo: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  navbarDisplayName: {
    fontSize: '1.2em',
    fontWeight: 600,
  },
  navbarUsername: {

  },
  pageNavbar: {
    display: 'flex',
    borderBottom: `1px solid ${theme.palette.primary.border}`,
    borderRight: `1px solid ${theme.palette.primary.border}`,
  },
  followingPageLink: {
    color: theme.palette.disabled.text,
    textAlign: 'center',
    padding: '1em',
    fontSize: '1.2em',
    fontWeight: 600,
  },
  followersPageLink: {
    textAlign: 'center',
    padding: '1em',
    fontSize: '1.2em',
    fontWeight: 600,
  },
  noFollowersText: {
    borderRight: `1px solid ${theme.palette.primary.border}`,
    textAlign: 'center',
    fontSize: '2em',
    padding: '2em',
    color: '#979797',
  },
  followersPageLinkContainer: {
    width: '50%',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: theme.palette.primary.hover,
    },
  },
  followingPageLinkContainer: {
    width: '50%',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: theme.palette.primary.hover,
    },
  },
  followersSelected: {
    width: '5.6em',
    border: `2px solid ${theme.palette.blue.original}`,
    borderRadius: '15em',
  },
});

export default withStyles(styles)(FollowersPage);