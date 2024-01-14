import React, { useEffect, useState } from 'react';

import { withStyles } from '@material-ui/core';

import { axiosInstance } from '../../axiosInstance';

import PostItem from '../Shared/PostItem';

const FrontPage = ({ classes }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    axiosInstance.get('/front_page')
      .then(res => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch(err => console.log(err));

  }, []);

  const postList = (posts) => {
    return posts.map((post) => {
      return <PostItem key={post.id} post={post} />;
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className={classes.frontPageFeed}>
      {postList(data.posts)}
    </div>
  );
};

const styles = () => ({
  frontPageFeed: {},
});

export default withStyles(styles)(FrontPage);
