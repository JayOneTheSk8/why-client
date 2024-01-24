import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { withStyles } from '@material-ui/core';

import constants from '../../constants';
import { axiosInstance } from '../../axiosInstance';

const {
  endpoints,
  components: {
    postForm: {
      POST,
      REPLY,
      REPLY_TEXT,
      REPLYING_TO,
      WHAT_TO_ASK,
    },
  },
  errors: {
    keys: {
      GENERAL_ERROR,
    },
  },
  general: {
    fieldTexts: {
      LOADING_,
      usernameWithSymbol,
    },
  },
  util: {
    limits: {
      POST_TEXT_LIMIT,
    },
    tokens: {
      CURRENT_USER,
    },
  },
} = constants;

const PostForm = ({ classes, isComment, postId, parentId, replyingTo }) => {
  const navigate = useNavigate();

  const [isPosting, setIsPosting] = useState(false);
  const [text, setText] = useState('');
  const [errors, setErrors] = useState({});

  const currentUserFirstLetter = () => {
    const currentUser = localStorage.getItem(CURRENT_USER);
    if (!currentUser) { return navigate(endpoints.frontend.signIn); }

    return currentUser[0].toUpperCase();
  };

  const updateAreaHeight = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handlePost = (e) => {
    e.preventDefault();

    const isLoggedIn = !!localStorage.getItem(CURRENT_USER);
    if (!isLoggedIn) { return navigate(endpoints.frontend.signIn); }

    setIsPosting(true);
    setErrors({});

    if (isComment) {
      axiosInstance.post(endpoints.backend.comments, {
        comment: {
          text: text.trim(),
          post_id: postId,
          parent_id: parentId,
        }
      })
        .then(() => window.location.reload())
        .catch((err) => {
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
        .finally(() => setIsPosting(false));
    } else {
      axiosInstance.post(endpoints.backend.posts, {
        post: {
          text: text.trim()
        }
      })
        .then(() => window.location.reload())
        .catch((err) => {
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
        .finally(() => setIsPosting(false));
    }
  };

  return (
    <div className={classes.postFormContainer}>
      {
        (isComment && replyingTo) &&
          <div className={classes.replyingTo}>
            {REPLYING_TO}

            <div className={classes.replyingToUsername}>{usernameWithSymbol(replyingTo)}</div>
          </div>
      }

      <form className={classes.postForm} onSubmit={handlePost}>
        <div className={classes.userIconContainer}>
          <div className={classes.userIcon}>{currentUserFirstLetter()}</div>
        </div>

        <div className={classes.inputData}>
          <textarea
            className={classes.postInputField}
            maxLength={POST_TEXT_LIMIT}
            placeholder={isComment ? REPLY_TEXT : WHAT_TO_ASK}
            onChange={(e) => {
              updateAreaHeight(e.target);
              setText(e.target.value);
            }}
          />

          <div className={classes.submitArea}>
            <button
              type="submit"
              className={classes.submit}
              disabled={isPosting || !text.trim()}
            >{isPosting ? LOADING_ : (isComment ? REPLY : POST)}</button>
          </div>

          {
            errors[GENERAL_ERROR] &&
            <div className={classes.labelError}>{errors[GENERAL_ERROR]}</div>
          }
        </div>
      </form>
    </div>
  );
};

const styles = () => ({
  postFormContainer: {
    borderRight: '1px solid black',
  },
  postForm: {
    display: 'flex',
    padding: '0.5em',
  },
  replyingTo: {
    display: 'flex',
    marginLeft: '5em',
    fontSize: '1.1em',
  },
  replyingToUsername: {
    marginLeft: '0.3em',
    color: '#1D9BF0',
  },
  userIconContainer: {

  },
  userIcon: {
    color: 'white',
    width: '1.5em',
    border: '1px solid grey',
    height: '1.5em',
    margin: '0.1em 0.2em',
    display: 'flex',
    fontSize: '3em',
    alignItems: 'center',
    borderRadius: '54%',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  inputData: {

  },
  postInputField: {
    width: '40vw',
    border: 'none',
    resize: 'none',
    fontSize: '1.6em',
    fontFamily: 'inherit',
    overflowY: 'hidden',
    outline: 'none',
    marginTop: '0.5em',
    backgroundColor: '#fafafa',
  },
  submitArea: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },
  submit: {
    fontSize: '1.3em',
    fontWeight: 600,
    color: '#fafafa',
    width: '4.5em',
    height: '1.7em',
    borderRadius: '4em',
    border: 'none',
    backgroundColor: '#1D9BF0',
    margin: '0.3em',
    cursor: 'pointer',
    '&:disabled': {
      color: 'darkgrey',
      backgroundColor: 'rgb(29 155 240 / 64%)',
      cursor: 'not-allowed',
    },
  },
  labelError: {
    color: 'red',
  },
});

export default withStyles(styles)(PostForm);