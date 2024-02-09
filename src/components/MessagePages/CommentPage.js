import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { withStyles } from '@material-ui/core';

import constants from '../../constants';
import { AuthContext } from '../../authContext';
import { axiosInstance } from '../../axiosInstance';
import { useWindowDimensions } from '../../hooks';
import { dispatchEvent } from '../../util';

import PostItem from '../Shared/PostItem';
import PostForm from '../Shared/PostForm';
import BackIcon from '../Shared/BackIcon';
import LoadingIcon from '../Shared/LoadingIcon';

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
      REFRESH,
    }
  },
  util: {
    limits: {
      MOBILE_VIEW_PIXEL_LIMIT,
    },
  },
} = constants;

const CommentPage = ({ classes }) => {
  const context = useContext(AuthContext);
  const { id: commentId } = useParams();
  const { width } = useWindowDimensions();

  const [mobileView, setMobileView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => getData(commentId), [commentId]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => dispatchEvent(RESIZE_BORDER_EXTENSION), [isLoading]);

  useEffect(() => {
    if (width < MOBILE_VIEW_PIXEL_LIMIT) {
      setMobileView(true);
    } else {
      setMobileView(false);
    }
  }, [width]);

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

  if (isLoading) return <div className={classes.loadingIcon}>
    <LoadingIcon />
  </div>;

  if (Object.keys(errors).length) return <div className={classes.errorsContainer}>
    <div className={classes.errorsHeader}>{errorFormat(Object.values(errors).join(', '))}</div>
    <div className={classes.refreshPage} onClick={() => getData(commentId)}>{REFRESH}</div>
  </div>;

  return (
    <div className={classes.commentPage}>
      <div className={mobileView ? classes.mobileNavbar : classes.navbar}>
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

const styles = theme => ({
  commentPage: {
    paddingTop: '3.5em',
  },
  loadingIcon: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRight: `1px solid ${theme.palette.primary.border}`
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
  navbar: {
    display: 'flex',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    width: theme.centerPanel.width,
    backgroundColor: theme.palette.primary.navbar,
    padding: '0.5em',
    borderRight: `1px solid ${theme.palette.primary.border}`,
    backdropFilter: 'blur(2px)',
  },
  mobileNavbar: {
    display: 'flex',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    width: theme.centerPanel.mobileWidth,
    backgroundColor: theme.palette.primary.navbar,
    padding: '0.5em',
    borderRight: `1px solid ${theme.palette.primary.border}`,
    backdropFilter: 'blur(2px)',
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
