import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { withStyles } from '@material-ui/core';

import constants from '../../constants';
import { AuthContext } from '../../authContext';
import { axiosInstance } from '../../axiosInstance';
import { dispatchEvent } from '../../util';

import PostItem from '../Shared/PostItem';
import PostForm from '../Shared/PostForm';
import BackIcon from '../Shared/BackIcon';

import MessageItem from './MessageItem';

const {
  endpoints,
  components: {
    messagePages: {
      COMMENT,
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
      LOADING_,
      REFRESH,
    }
  },
} = constants;

const CommentPage = ({ classes }) => {
  const context = useContext(AuthContext);
  const { id: commentId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => getData(commentId), [commentId]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => dispatchEvent(RESIZE_BORDER_EXTENSION), [isLoading]);

  const getData = (id) => {
    setIsLoading(true);
    setErrors({});

    axiosInstance.get(endpoints.backend.commentData(id))
      .then((res) => {
        setData(res.data.comment);
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

  const parentCommentItem = () => {
    if (data.parent) {
      const parent = Object.assign({}, data.parent, { replying_to: null });
      return <PostItem post={parent} isParent isComment />;
    }
  };

  const commentReplyItems = () => {
    if (data.comments.length) {
      return data.comments.map((c, idx) => {
        const comment = Object.assign({}, c, { replying_to: null });

        return (
          <PostItem
            key={`CommentPage${idx}`}
            post={comment}
            isComment
          />
        );
      });
    }
  };

  if (isLoading) return <div>{LOADING_}</div>;
  if (Object.keys(errors).length) return <div className={classes.errorsContainer}>
    <div className={classes.errorsHeader}>{errorFormat(Object.values(errors).join(', '))}</div>
    <div className={classes.refreshPage} onClick={() => getData(commentId)}>{REFRESH}</div>
  </div>;

  return (
    <div className={classes.commentPage}>
      <div className={classes.navbar}>
        <div className={classes.backButton}>
          <BackIcon />
        </div>
        <div className={classes.commentPageTitle}>{COMMENT}</div>
      </div>

      <PostItem post={data.post} isParent/>

      { parentCommentItem() }

      <MessageItem message={data} isComment />

      {
        context.id &&
          <PostForm
            postId={data.post.id}
            parentId={data.id}
            replyingTo={[data.author.username, data.post.author.username]}
            isComment
          />
      }

      { commentReplyItems() }
    </div>
  );
};

const styles = () => ({
  commentPage: {
    paddingTop: '3.5em',
  },
  errorsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '1em',
    borderRight: '1px solid black',
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
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    width: '50vw',
    backgroundColor: 'rgb(250, 250, 250, 0.6)',
    padding: '0.5em',
    borderRight: '1px solid black',
  },
  backButton: {
    marginRight: '1em',
    paddingTop: '0.3em',
  },
  commentPageTitle: {
    fontSize: '1.4em',
    fontWeight: 600,
  },
});

export default withStyles(styles)(CommentPage);
