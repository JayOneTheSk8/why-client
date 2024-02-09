import React, { useContext, useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core';

import constants from '../../constants';
import { axiosInstance } from '../../axiosInstance';
import { AuthContext } from '../../authContext';
import { useWindowDimensions } from '../../hooks';
import { dispatchEvent } from '../../util';

import PostItem from '../Shared/PostItem';
import PostForm from '../Shared/PostForm';
import LoadingIcon from '../Shared/LoadingIcon';

const {
  endpoints,
  components: {
    frontPage: {
      FOR_YOU,
      FOLLOWING,
      noPostsText,
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
    postTypes: {
      COMMENT_REPOST,
    },
  },
  util: {
    limits: {
      MOBILE_VIEW_PIXEL_LIMIT,
    },
  },
} = constants;

const FrontPage = ({ classes }) => {
  const context = useContext(AuthContext);
  const { width } = useWindowDimensions();

  const [mobileView, setMobileView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [followingPage, setFollowingPage] = useState(false);

  const [data, setData] = useState({});
  const [followingPageData, setFollowingPageData] = useState({});

  useEffect(() => getData(true), []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => dispatchEvent(RESIZE_BORDER_EXTENSION), [followingPage, isLoading]);

  useEffect(() => {
    if (width < MOBILE_VIEW_PIXEL_LIMIT) {
      setMobileView(true);
    } else {
      setMobileView(false);
    }
  }, [width]);

  const getData = () => {
    setIsLoading(true);
    setErrors({});
    setFollowingPage(false);

    axiosInstance.get(endpoints.backend.frontPage)
      .then((res) => {
        setData(res.data);
        setIsLoading(true);
      })
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

  const getFollowedFrontPageData = () => {
    setIsLoading(true);
    setErrors({});
    setFollowingPage(true);

    axiosInstance.get(endpoints.backend.frontPageFollowing)
      .then((res) => {
        setFollowingPageData(res.data);

        // Sometimes the 'finally' is updated before this so we set the loading to true
        // to make sure the data state is fully set
        // (has only happened when network throttling is on)
        setIsLoading(true);
      })
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

  const postList = (posts) => {
    if (posts.length === 0) {
      return (
        <div className={classes.noPostsSpan}>
          {noPostsText(followingPage)}
        </div>
      );
    }

    return posts.map((post, idx) => {
      return (
        <PostItem
          key={`${followingPage ? 'FrontPageFollowing' : 'FrontPage'}${idx}`}
          isComment={post.post_type === COMMENT_REPOST}
          post={post}
        />
      );
    });
  };

  if (isLoading && !data) return <div className={classes.loadingIcon}>
    <LoadingIcon />
  </div>;

  if (Object.keys(errors).length) return <div className={classes.errorsContainer}>
    <div className={classes.errorsHeader}>{errorFormat(Object.values(errors).join(', '))}</div>
    <div className={classes.refreshPage} onClick={() => getData()}>{REFRESH}</div>
  </div>;

  return (
    <div className={context.id ? classes.frontPageFeedLoggedIn : classes.frontPageFeed}>
      {/* Navbar */}
      {
        context.id &&
          <div className={mobileView ? classes.mobilePageNavbar : classes.pageNavbar}>
            <div
              className={classes.frontPageOptionContainer}
              onClick={() => {
                if (!isLoading && followingPage) {
                  if (!Object.keys(data).length) {
                    getData();
                  } else {
                    setFollowingPage(false);
                  }
                }
              }}
            >
              <div
                className={
                  `${
                    classes.frontPageOption
                  } ${
                    followingPage ? classes.frontPageOptionDeselected : ''
                  }`
                }
              >{FOR_YOU}</div>
              {
                followingPage ||
                  <div className={classes.frontPageSelected}></div>
              }
            </div>

            <div
              className={classes.frontPageFollowingOptionContainer}
              onClick={() => {
                if (!isLoading && !followingPage) {
                  if (!Object.keys(followingPageData).length) {
                    getFollowedFrontPageData();
                  } else {
                    setFollowingPage(true);
                  }
                }
              }}
            >
              <div
                className={
                  `${
                    classes.frontPageFollowingOption
                  } ${
                    followingPage ? '' : classes.frontPageFollowingOptionDeselected
                  }`
                }
              >{FOLLOWING}</div>
              {
                followingPage &&
                  <div className={classes.frontPageFollowingSelected}></div>
              }
            </div>
          </div>
      }

      {context.id && <PostForm />}

      {
        isLoading
          ? <div className={classes.postLoadingIcon}><LoadingIcon /></div>
          : followingPage
            ? postList(followingPageData.posts)
            : postList(data.posts)}
    </div>
  );
};

const styles = theme => ({
  frontPageFeed: {
    borderBottom: `1px solid ${theme.palette.primary.border}`,
  },
  frontPageFeedLoggedIn: {
    borderBottom: `1px solid ${theme.palette.primary.border}`,
    paddingTop: '4em',
  },
  noPostsSpan: {
    borderRight: `1px solid ${theme.palette.primary.border}`,
    borderTop: `1px solid ${theme.palette.primary.border}`,
    textAlign: 'center',
    fontWeight: 600,
    fontSize: '3em',
    color: '#838383',
    padding: '1em 0.5em',
  },
  loadingIcon: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRight: `1px solid ${theme.palette.primary.border}`,
  },
  postLoadingIcon: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRight: `1px solid ${theme.palette.primary.border}`,
    borderTop: `1px solid ${theme.palette.primary.border}`,
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
  pageNavbar: {
    display: 'flex',
    borderRight: `1px solid ${theme.palette.primary.border}`,
    borderBottom: `1px solid ${theme.palette.primary.border}`,
    position: 'fixed',
    width: theme.centerPanel.width,
    top: 0,
    backgroundColor: theme.palette.primary.navbar,
    backdropFilter: 'blur(2px)',
  },
  mobilePageNavbar: {
    display: 'flex',
    borderRight: `1px solid ${theme.palette.primary.border}`,
    borderBottom: `1px solid ${theme.palette.primary.border}`,
    position: 'fixed',
    width: theme.centerPanel.mobileWidth,
    top: 0,
    backgroundColor: theme.palette.primary.navbar,
    backdropFilter: 'blur(2px)',
  },
  frontPageOptionContainer: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.5s',
    '&:hover': {
      backgroundColor: theme.palette.primary.hover,
    },
  },
  frontPageOption: {
    textAlign: 'center',
    fontSize: '1.5em',
    fontWeight: 600,
    padding: '0.5em',
  },
  frontPageSelected: {
    border: `2px solid ${theme.palette.blue.original}`,
    width: '5.6em',
    borderRadius: '15em',
  },
  frontPageOptionDeselected: {
    color: theme.palette.disabled.text,
  },
  frontPageFollowingOptionContainer: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.5s',
    '&:hover': {
      backgroundColor: theme.palette.primary.hover,
    },
  },
  frontPageFollowingOption: {
    textAlign: 'center',
    fontSize: '1.5em',
    fontWeight: 600,
    padding: '0.5em',
  },
  frontPageFollowingSelected: {
    border: `2px solid ${theme.palette.blue.original}`,
    width: '5.6em',
    borderRadius: '15em',
  },
  frontPageFollowingOptionDeselected: {
    color: theme.palette.disabled.text,
  },
});

export default withStyles(styles)(FrontPage);
