const symbols = {
  USERNAME_SYMBOL: '¿',
};

const eventTypes = {
  CLICK: 'click',
  RESIZE_BORDER_EXTENSION: 'resizeBorderExtension',
  DARK_MODE_EVENT: 'darkModeEvent',
};

const fields = {
  EMAIL: 'email',
  DISPLAY_NAME: 'displayName',
  PASSWORD: 'password',
  USERNAME: 'username',
  DARK_MODE_CHECKBOX: 'darkModeCheckbox',
};

const postTypes = {
  COMMENT: 'Comment',
  COMMENT_REPOST: 'CommentRepost',
  COMMENT_LIKE: 'CommentLike',
};

const titles = {
  EMAIL_TITLE: 'Email',
  DISPLAY_NAME_TITLE: 'Display Name',
  PASSWORD_TITLE: 'Password',
  USERNAME_TITLE: 'Username',
};

const fieldTexts = {
  LOADING_: 'Loading...',
  REFRESH: 'Refresh',
  SAVE: 'Save',
  usernameWithSymbol: (username) => `${symbols.USERNAME_SYMBOL}${username}`,
};

export default {
  eventTypes,
  fields,
  postTypes,
  titles,
  fieldTexts,
  symbols,
};
