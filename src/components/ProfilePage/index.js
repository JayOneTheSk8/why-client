import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { withStyles } from '@material-ui/core';

import constants from '../../constants';
import { AuthContext } from '../../authContext';
import { axiosInstance } from '../../axiosInstance';
import { dispatchEvent } from '../../util';

import BackIcon from '../Shared/BackIcon';
import CalendarIcon from '../Shared/CalendarIcon';

const {
  endpoints,
  components: {
    profilePage: {
      EDIT_PROFILE,
      FOLLOW,
      FOLLOWERS,
      FOLLOWING,
      NULL_ACCOUNT_SPAN,
      PROFILE,
      joinedAt,
      postCount,
    },
  },
  errors: {
    keys: {
      GENERAL_ERROR,
      USERNAME_NOT_FOUND_ERROR,
    },
  },
  general: {
    eventTypes: {
      RESIZE_BORDER_EXTENSION,
    },
    fieldTexts: {
      LOADING_,
      REFRESH,
      usernameWithSymbol,
    },
  },
} = constants;

const ProfilePage = ({ classes }) => {
  const { username } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const context = useContext(AuthContext);

  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [followErrors, setFollowErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserFollowing, setCurrentUserFollowing] = useState(false);

  useEffect(() => getData(username), [username]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => dispatchEvent(RESIZE_BORDER_EXTENSION), [isLoading]);

  const getData = (username) => {
    setIsLoading(true);
    setErrors({});

    axiosInstance.get(endpoints.backend.userData(username))
      .then((res) => {
        setData(res.data);
        setCurrentUserFollowing(res.data.current_user_following);
      })
      .catch(err => {
        window.err = err;
        if (err.response) {
          const { data: errorData, status } = err.response;

          if (status === 404) {
            setErrors({
              ...errors,
              [USERNAME_NOT_FOUND_ERROR]: {
                errorText: errorData.errors[0],
                errorSpan: NULL_ACCOUNT_SPAN,
                username,
                displayName: PROFILE,
              },
            });
          } else if (errorData.errors) {
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

  const handleFollow = () => {
    if (!context.id) { return navigate(endpoints.frontend.signIn); }

    setIsFollowing(true);
    setFollowErrors({});

    if (currentUserFollowing) {
      axiosInstance.delete(endpoints.backend.follows, {
        params: {
          follow: {
            followee_id: data.id
          }
        }
      })
        .then(() => setCurrentUserFollowing(false))
        .catch(err => {
          if (err.response) {
            const { data: errorData } = err.response;

            if (errorData.errors) {
              setFollowErrors({ ...errors, [GENERAL_ERROR]: errorData.errors.join(', ') });
            } else {
              setFollowErrors({ ...errors, [GENERAL_ERROR]: err.message });
            }
          } else {
            setFollowErrors({ ...errors, [GENERAL_ERROR]: err.message });
          }
        })
        .finally(() => setIsFollowing(false));
    } else {
      axiosInstance.post(endpoints.backend.follows, {
        follow: {
          followee_id: data.id
        }
      })
        .then(() => setCurrentUserFollowing(true))
        .catch(err => {
          if (err.response) {
            const { data: errorData } = err.response;

            if (errorData.errors) {
              setFollowErrors({ ...errors, [GENERAL_ERROR]: errorData.errors.join(', ') });
            } else {
              setFollowErrors({ ...errors, [GENERAL_ERROR]: err.message });
            }
          } else {
            setFollowErrors({ ...errors, [GENERAL_ERROR]: err.message });
          }
        })
        .finally(() => setIsFollowing(false));
    }
  };

  const dateFormat = new Intl.DateTimeFormat(
    'en-US',
    {
      month: 'long',
      year: 'numeric',
    }
  ).format;

  if (isLoading) return <div>{LOADING_}</div>;
  if (errors[GENERAL_ERROR]) return <div className={classes.errorsContainer}>
    <div className={classes.errorsHeader}>{errors[GENERAL_ERROR]}</div>
    <div className={classes.refreshPage} onClick={() => getData(username)}>{REFRESH}</div>
  </div>;

  return (
    <div className={classes.profilePage}>
      <div className={classes.profilePageNavbar}>
        <div className={classes.backButton}>
          <BackIcon />
        </div>

        <div className={classes.profilePageTitle}>
          {
            errors[USERNAME_NOT_FOUND_ERROR]
              ? <>
                <div className={classes.navbarProfileName}>{errors[USERNAME_NOT_FOUND_ERROR].displayName}</div>
              </>
              : <>
                <div className={classes.navbarDisplayName}>{data.display_name}</div>
                <div className={classes.postCount}>
                  {postCount(data.post_count)}
                </div>
              </>
          }
        </div>
      </div>

      <div className={classes.header}></div>

      <div className={classes.profileData}>
        <div className={classes.iconAndEdit}>
          {
            errors[USERNAME_NOT_FOUND_ERROR]
              ? <div className={classes.userIconContainer}>
                <div className={classes.blankUserIcon}></div>
              </div>
              : <>
                <div className={classes.userIconContainer}>
                  <div className={classes.userIcon}>{data.username[0].toUpperCase()}</div>
                </div>

                {
                  (
                    context.id &&
                    location.pathname === endpoints.frontend.userPage(context.username)
                  )
                    ? <div className={classes.editProfileButton}>{EDIT_PROFILE}</div>
                    : <div
                      className={currentUserFollowing ? classes.followedButton : classes.editProfileButton}
                      onClick={() => isFollowing || handleFollow()}
                    >
                      {currentUserFollowing ? FOLLOWING : FOLLOW}
                    </div>
                }
              </>
          }
        </div>

        {
          followErrors[GENERAL_ERROR] &&
            <div className={classes.followError}>{followErrors[GENERAL_ERROR]}</div>
        }

        <div className={classes.names}>
          {
            errors[USERNAME_NOT_FOUND_ERROR]
              ? <>
                <div className={classes.nullAccountDisplayName}>
                  {usernameWithSymbol(errors[USERNAME_NOT_FOUND_ERROR].username)}
                </div>
              </>
              : <>
                <div className={classes.displayName}>{data.display_name}</div>
                <div className={classes.username}>{usernameWithSymbol(data.username)}</div>
              </>
          }
        </div>

        {
          errors[USERNAME_NOT_FOUND_ERROR]
            ? <>
              <div className={classes.nullAccountDataInfo}>
                <div className={classes.nullAccountHeader}>{errors[USERNAME_NOT_FOUND_ERROR].errorText}</div>
                <div className={classes.nullAccountSpan}>{errors[USERNAME_NOT_FOUND_ERROR].errorSpan}</div>
              </div>
            </>
            : <>
              <div className={classes.userDataInfo}>
                <div className={classes.joinedAt}>
                  <div className={classes.calendarIcon}>
                    <CalendarIcon />
                  </div>

                  <div className={classes.joinDate}>
                    {joinedAt(dateFormat(new Date(data.created_at)))}
                  </div>
                </div>
              </div>

              <div className={classes.followCounts}>
                <div
                  className={classes.following}
                  onClick={() => navigate(endpoints.frontend.followingPage(data.username))}
                >
                  <div className={classes.followCount}>{data.following_count}</div>
                  {FOLLOWING}
                </div>

                <div
                  className={classes.followers}
                  onClick={() => navigate(endpoints.frontend.followersPage(data.username))}
                >
                  <div className={classes.followCount}>{data.follower_count}</div>
                  {FOLLOWERS}
                </div>
              </div>
            </>
        }
      </div>

      {
        !!errors[USERNAME_NOT_FOUND_ERROR] ||
          <div className={classes.profileContent}></div>
      }
    </div>
  );
};

const styles = () => ({
  errorsContainer: {
    borderRight: '1px solid black',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  errorsHeader: {
    fontSize: '3em',
    fontWeight: 600,
  },
  refreshPage: {
    fontSize: '1.2em',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  profilePage: {
    borderRight: '1px solid black',
    paddingTop: '4.5em',
  },
  profilePageNavbar: {
    width: '50vw',
    borderRight: '1px solid black',
    padding: '0.5em',
    display: 'flex',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    backgroundColor: 'rgb(250, 250, 250, 0.6)',
  },
  backButton: {
    marginRight: '1em',
  },
  profilePageTitle: {

  },
  navbarProfileName: {
    fontSize: '1.3em',
    fontWeight: 600,
  },
  navbarDisplayName: {
    fontSize: '1.3em',
    fontWeight: 600,
  },
  postCount: {

  },
  header: {
    height: '11em',
    borderBottom: '5px solid black',
    backgroundColor: '#dfdfdf',
  },
  profileData: {

  },
  iconAndEdit: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1.5em 2.5em 0.5em 2.5em',
  },
  userIconContainer: {
    width: 0,
    height: 0,
  },
  blankUserIcon: {
    color: 'white',
    fontSize: '5em',
    width: '1.5em',
    height: '1.5em',
    border: '1px solid grey',
    borderRadius: '54%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    position: 'relative',
    bottom: '1.1em',
  },
  userIcon: {
    color: 'white',
    fontSize: '5em',
    width: '1.5em',
    height: '1.5em',
    border: '1px solid grey',
    borderRadius: '54%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    position: 'relative',
    bottom: '1.1em',
  },
  editProfileButton: {
    cursor: 'pointer',
    padding: '0.3em',
    border: '1px solid black',
    borderRadius: '2em',
    fontWeight: 600,
    fontSize: '1.2em',
    width: '6em',
    textAlign: 'center',
  },
  names: {
    padding: '0.5em 0.5em 0.5em 1.7em',
    overflow: 'hidden',
  },
  nullAccountDisplayName: {
    fontSize: '1.3em',
    fontWeight: 600,
    paddingTop: '2em'
  },
  displayName: {
    fontSize: '1.3em',
    fontWeight: 600,
  },
  username: {

  },
  nullAccountDataInfo: {
    padding: '2em',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '20em',
  },
  nullAccountHeader: {
    fontSize: '2em',
    fontWeight: 600,
  },
  nullAccountSpan: {

  },
  userDataInfo: {
    padding: '0.5em 0.5em 0.5em 1.7em',
  },
  joinedAt: {
    display: 'flex',
    alignItems: 'center',
  },
  calendarIcon: {

  },
  joinDate: {

  },
  followCounts: {
    padding: '0.5em 0.5em 0.5em 1.7em',
    display: 'flex',
  },
  followCount: {
    fontWeight: 600,
    marginRight: '0.3em',
  },
  following: {
    display: 'flex',
    marginRight: '1em',
    cursor: 'pointer',
    borderBottom: '1px solid transparent',
    '&:hover': {
      borderBottom: '1px solid black',
    },
  },
  followers: {
    display: 'flex',
    cursor: 'pointer',
    borderBottom: '1px solid transparent',
    '&:hover': {
      borderBottom: '1px solid black',
    },
  },
  profileContent: {

  },
  followedButton: {
    cursor: 'pointer',
    padding: '0.3em',
    color: 'white',
    backgroundColor: 'black',
    borderRadius: '2em',
    fontWeight: 600,
    fontSize: '1.2em',
    width: '6em',
    textAlign: 'center',
    border: '1px solid grey',
  },
  followError: {
    color: 'red',
    fontSize: '1.5em',
    textAlign: 'center',
  },
});

export default withStyles(styles)(ProfilePage);
