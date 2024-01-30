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

const accountMenu = {
  logoutText: (username) => `Log out ${general.fieldTexts.usernameWithSymbol(username)}`,
};

const frontPage = {
  FOR_YOU: 'For you',
  FOLLOWING: 'Following',
  noPostsText: (followingPage) => `No ${followingPage ? 'Followed ' : ''}Posts Yet :(`,
};

const postItem = {
  repostedText: (user) => `${user} reposted`,
};

const postForm = {
  POST: 'Post',
  REPLY: 'Reply',
  REPLY_TEXT: 'Inquiring further?!',
  REPLYING_TO: 'Replying to',
  WHAT_TO_ASK: 'What do you want to ask?!',
};

const messagePages = {
  COMMENT: 'Comment',
  POST: 'Post',
};

export default {
  accountMenu,
  auth,
  frontPage,
  postItem,
  postForm,
  messagePages,
};
