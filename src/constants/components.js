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
  logoutText: (username) => `Log out ¿${username}`,
};

const postItem = {
  repostedText: (text) => `${text} reposted`,
};

export default {
  accountMenu,
  auth,
  postItem,
};
