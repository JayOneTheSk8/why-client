import React, { useContext, useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core';

import constants from '../../constants';
import { axiosInstance } from '../../axiosInstance';
import { AuthContext } from '../../authContext';

import PostItem from '../Shared/PostItem';
import PostForm from '../Shared/PostForm';

const {
  endpoints,
  components: {
    frontPage: {
      FOR_YOU,
      FOLLOWING,
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
    fieldTexts: {
      LOADING_,
      REFRESH,
    },
    postTypes: {
      COMMENT_REPOST,
    },
  },
} = constants;

const FrontPage = ({ classes }) => {
  const context = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [followingPage, setFollowingPage] = useState(false);

  const [data, setData] = useState({});
  const [followingPageData, setFollowingPageData] = useState({});

  useEffect(() => getData(true), []); // eslint-disable-line react-hooks/exhaustive-deps

  const getData = (withLoading = false) => {
    if (withLoading) { setIsLoading(true); }
    setErrors({});

    axiosInstance.get(endpoints.backend.frontPage)
      .then((res) => {
        setData(res.data);
        setFollowingPage(false);
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

  const getFollowedFrontPageData = (withLoading = false) => {
    if (withLoading) { setIsLoading(true); }
    setErrors({});

    axiosInstance.get(endpoints.backend.frontPageFollowing)
      .then((res) => {
        setFollowingPageData(res.data);
        setFollowingPage(true);
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
    return posts.map((post, idx) => {
      return (
        <PostItem
          key={idx}
          isComment={post.post_type === COMMENT_REPOST}
          post={post}
        />
      );
    });
  };

  if (isLoading) return <div>{LOADING_}</div>;
  if (Object.keys(errors).length) return <div className={classes.errorsContainer}>
    <div className={classes.errorsHeader}>{errorFormat(Object.values(errors).join(', '))}</div>
    <div className={classes.refreshPage} onClick={() => getData()}>{REFRESH}</div>
  </div>;

  return (
    <div className={classes.frontPageFeed}>
      {/* Navbar */}
      {
        context.id &&
          <div className={classes.pageNavbar}>
            <div
              className={classes.frontPageOptionContainer}
              onClick={() => {
                if (followingPage) {
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
                if (!followingPage) {
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

      {followingPage ? postList(followingPageData.posts) : postList(data.posts)}
    </div>
  );
};

const styles = () => ({
  frontPageFeed: {
    borderBottom: '1px solid black',
  },
  errorsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '1em',
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
    borderRight: '1px solid black',
    borderBottom: '1px solid black',
  },
  frontPageOptionContainer: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.5s',
    '&:hover': {
      backgroundColor: '#DCDCDC',
    },
  },
  frontPageOption: {
    textAlign: 'center',
    fontSize: '1.5em',
    fontWeight: 600,
    padding: '0.5em',
  },
  frontPageSelected: {
    border: '2px solid #1D9BF0',
    width: '5.6em',
    borderRadius: '15em',
  },
  frontPageOptionDeselected: {
    color: 'darkgrey',
  },
  frontPageFollowingOptionContainer: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.5s',
    '&:hover': {
      backgroundColor: '#DCDCDC',
    },
  },
  frontPageFollowingOption: {
    textAlign: 'center',
    fontSize: '1.5em',
    fontWeight: 600,
    padding: '0.5em',
  },
  frontPageFollowingSelected: {
    border: '2px solid #1D9BF0',
    width: '5.6em',
    borderRadius: '15em',
  },
  frontPageFollowingOptionDeselected: {
    color: 'darkgrey',
  },
});

export default withStyles(styles)(FrontPage);
