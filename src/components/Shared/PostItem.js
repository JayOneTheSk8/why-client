import React from 'react';

import { withStyles } from '@material-ui/core';

const PostItem = ({ classes, post }) => {
  return (
    <div className={classes.postItem}>
      <div>{post.text}</div>
      <div>{post.author.username}</div>
      <div>{post.author.display_name}</div>
      <div>{post.like_count}</div>
      <div>{post.repost_count}</div>
      <div>{post.comment_count}</div>
    </div>
  );
};

const styles = () => ({
  postItem: {
    width: '100%',
    border: '1px solid black',
  },
});

export default withStyles(styles)(PostItem);
