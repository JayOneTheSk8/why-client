import React, { useContext, useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core';

import constants from '../../constants';
import { axiosInstance } from '../../axiosInstance';
import { AuthContext } from '../../authContext';

import PostItem from '../Shared/PostItem';
import PostForm from '../Shared/PostForm';

const {
  endpoints,
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
  },
} = constants;

const FrontPage = ({ classes }) => {
  const context = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({});

  useEffect(() => getData(), []); // eslint-disable-line react-hooks/exhaustive-deps

  const getData = () => {
    setIsLoading(true);
    setErrors({});

    axiosInstance.get(endpoints.backend.frontPage)
      .then(res => setData(res.data))
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
    return posts.map((post) => {
      return <PostItem key={post.id} post={post} />;
    });
  };

  if (isLoading) return <div>{LOADING_}</div>;
  if (Object.keys(errors).length) return <div className={classes.errorsContainer}>
    <div className={classes.errorsHeader}>{errorFormat(Object.values(errors).join(', '))}</div>
    <div className={classes.refreshPage} onClick={() => getData()}>{REFRESH}</div>
  </div>;

  return (
    <div className={classes.frontPageFeed}>
      {context.id && <PostForm />}
      {postList(data.posts)}
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
  },
  refreshPage: {
    cursor: 'pointer',
    textDecoration: 'underline',
  },
});

export default withStyles(styles)(FrontPage);
