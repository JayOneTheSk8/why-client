import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { withStyles } from '@material-ui/core';

import constants from '../../constants';
import { AuthContext } from '../../authContext';
import { axiosInstance } from '../../axiosInstance';

import CommentIcon from '../Shared/CommentIcon';
import RepostIcon from '../Shared/RepostIcon';
import LikeIcon from '../Shared/LikeIcon';

const {
  endpoints,
  util: {
    tokens: {
      CURRENT_USER,
    },
  },
  general: {
    fieldTexts: {
      usernameWithSymbol,
    },
  },
} = constants;

const MessageItem = ({ classes, message, isComment }) => {
  const navigate = useNavigate();
  const context = useContext(AuthContext);

  const [highlightedComment, setHighlightedComment] = useState(false);

  const [addedRepost, setAddedRepost] = useState(message.user_reposted ? 1 : 0);
  const [currentlyReposted, setCurrentlyReposted] = useState(message.user_reposted);
  const [isReposting, setIsReposting] = useState(false);
  const [highlightedRepost, setHighlightedRepost] = useState(false);

  const [addedLike, setAddedLike] = useState(message.user_liked ? 1 : 0);
  const [currentlyLiked, setCurrentlyLiked] = useState(message.user_liked);
  const [isLiking, setIsLiking] = useState(false);
  const [highlightedLike, setHighlightedLike] = useState(false);

  const isCurrentUsersPost = () => {
    const isLoggedIn = !!localStorage.getItem(CURRENT_USER);
    return isLoggedIn && message.author.id.toString() === context.id.toString();
  };

  const toggleRepost = () => {
    const isLoggedIn = !!localStorage.getItem(CURRENT_USER);
    if (!isLoggedIn) { return navigate(endpoints.frontend.signIn); }

    const repostUrl = isComment ? endpoints.backend.commentReposts : endpoints.backend.postReposts;

    setIsReposting(true);
    if (currentlyReposted) {
      axiosInstance.delete(repostUrl, {
        params: {
          repost: {
            message_id: message.id
          }
        }
      })
        .then(() => {
          setCurrentlyReposted(false);
          setAddedRepost(0);
        })
        .catch((err) => console.log(err))
        .finally(() => setIsReposting(false));
    } else {
      axiosInstance.post(repostUrl, {
        repost: {
          message_id: message.id
        }
      })
        .then(() => {
          setCurrentlyReposted(true);
          setAddedRepost(1);
        })
        .catch((err) => console.log(err))
        .finally(() => setIsReposting(false));
    }
  };

  const toggleLike = () => {
    const isLoggedIn = !!localStorage.getItem(CURRENT_USER);
    if (!isLoggedIn) { return navigate(endpoints.frontend.signIn); }

    const likeUrl = isComment ? endpoints.backend.commentLikes : endpoints.backend.postLikes;

    setIsLiking(true);
    if (currentlyLiked) {
      axiosInstance.delete(likeUrl, {
        params: {
          like: {
            message_id: message.id
          }
        }
      })
        .then(() => {
          setCurrentlyLiked(false);
          setAddedLike(0);
        })
        .catch((err) => console.log(err))
        .finally(() => setIsLiking(false));
    } else {
      axiosInstance.post(likeUrl, {
        like: {
          message_id: message.id
        }
      })
        .then(() => {
          setCurrentlyLiked(true);
          setAddedLike(1);
        })
        .catch((err) => console.log(err))
        .finally(() => setIsLiking(false));
    }
  };

  const dateFormat = new Intl.DateTimeFormat(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  ).format;

  const timeFormat = new Intl.DateTimeFormat(
    'en-US',
    {
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short',
    }
  ).format;

  return (
    <div className={classes.message}>
      <div className={classes.authorData}>
        <div className={classes.authorIconContainer}>
          <div
            className={classes.authorIcon}
            onClick={() => navigate(endpoints.frontend.userPage(message.author.username))}
          >
            {message.author.display_name[0].toUpperCase()}
          </div>
        </div>

        <div className={classes.authorInfo}>
          <div
            className={classes.displayName}
            onClick={() => navigate(endpoints.frontend.userPage(message.author.username))}
          >
            {message.author.display_name}
          </div>
          <div className={classes.username}>{usernameWithSymbol(message.author.username)}</div>
        </div>
      </div>

      <div className={classes.messageText}>{message.text}</div>

      <div className={classes.messageCreatedAtContainer}>
        <div className={classes.createdTime}>{timeFormat(new Date(message.created_at))}</div>
        <div className={classes.createdAtDivider}>.</div>
        <div className={classes.createdDate}>{dateFormat(new Date(message.created_at))}</div>
      </div>

      {/* Impressions */}
      <div className={classes.postImpressionsContainer}>
        <div className={classes.postImpressions}>

          {/* Comments */}
          <div
            className={classes.commentData}
            onMouseEnter={() => setHighlightedComment(true)}
            onMouseLeave={() => setHighlightedComment(false)}
          >
            <div className={classes.commentCircleContainer}>
              <div className={highlightedComment ? classes.commentCircle : classes.hiddenCommentCircle}></div>
            </div>

            <div className={classes.commentIcon}>
              <CommentIcon highlighted={highlightedComment} width={'1.8em'} height={'1.8em'} />
            </div>

            <div className={highlightedComment ? classes.highlightedCommentCount : classes.commentCount}>
              {message.comment_count ? message.comment_count : ''}
            </div>
          </div>

          {/* Reposts */}
          <div
            className={classes.repostData}
            onClick={() => isCurrentUsersPost() || isReposting || toggleRepost()}
            onMouseEnter={() => isCurrentUsersPost() || setHighlightedRepost(true)}
            onMouseLeave={() => isCurrentUsersPost() || setHighlightedRepost(false)}
          >
            <div className={classes.repostCircleContainer}>
              <div className={highlightedRepost ? classes.repostCircle : classes.hiddenRepostCircle}></div>
            </div>

            <div className={classes.repostIcon}>
              <RepostIcon highlighted={highlightedRepost || currentlyReposted} width={'2.5em'} height={'1.5em'} />
            </div>

            <div
              className={highlightedRepost || currentlyReposted ? classes.highlightedRepostCount : classes.repostCount}
            >
              {
                // If the post was reposted by the user, minus one from it and manage via state
                message.repost_count - (message.user_reposted ? 1 : 0) + addedRepost
              }
            </div>
          </div>

          {/* Likes */}
          <div
            className={classes.likeData}
            onClick={() => isLiking || toggleLike()}
            onMouseEnter={() => setHighlightedLike(true)}
            onMouseLeave={() => setHighlightedLike(false)}
          >
            <div className={classes.likeCircleContainer}>
              <div className={highlightedLike ? classes.likeCircle : classes.hiddenLikeCircle}></div>
            </div>

            <div className={classes.likeIcon}>
              <LikeIcon liked={currentlyLiked} highlighted={highlightedLike} width={'2em'} height={'2em'} />
            </div>

            <div
              className={highlightedLike || currentlyLiked ? classes.highlightedLikeCount : classes.likeCount}
            >
              {
                // If the post was liked by the user, minus one from it and manage via state
                message.like_count - (message.user_liked ? 1 : 0) + addedLike
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = theme => ({
  message: {
    borderRight: `1px solid ${theme.palette.primary.border}`,
  },
  authorData: {
    display: 'flex',
    alignItems: 'center',
  },
  authorIconContainer: {

  },
  authorIcon: {
    color: 'white',
    width: '1.5em',
    border: '3px solid grey',
    height: '1.5em',
    margin: '0.1em 0.2em',
    display: 'flex',
    fontSize: '3em',
    alignItems: 'center',
    borderRadius: '54%',
    justifyContent: 'center',
    backgroundColor: 'black',
    cursor: 'pointer',
  },
  authorInfo: {
    width: '40vw',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  displayName: {
    fontWeight: 600,
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  username: {

  },
  messageText: {
    padding: '1em',
    fontSize: '1.7em',
    whiteSpace: 'pre-wrap',
  },
  messageCreatedAtContainer: {
    display: 'flex',
    marginLeft: '1em',
    padding: '0.7em',
    whiteSpace: 'nowrap',
  },
  createdTime: {

  },
  createdAtDivider: {
    margin: '0 0.5em',
    lineHeight: 0.9,
  },
  createdDate: {

  },
  postImpressionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  postImpressions: {
    width: '95%',
    display: 'flex',
    padding: '1em 5em',
    marginBottom: '1em',
    borderTop: `1px solid ${theme.palette.primary.border}`,
    borderBottom: `1px solid ${theme.palette.primary.border}`,
    justifyContent: 'space-between',
  },
  commentData: {
    display: 'flex',
    cursor: 'pointer',
    alignItems: 'center',
    fontWeight: 600,
    color: '#848484',
  },
  commentIcon: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '0.2em',
  },
  commentCount: {
    fontSize: '1.4em',
    paddingTop: '0.1em',
  },
  highlightedCommentCount: {
    color: theme.palette.blue.original,
    fontSize: '1.4em',
    paddingTop: '0.1em',
  },
  commentCircleContainer: {
    width: 0, // Prevents from taking up space
    height: 0,
  },
  commentCircle: {
    right: '0.3em',
    bottom: '1.2em',
    width: '2.5em',
    height: '2.5em',
    opacity: '0.4',
    position: 'relative',
    borderRadius: '100%',
    backgroundColor: theme.palette.blue.original,
    transition: 'background-color 0.4s',
  },
  hiddenCommentCircle: {
    backgroundColor: 'transparent',
    height: '2.2em',
    transition: 'background-color 0.4s',
  },
  repostData: {
    display: 'flex',
    cursor: 'pointer',
    alignItems: 'center',
    fontWeight: 600,
    color: '#848484',
  },
  repostIcon: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '0.2em',
  },
  repostCount: {
    fontSize: '1.4em',
  },
  highlightedRepostCount: {
    color: '#00AF75',
    fontSize: '1.4em',
  },
  repostCircleContainer: {
    width: 0, // Prevents from taking up space
    height: 0,
  },
  repostCircle: {
    right: '0.2em',
    bottom: '1.5em',
    width: '3em',
    height: '3em',
    opacity: '0.4',
    position: 'relative',
    borderRadius: '100%',
    backgroundColor: '#00AF75',
    transition: 'background-color 0.4s',
  },
  hiddenRepostCircle: {
    backgroundColor: 'transparent',
    height: '2.2em',
    transition: 'background-color 0.4s',
  },
  likeData: {
    display: 'flex',
    cursor: 'pointer',
    alignItems: 'center',
    fontWeight: 600,
    color: '#848484',
  },
  likeIcon: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '0.2em',
  },
  likeCount: {
    fontSize: '1.4em',
  },
  highlightedLikeCount: {
    color: '#FF1D1D',
    fontSize: '1.4em',
  },
  likeCircleContainer: {
    width: 0, // Prevents from taking up space
    height: 0,
  },
  likeCircle: {
    right: '0.3em',
    bottom: '1.4em',
    width: '2.7em',
    height: '2.7em',
    opacity: '0.4',
    position: 'relative',
    borderRadius: '100%',
    backgroundColor: '#FF1D1D',
    transition: 'background-color 0.4s',
  },
  hiddenLikeCircle: {
    backgroundColor: 'transparent',
    height: '2.2em',
    transition: 'background-color 0.4s',
  },
});

export default withStyles(styles)(MessageItem);
