import React from 'react';
import { withStyles } from '@material-ui/core';

import constants from '../../constants';

import PostItem from '../Shared/PostItem';
import ProfileItem from '../Shared/ProfileItem';

const {
  components: {
    searchPage: {
      NOTHING_FOUND_TEXT,
      headers: {
        PEOPLE,
        POSTS,
        COMMENTS,
      },
    },
  },
} = constants;

const TopSearch = ({ classes, searchData }) => {
  const profileItems = (users) => {
    return users.map((u, idx) => {
      return (
        <ProfileItem key={`TopSearchUser${idx}`} user={u} />
      );
    });
  };

  const postItems = (posts) => {
    return posts.map((p, idx) => {
      return (
        <PostItem key={`TopSearchPost${idx}`} post={p} />
      );
    });
  };

  const commentItems = (comments) => {
    return comments.map((c, idx) => {
      return (
        <PostItem key={`TopSearchComment${idx}`} post={c} isComment />
      );
    });
  };

  return (
    <div className={classes.topSearch}>
      {
        (
          searchData.users.length === 0 &&
            searchData.posts.length === 0 &&
            searchData.comments.length === 0
        ) &&
          <div className={classes.noFoundData}>
            {NOTHING_FOUND_TEXT}
          </div>
      }

      {
        searchData.users.length > 0 &&
          <div className={classes.foundData}>
            <div className={classes.dataHeader}>{PEOPLE}</div>
            { profileItems(searchData.users) }
          </div>
      }

      {
        searchData.posts.length > 0 &&
          <div className={classes.foundData}>
            <div className={classes.dataHeader}>{POSTS}</div>
            { postItems(searchData.posts) }
          </div>
      }

      {
        searchData.comments.length > 0 &&
          <div className={classes.foundData}>
            <div className={classes.dataHeader}>{COMMENTS}</div>
            { commentItems(searchData.comments) }
          </div>
      }
    </div>
  );
};

const styles = theme => ({
  topSearch: {

  },
  foundData: {

  },
  dataHeader: {
    borderRight: `1px solid ${theme.palette.primary.border}`,
    fontSize: '1.5em',
    fontWeight: 600,
    padding: '0.5em',
  },
  noFoundData: {
    borderRight: `1px solid ${theme.palette.primary.border}`,
    textAlign: 'center',
    fontSize: '2em',
    color: '#8b8b8b',
  },
});

export default withStyles(styles)(TopSearch);
