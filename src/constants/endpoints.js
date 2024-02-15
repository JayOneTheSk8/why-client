import components from './components';

const {
  searchPage: {
    QUERY,
  },
} = components;

export default {
  frontend: {
    followers: '/followers',
    following: '/following',
    followersPage: (username) => `/user/${username}/followers`,
    followingPage: (username) => `/user/${username}/following`,
    homePage: '/home',
    root: '/',
    search: '/search',
    searchWithQuery: (searchText) => `/search?${QUERY}=${encodeURIComponent(searchText)}`,
    signIn: '/login',
    signUp: '/register',
    usersPage: '/user',
    userPage: (username) => `/user/${username}`,
    commentPage: '/comments',
    postPage: '/posts',
    aboutPage: '/about',
  },
  backend: {
    frontPage: '/front_page',
    frontPageFollowing: '/front_page_following',

    logOut: '/sign_out',
    sessions: '/sessions',
    signIn: '/sign_in',
    signUp: '/sign_up',

    userData: (username) => `/users/${username}`,

    comments: '/comments',
    commentData: (commentId) => `/comments/${commentId}/data`,
    commentLikes: '/comment_likes',
    commentReposts: '/comment_reposts',

    posts: '/posts',
    postData: (postId) => `/posts/${postId}/data`,
    postLikes: '/post_likes',
    postReposts: '/post_reposts',

    follows: '/follows',
    following: (username) => `users/${username}/subscriptions`,
    followers: (username) => `users/${username}/followers`,

    linkedPosts: (userId) => `/users/${userId}/linked_posts`,
    linkedComments: (userId) => `/users/${userId}/linked_comments`,
    likes: (userId) => `/users/${userId}/likes`,

    quickSearch: '/search/quick',
    topSearch: '/search/top',
    usersSearch: '/search/users',
    postsSearch: '/search/posts',
    commentsSearch: '/search/comments',
  },
};
