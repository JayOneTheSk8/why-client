import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { withStyles } from '@material-ui/core';

import constants from '../../constants';
import { AuthContext } from '../../authContext';
import { axiosInstance } from '../../axiosInstance';

const {
  endpoints,
  components: {
    profilePage: {
      FOLLOWING,
      FOLLOW,
    },
    profileItem: {
      FOLLOWS_YOU,
      UNFOLLOW,
    },
  },
  errors: {
    keys: {
      GENERAL_ERROR,
    },
  },
  general: {
    fieldTexts:{
      usernameWithSymbol,
    },
  },
} = constants;

const ProfileItem = ({ classes, user }) => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  const [isFollowing, setIsFollowing] = useState(false);
  const [highlightUnfollow, setHighlightUnfollow] = useState(false);
  const [currentUserFollowing, setCurrentUserFollowing] = useState(user.current_user_following);
  const [errors, setErrors] = useState({});

  const handleFollow = (e) => {
    e.stopPropagation();
    if (isFollowing) { return; }

    setIsFollowing(true);
    setErrors({});

    if (currentUserFollowing) {
      axiosInstance.delete(endpoints.backend.follows, {
        params: {
          follow: {
            followee_id: user.id
          }
        }
      })
        .then(() => setCurrentUserFollowing(false))
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
        .finally(() => setIsFollowing(false));
    } else {
      axiosInstance.post(endpoints.backend.follows, {
        follow: {
          followee_id: user.id
        }
      })
        .then(() => setCurrentUserFollowing(true))
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
        .finally(() => setIsFollowing(false));
    }
  };

  return (
    <div className={classes.profileItem} onClick={() => navigate(endpoints.frontend.userPage(user.username))}>
      <div className={classes.profileInfo}>
        <div className={classes.userIconContainer}>
          <div className={classes.userIcon}>
            {user.username[0].toUpperCase()}
          </div>
        </div>

        <div className={classes.userInfo}>
          <div className={classes.displayName}>{user.display_name}</div>
          <div className={classes.username}>
            {usernameWithSymbol(user.username)}
            {
              user.following_current_user &&
                <div className={classes.followsYouSpan}>{FOLLOWS_YOU}</div>
            }
          </div>

          {
            errors[GENERAL_ERROR] &&
            <div className={classes.errorContainer}>
              <div className={classes.labelError}>{errors[GENERAL_ERROR]}</div>
            </div>
          }
        </div>
      </div>

      {
        user.username !== context.username &&
          <div
            className={
              currentUserFollowing
                ? (
                  highlightUnfollow
                    ? classes.unfollowButton
                    : classes.followingButton
                )
                : classes.followButton
            }
            onMouseEnter={() => currentUserFollowing && setHighlightUnfollow(true)}
            onMouseLeave={() => currentUserFollowing && highlightUnfollow && setHighlightUnfollow(false)}
            onClick={handleFollow}
          >
            {
              currentUserFollowing
                ? (
                  highlightUnfollow
                    ? UNFOLLOW
                    : FOLLOWING
                )
                : FOLLOW
            }
          </div>
      }
    </div>
  );
};

const styles = () => ({
  labelError: {
    color: 'red',
  },
  errorContainer: {

  },
  profileItem: {
    borderRight: '1px solid black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1em',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#dfdfdf',
    },
  },
  profileInfo: {
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  userIconContainer: {

  },
  userIcon: {
    fontSize: '1.7em',
    color: 'white',
    backgroundColor: 'black',
    padding: '0.3em',
    borderRadius: '55%',
    height: '2em',
    width: '2em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '0.5em',
  },
  userInfo: {

  },
  displayName: {
    fontSize: '1.3em',
    fontWeight: 600,
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  username: {
    display: 'flex',
    alignItems: 'center',
  },
  followsYouSpan: {
    marginLeft: '0.3em',
    fontWeight: 600,
    color: '#6D7277',
    backgroundColor: '#cbcbcb',
    padding: '0.2em',
  },
  followingButton: {
    border: '1px solid grey',
    backgroundColor: 'black',
    color: 'white',
    borderRadius: '3em',
    padding: '0.5em',
    fontSize: '1.1em',
    fontWeight: 600,
    width: '6em',
    textAlign: 'center',
  },
  unfollowButton: {
    border: '1px solid red',
    backgroundColor: 'rgb(255, 173, 173, 0.8)',
    color: 'red',
    borderRadius: '3em',
    padding: '0.5em',
    fontSize: '1.1em',
    fontWeight: 600,
    width: '6em',
    textAlign: 'center',
  },
  followButton: {
    border: '1px solid black',
    borderRadius: '3em',
    padding: '0.5em',
    fontSize: '1.1em',
    fontWeight: 600,
    width: '6em',
    textAlign: 'center',
  },
});

export default withStyles(styles)(ProfileItem);