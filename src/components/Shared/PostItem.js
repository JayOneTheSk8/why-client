import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { withStyles } from '@material-ui/core';

import constants from '../../constants';
import { axiosInstance } from '../../axiosInstance';
import { AuthContext } from '../../authContext';

import CommentIcon from './CommentIcon';
import RepostIcon from './RepostIcon';
import LikeIcon from './LikeIcon';

const {
  endpoints,
  components: {
    postItem: {
      repostedText,
    },
  },
  util: {
    tokens: {
      CURRENT_USER,
    },
  },
} = constants;

const PostItem = ({ classes, post, repostedByOverride, isComment }) => {
  const navigate = useNavigate();
  const context = useContext(AuthContext);

  const [highlightedComment, setHighlightedComment] = useState(false);

  const [addedRepost, setAddedRepost] = useState(post.user_reposted ? 1 : 0);
  const [currentlyReposted, setCurrentlyReposted] = useState(post.user_reposted);
  const [isReposting, setIsReposting] = useState(false);
  const [highlightedRepost, setHighlightedRepost] = useState(false);

  const [addedLike, setAddedLike] = useState(post.user_liked ? 1 : 0);
  const [currentlyLiked, setCurrentlyLiked] = useState(post.user_liked);
  const [isLiking, setIsLiking] = useState(false);
  const [highlightedLike, setHighlightedLike] = useState(false);

  const isCurrentUsersPost = () => {
    const isLoggedIn = !!localStorage.getItem(CURRENT_USER);
    return isLoggedIn && post.author.id.toString() === context.id.toString();
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
            message_id: post.id
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
          message_id: post.id
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
            message_id: post.id
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
          message_id: post.id
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
      year: 'numeric'
    }
  ).format;

  return (
    <div className={classes.postItem}>
      {/* Reposted By */}
      {
        post.reposted_by &&
          <div>
            <div className={classes.repostedByRepostIcon}></div>
            <div className={classes.respostedBy}>
              {repostedText(repostedByOverride || post.reposted_by)}
            </div>
          </div>
      }

      <div className={classes.postData}>
        {/* Author Icon */}
        <div className={classes.postAuthorIconContainer}>
          <div className={classes.postAuthorIcon}>{post.author.username[0].toUpperCase()}</div>
        </div>

        <div className={classes.postInfo}>
          {/* Author Data */}
          <div className={classes.authorData}>
            <div className={classes.postAuthorDisplayName}>{post.author.display_name}</div>
            <div className={classes.postUsername}>{`¿${post.author.username}`}</div>
            <div className={classes.nameAndDateSeparator}>.</div>
            <div className={classes.postDate}>{dateFormat(new Date(post.created_at))}</div>
          </div>

          {/* Text */}
          <div className={classes.postText}>{post.text}</div>

          {/* Impressions */}
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
                <CommentIcon highlighted={highlightedComment} />
              </div>

              <div className={highlightedComment ? classes.highlightedCommentCount : classes.commentCount}>
                {post.comment_count ? post.comment_count : ''}
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
                <RepostIcon highlighted={highlightedRepost || currentlyReposted} />
              </div>

              <div
                className={highlightedRepost || currentlyReposted ? classes.highlightedRepostCount : classes.repostCount}
              >
                {
                  // If the post was reposted by the user, minus one from it and manage via state
                  post.repost_count - (post.user_reposted ? 1 : 0) + addedRepost
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
                <LikeIcon liked={currentlyLiked} highlighted={highlightedLike} />
              </div>

              <div
                className={highlightedLike || currentlyLiked ? classes.highlightedLikeCount : classes.likeCount}
              >
                {
                  // If the post was liked by the user, minus one from it and manage via state
                  post.like_count - (post.user_liked ? 1 : 0) + addedLike
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = () => ({
  postItem: {
    width: '100%',
    borderTop: '1px solid black',
    borderRight: '1px solid black',
  },
  repostedByRepostIcon: {

  },
  respostedBy: {

  },
  postData: {
    display: 'flex',
  },
  postAuthorIconContainer: {

  },
  postAuthorIcon: {
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
  postInfo: {
    width: '40vw',
  },
  authorData: {
    display: 'flex',
    fontSize: '1.1em',
    marginTop: '0.3em',
  },
  postAuthorDisplayName: {
    marginRight: '0.5em',
    fontWeight: 600,
    maxWidth: '10em',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  postUsername: {
    maxWidth: '17.5em',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  nameAndDateSeparator: {
    margin: '0 0.5em',
    lineHeight: '0.9',
  },
  postDate: {
    whiteSpace: 'nowrap',
  },
  postText: {
    paddingTop: '0.5em',
    whiteSpace: 'pre-wrap',
  },
  postImpressions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '16vw',
    margin: '1em 0 0.8em 0',
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

  },
  highlightedCommentCount: {
    color: '#1D9BF0',
  },
  commentCircleContainer: {
    width: 0, // Prevents from taking up space
  },
  commentCircle: {
    width: '2.2em',
    height: '2.2em',
    opacity: '0.4',
    position: 'relative',
    borderRadius: '100%',
    backgroundColor: '#1D9BF0',
    right: '0.5em',
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

  },
  highlightedRepostCount: {
    color: '#00AF75',
  },
  repostCircleContainer: {
    width: 0, // Prevents from taking up space
  },
  repostCircle: {
    width: '2.2em',
    height: '2.2em',
    opacity: '0.4',
    position: 'relative',
    borderRadius: '100%',
    backgroundColor: '#00AF75',
    right: '0.35em',
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

  },
  highlightedLikeCount: {
    color: '#FF1D1D',
  },
  likeCircleContainer: {
    width: 0, // Prevents from taking up space
  },
  likeCircle: {
    width: '2.2em',
    height: '2.2em',
    opacity: '0.4',
    position: 'relative',
    borderRadius: '100%',
    backgroundColor: '#FF1D1D',
    right: '0.5em',
    transition: 'background-color 0.4s',
  },
  hiddenLikeCircle: {
    backgroundColor: 'transparent',
    height: '2.2em',
    transition: 'background-color 0.4s',
  },
});

export default withStyles(styles)(PostItem);
