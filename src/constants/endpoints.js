export default {
  frontend: {
    followers: '/followers',
    following: '/following',
    homePage: '/home',
    root: '/',
    signIn: '/login',
    signUp: '/register',
    userPage: '/user',
    commentPage: '/comments',
    postPage: '/posts',
  },
  backend: {
    frontPage: '/front_page',
    frontPageFollowing: '/front_page_following',

    logOut: '/sign_out',
    sessions: '/sessions',
    signIn: '/sign_in',
    signUp: '/sign_up',

    comments: '/comments',
    commentData: (commentId) => `/comments/${commentId}/data`,
    commentLikes: '/comment_likes',
    commentReposts: '/comment_reposts',

    posts: '/posts',
    postData: (postId) => `/posts/${postId}/data`,
    postLikes: '/post_likes',
    postReposts: '/post_reposts',
  },
};
