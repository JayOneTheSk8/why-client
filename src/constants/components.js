import general from './general';

const auth = {
  CREATE_YOUR_ACCOUNT_HEADER: 'Create your account',
  SIGN_IN_HEADER: 'Sign in to Y',
  EXISTING_ACCOUNT_TEXT: 'Have an account already?',
  REGISTER_ACCOUNT_TEXT: 'Don\'t have an account?',
  LOG_IN: 'Log in',
  SIGN_IN: 'Sign in',
  SIGN_UP: 'Sign up',
};

const darkModeToggle = {
  DARK_MODE_TEXT: 'Dark Mode',
};

const accountMenu = {
  logoutText: (username) => `Log out ${general.fieldTexts.usernameWithSymbol(username)}`,
};

const followPages = {
  NO_FOLLOWERS_TEXT: 'No Followers :(',
  NO_FOLLOWED_USERS_TEXT: 'Not following anyone yet :(',
};

const frontPage = {
  FOR_YOU: 'For you',
  FOLLOWING: 'Following',
  noPostsText: (followingPage) => `No ${followingPage ? 'Followed ' : ''}Posts Yet :(`,
};

const postItem = {
  CANNOT_REPOST: 'Can\'t repost your own posts',
  repostedText: (user) => `${user} reposted`,
};

const postForm = {
  POST: 'Post',
  REPLY: 'Reply',
  REPLY_TEXT: 'Inquiring further?!',
  REPLYING_TO: 'Replying to',
  WHAT_TO_ASK: 'What do you want to ask?!',
};

const profilePage = {
  EDIT_PROFILE: 'Edit profile',
  FOLLOW: 'Follow',
  FOLLOWERS: 'Followers',
  FOLLOWING: 'Following',
  NULL_ACCOUNT_SPAN: 'Try searching for another.',
  PROFILE: 'Profile',
  POSTS: 'Posts',
  REPLIES: 'Replies',
  LIKES: 'Likes',
  noPostsText: (postType) => `No ${postType} Yet :(`,
  joinedAt: (formattedDate) => `Joined ${formattedDate}`,
  postCount: (count) => `${count} Post${count === 1 ? '' : 's'}`,
};

const profileItem = {
  FOLLOWS_YOU: 'Follows you',
  UNFOLLOW: 'Unfollow',
};

const messagePages = {
  COMMENT: 'Comment',
  POST: 'Post',
};

const searchPage = {
  NOTHING_FOUND_TEXT: 'Couldn\'t find anything :(',
  SEARCH: 'Search',
  QUERY: 'q',
  unfoundMessage: (element) => `No ${element} found :(`,
  searchFor: (text) => `Search for "${text}"`,
  headers: {
    TOP: 'Top',
    PEOPLE: 'People',
    POSTS: 'Posts',
    COMMENTS: 'Comments',
  },
};

export default {
  accountMenu,
  auth,
  darkModeToggle,
  followPages,
  frontPage,
  postItem,
  postForm,
  profilePage,
  profileItem,
  messagePages,
  searchPage,
};
