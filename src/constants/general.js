const symbols = {
  USERNAME_SYMBOL: '¿',
};

const eventTypes = {
  CLICK: 'click',
};

const fields = {
  EMAIL: 'email',
  DISPLAY_NAME: 'displayName',
  PASSWORD: 'password',
  USERNAME: 'username',
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
  usernameWithSymbol: (username) => `${symbols.USERNAME_SYMBOL}${username}`,
};

export default {
  eventTypes,
  fields,
  titles,
  fieldTexts,
  symbols,
};
