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
import LoadingIcon from '../Shared/LoadingIcon';

import MessageItem from './MessageItem';

const {
  endpoints,
  components: {
    messagePages: {
      POST,
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
} = constants;

const PostPage = ({ classes }) => {
  const context = useContext(AuthContext);
  const { id: postId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => getData(postId), [postId]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => dispatchEvent(RESIZE_BORDER_EXTENSION), [isLoading]);

  const getData = (id) => {
    setIsLoading(true);
    setErrors({});

    axiosInstance.get(endpoints.backend.postData(id))
      .then((res) => {
        setData(res.data.post);
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

  const postCommentItems = () => {
    if (data.comments.length) {
      return data.comments.map((c, idx) => {
        const comment = Object.assign({}, c, { replying_to: null });

        return (
          <PostItem
            key={`PostPage${idx}`}
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
    <div className={classes.refreshPage} onClick={() => getData(postId)}>{REFRESH}</div>
  </div>;

  return (
    <div className={classes.postPage}>
      <div className={classes.navbar}>
        <div className={classes.backButton}>
          <BackIcon />
        </div>
        <div className={classes.postPageTitle}>{POST}</div>
      </div>

      <MessageItem message={data} />

      {
        context.id &&
          <PostForm
            postId={data.id}
            isComment
            replyingTo={[data.author.username]}
          />
      }

      { postCommentItems() }
    </div>
  );
};

const styles = () => ({
  postPage: {
    paddingTop: '3.5em',
  },
  loadingIcon: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRight: '1px solid black'
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
  postPageTitle: {
    fontSize: '1.4em',
    fontWeight: 600,
  },
});

export default withStyles(styles)(PostPage);
