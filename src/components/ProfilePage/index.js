import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { withStyles } from '@material-ui/core';

import constants from '../../constants';
import { AuthContext } from '../../authContext';
import { axiosInstance } from '../../axiosInstance';
import { dispatchEvent } from '../../util';

import BackIcon from '../Shared/BackIcon';
import CalendarIcon from '../Shared/CalendarIcon';
import PostItem from '../Shared/PostItem';
import LoadingIcon from '../Shared/LoadingIcon';

import EditProfile from './EditProfile';

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
      POSTS,
      REPLIES,
      LIKES,
      joinedAt,
      noPostsText,
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
      REFRESH,
      usernameWithSymbol,
    },
    postTypes: {
      COMMENT,
      COMMENT_LIKE,
      COMMENT_REPOST,
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
  const [showEditProfile, setShowEditProfile] = useState(false);

  const [selectedProfileContentTab, setSelectedProfileContentTab] = useState(POSTS);

  const [fetchingLinkedPosts, setFetchingLinkedPosts] = useState(true);
  const [fetchingLinkedComments, setFetchingLinkedComments] = useState(false);
  const [fetchingLikes, setFetchingLikes] = useState(false);

  const [linkedPostsData, setLinkedPostsData] = useState({});
  const [linkedCommentsData, setLinkedCommentsData] = useState({});
  const [likesData, setLikesData] = useState({});

  const [linkedPostsErrors, setLinkedPostsErrors] = useState({});
  const [linkedCommentsErrors, setLinkedCommentsErrors] = useState({});
  const [likesErrors, setLikesErrors] = useState({});

  useEffect(() => getData(username), [username]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(
    () => dispatchEvent(RESIZE_BORDER_EXTENSION),
    [
      isLoading,
      fetchingLinkedPosts,
      fetchingLinkedComments,
      fetchingLikes,
      selectedProfileContentTab,
    ]
  );

  const getData = (username) => {
    setIsLoading(true);
    setErrors({});

    axiosInstance.get(endpoints.backend.userData(username))
      .then((res) => {
        setData(res.data);
        setCurrentUserFollowing(res.data.current_user_following);

        getPosts(
          endpoints.backend.linkedPosts(res.data.id),
          setLinkedPostsData,
          setLinkedPostsErrors,
          setFetchingLinkedPosts,
          linkedPostsErrors,
          POSTS
        );
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

  const postList = (posts, postType) => {
    if (posts.length === 0) {
      return (
        <div className={classes.noPostsSpan}>
          {noPostsText(postType)}
        </div>
      );
    }

    return posts.map((post, idx) => {
      return (
        <PostItem
          key={`ProfilePage${postType}${idx}`}
          withoutRightBorder
          post={post}
          isComment={
            [COMMENT, COMMENT_REPOST].includes(post.post_type)
              || post.like_type === COMMENT_LIKE
          }
        />
      );
    });
  };

  const getPosts = (endpoint, dataFunc, dataErrorsFunc, dataLoadingFunc, dataErrorsState, postType) => {
    dataLoadingFunc(true);
    setSelectedProfileContentTab(postType);
    dataErrorsFunc({});

    axiosInstance.get(endpoint)
      .then((res) => {
        dataFunc(res.data);
      })
      .catch(err => {
        if (err.response) {
          const { data: errorData } = err.response;

          if (errorData.errors) {
            dataErrorsFunc({ ...dataErrorsState, [GENERAL_ERROR]: errorData.errors.join(', ') });
          } else {
            dataErrorsFunc({ ...dataErrorsState, [GENERAL_ERROR]: err.message });
          }
        } else {
          dataErrorsFunc({ ...dataErrorsState, [GENERAL_ERROR]: err.message });
        }
      })
      .finally(() => dataLoadingFunc(false));
  };

  const postsByTab = () => {
    switch (selectedProfileContentTab) {
      case POSTS:
        return postList(linkedPostsData.posts, POSTS);
      case REPLIES:
        return postList(linkedCommentsData.comments, REPLIES);
      case LIKES:
        return postList(likesData.likes, LIKES);
      default:
        break;
    }
  };

  const handleLinkedPosts = () => {
    if (selectedProfileContentTab !== POSTS && !fetchingLinkedPosts) {
      getPosts(
        endpoints.backend.linkedPosts(data.id),
        setLinkedPostsData,
        setLinkedPostsErrors,
        setFetchingLinkedPosts,
        linkedPostsErrors,
        POSTS
      );
    }
  };

  const handleLinkedComments = () => {
    if (selectedProfileContentTab !== REPLIES && !fetchingLinkedComments) {
      getPosts(
        endpoints.backend.linkedComments(data.id),
        setLinkedCommentsData,
        setLinkedCommentsErrors,
        setFetchingLinkedComments,
        linkedCommentsErrors,
        REPLIES
      );
    }
  };

  const handleLikes = () => {
    if (selectedProfileContentTab !== LIKES && !fetchingLikes) {
      getPosts(
        endpoints.backend.likes(data.id),
        setLikesData,
        setLikesErrors,
        setFetchingLikes,
        likesErrors,
        LIKES
      );
    }
  };

  const dateFormat = new Intl.DateTimeFormat(
    'en-US',
    {
      month: 'long',
      year: 'numeric',
    }
  ).format;

  if (isLoading) return <div className={classes.loadingIcon}>
    <LoadingIcon />
  </div>;

  if (errors[GENERAL_ERROR]) return <div className={classes.errorsContainer}>
    <div className={classes.errorsHeader}>{errors[GENERAL_ERROR]}</div>
    <div className={classes.refreshPage} onClick={() => getData(username)}>{REFRESH}</div>
  </div>;

  return (
    <div className={classes.profilePage}>
      {
        showEditProfile &&
          <EditProfile closeFunction={setShowEditProfile} />
      }

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
                    ? <div
                      className={classes.editProfileButton}
                      onClick={() => setShowEditProfile(true)}
                    >
                      {EDIT_PROFILE}
                    </div>
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
          <div className={classes.profileContentContainer}>
            <div className={classes.profileContentNavbar}>
              <div
                className={
                  `${
                    classes.profileContentOptionContainer
                  } ${
                    selectedProfileContentTab === POSTS
                      ? classes.selectedProfileContentOptionContainer
                      : ''
                  }`
                }
                onClick={handleLinkedPosts}
              >
                <div className={classes.profileContentOption}>{POSTS}</div>
                {
                  selectedProfileContentTab === POSTS &&
                    <div className={classes.selectedProfileContent}></div>
                }
              </div>

              <div
                className={
                  `${
                    classes.profileContentOptionContainer
                  } ${
                    selectedProfileContentTab === REPLIES
                      ? classes.selectedProfileContentOptionContainer
                      : ''
                  }`
                }
                onClick={handleLinkedComments}
              >
                <div className={classes.profileContentOption}>{REPLIES}</div>
                {
                  selectedProfileContentTab === REPLIES &&
                    <div className={classes.selectedProfileContent}></div>
                }
              </div>

              <div
                className={
                  `${
                    classes.profileContentOptionContainer
                  } ${
                    selectedProfileContentTab === LIKES
                      ? classes.selectedProfileContentOptionContainer
                      : ''
                  }`
                }
                onClick={handleLikes}
              >
                <div className={classes.profileContentOption}>{LIKES}</div>
                {
                  selectedProfileContentTab === LIKES &&
                    <div className={classes.selectedProfileContent}></div>
                }
              </div>
            </div>

            <div className={classes.profileContent}>
              {
                !linkedPostsErrors[GENERAL_ERROR]
                  && !linkedCommentsErrors[GENERAL_ERROR]
                  && !likesErrors[GENERAL_ERROR]
                  && !fetchingLinkedPosts
                  && !fetchingLinkedComments
                  && !fetchingLikes
                  && postsByTab()
              }

              {
                selectedProfileContentTab === POSTS
                  && fetchingLinkedPosts
                  && <div className={classes.postLoadingIcon}>
                    <LoadingIcon />
                  </div>
              }

              {
                selectedProfileContentTab === REPLIES
                  && fetchingLinkedComments
                  && <div className={classes.postLoadingIcon}>
                    <LoadingIcon />
                  </div>
              }

              {
                selectedProfileContentTab === LIKES
                  && fetchingLikes
                  && <div className={classes.postLoadingIcon}>
                    <LoadingIcon />
                  </div>
              }

              {
                selectedProfileContentTab === POSTS
                  && linkedPostsErrors[GENERAL_ERROR]
                  && <div className={classes.postErrorContainer}>
                    <div className={classes.postError}>{linkedPostsErrors[GENERAL_ERROR]}</div>
                    <div
                      className={classes.refreshPage}
                      onClick={() => {
                        getPosts(
                          endpoints.backend.linkedPosts(data.id),
                          setLinkedPostsData,
                          setLinkedPostsErrors,
                          setFetchingLinkedPosts,
                          linkedPostsErrors,
                          POSTS
                        );
                      }}
                    >
                      {REFRESH}
                    </div>
                  </div>
              }

              {
                selectedProfileContentTab === REPLIES
                  && linkedCommentsErrors[GENERAL_ERROR]
                  && <div className={classes.postErrorContainer}>
                    <div className={classes.postError}>{linkedCommentsErrors[GENERAL_ERROR]}</div>
                    <div
                      className={classes.refreshPage}
                      onClick={() => {
                        getPosts(
                          endpoints.backend.linkedComments(data.id),
                          setLinkedCommentsData,
                          setLinkedCommentsErrors,
                          setFetchingLinkedComments,
                          linkedCommentsErrors,
                          REPLIES
                        );
                      }}
                    >
                      {REFRESH}
                    </div>
                  </div>
              }

              {
                selectedProfileContentTab === LIKES
                  && likesErrors[GENERAL_ERROR]
                  && <div className={classes.postErrorContainer}>
                    <div className={classes.postError}>{likesErrors[GENERAL_ERROR]}</div>
                    <div
                      className={classes.refreshPage}
                      onClick={() => {
                        getPosts(
                          endpoints.backend.likes(data.id),
                          setLikesData,
                          setLikesErrors,
                          setFetchingLikes,
                          likesErrors,
                          LIKES
                        );
                      }}
                    >
                      {REFRESH}
                    </div>
                  </div>
              }
            </div>
          </div>
      }
    </div>
  );
};

const styles = () => ({
  loadingIcon: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRight: '1px solid black'
  },
  postLoadingIcon: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
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
    zIndex: 3,
  },
  backButton: {
    marginRight: '1em',
  },
  profilePageTitle: {
    width: '40vw',
    overflow: 'hidden',
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
  profileContentContainer: {

  },
  profileContentNavbar: {
    display: 'flex',
    borderBottom: '1px solid black',
  },
  profileContentOptionContainer: {
    height: '3em',
    width: '35%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '1.5em',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: '#dfdfdf',
    },
  },
  selectedProfileContentOptionContainer: {
    fontWeight: 600,
  },
  profileContentOption: {
    padding: '0.7em',
  },
  selectedProfileContent: {
    border: '2px solid #1D9BF0',
    borderRadius: '3em',
    width: '2.5em',
  },
  profileContent: {

  },
  postError: {
    fontSize: '3em',
    color: 'red',
  },
  postErrorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  noPostsSpan: {
    borderTop: '1px solid black',
    textAlign: 'center',
    fontSize: '2em',
    color: '#8b8b8b',
    padding: '1em',
  },
});

export default withStyles(styles)(ProfilePage);
