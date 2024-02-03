import React, { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import validator from 'validator';

import constants from '../../constants';
import { AuthContext } from '../../authContext';
import { axiosInstance } from '../../axiosInstance';

import WhyCon from '../Shared/WhyCon';
import GlassesIcon from '../Shared/GlassesIcon';

const {
  endpoints,
  components: {
    auth: {
      CREATE_YOUR_ACCOUNT_HEADER,
      EXISTING_ACCOUNT_TEXT,
      SIGN_UP,
      LOG_IN,
    },
  },
  errors: {
    keys: {
      GENERAL_ERROR,
    },
  },
  general: {
    fields: {
      EMAIL,
      DISPLAY_NAME,
      PASSWORD,
      USERNAME,
    },
    titles: {
      EMAIL_TITLE,
      DISPLAY_NAME_TITLE,
      PASSWORD_TITLE,
      USERNAME_TITLE,
    },
    fieldTexts: {
      LOADING_,
    },
  },
  util: {
    limits: {
      USERNAME_LIMIT,
    },
  },
} = constants;

const SignUp = ({ classes }) => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  const usernameInput = useRef(null);
  const displayNameInput = useRef(null);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [labelClassnames, setLabelClassnames] = useState({
    username: classes.usernameLabel,
    displayName: classes.displayNameLabel,
    email: classes.emailLabel,
    password: classes.passwordLabel,
  });

  const shrinkLabel = (field) => {
    return (e) => {
      e.preventDefault();
      setLabelClassnames({ ...labelClassnames, [field]: classes[`${field}LabelShrunk`] });
    };
  };

  const expandLabel = (field) => {
    return (e) => {
      e.preventDefault();
      if (e.target.value !== '') { return; }

      setLabelClassnames({ ...labelClassnames, [field]: classes[`${field}Label`] });
    };
  };

  const updateUsername = (e) => {
    // Reject spaces
    const text = e.target.value.replaceAll(/ /g, '');

    usernameInput.current.value = text;
    setUsername(text);

    // Match display name if it's not filled in or being filled in
    // Make sure to shrink label
    if (!displayNameInput.current.value || displayNameInput.current.value === text.slice(0, -1)) {
      !labelClassnames.displayName.includes('Shrunk') && shrinkLabel(DISPLAY_NAME)(e);
      displayNameInput.current.value = text;
      setDisplayName(text);
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();

    setIsLoading(true);
    setErrors({});

    axiosInstance.post(endpoints.backend.signUp, {
      user: {
        username: username.trim(),
        display_name: displayName.trim(),
        email: email.trim(),
        password,
      }
    })
      .then(res => {
        context.login(res.data);
      })
      .catch(err => {
        if (err.response) {
          const { data } = err.response;

          if (data.errors) {
            setErrors({ ...errors, [GENERAL_ERROR]: data.errors.join(', ') });
          } else {
            setErrors({ ...errors, [GENERAL_ERROR]: err.message });
          }
        } else {
          setErrors({ ...errors, [GENERAL_ERROR]: err.message });
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className={classes.signUp}>
      <form className={classes.signUpForm} onSubmit={handleSignUp}>
        <div className={classes.signUpTopBar}>
          <div className={classes.signUpClose} onClick={() => navigate(endpoints.frontend.root)}>X</div>

          <div className={classes.signUpWhycon}>
            <WhyCon width={'3.5em'} />
          </div>

          <div></div>
        </div>

        <div className={classes.signUpHeader}>{CREATE_YOUR_ACCOUNT_HEADER}</div>
        {errors[GENERAL_ERROR] &&
          <>
            <span className={classes.labelError}>{errors[GENERAL_ERROR]}</span>
            <div></div>
          </>
        }

        <div className={classes.signUpDetails}>
          <label htmlFor={USERNAME} className={labelClassnames[USERNAME]}>{USERNAME_TITLE}</label>
          <input
            id={USERNAME}
            ref={usernameInput}
            spellCheck={false}
            maxLength={USERNAME_LIMIT}
            className={classes.usernameInput}
            onChange={(e) => updateUsername(e)}
            onFocus={shrinkLabel(USERNAME)}
            onBlur={expandLabel(USERNAME)}
          />

          <label htmlFor={DISPLAY_NAME} className={labelClassnames[DISPLAY_NAME]}>{DISPLAY_NAME_TITLE}</label>
          <input
            id={DISPLAY_NAME}
            ref={displayNameInput}
            spellCheck={false}
            className={classes.displayNameInput}
            onChange={(e) => setDisplayName(e.target.value)}
            onFocus={shrinkLabel(DISPLAY_NAME)}
            onBlur={expandLabel(DISPLAY_NAME)}
          />

          <label htmlFor={EMAIL} className={labelClassnames[EMAIL]}>{EMAIL_TITLE}</label>
          <input
            id={EMAIL}
            type={EMAIL}
            spellCheck={false}
            className={classes.emailInput}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={shrinkLabel(EMAIL)}
            onBlur={expandLabel(EMAIL)}
          />

          <label htmlFor={PASSWORD} className={labelClassnames[PASSWORD]}>{PASSWORD_TITLE}</label>
          <input
            id={PASSWORD}
            type={passwordVisible ? '' : PASSWORD}
            spellCheck={false}
            className={classes.passwordInput}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={shrinkLabel(PASSWORD)}
            onBlur={expandLabel(PASSWORD)}
          />
          <div className={classes.passwordVisibilityButton} onClick={() => setPasswordVisible(!passwordVisible)}>
            <GlassesIcon clear={passwordVisible} />
          </div>

          <button
            type="submit"
            className={classes.submit}
            disabled={
              !username.trim()
              || !email.trim()
              || !validator.isEmail(email.trim())
              || !displayName.trim()
              || !password
              || isLoading
            }
          >{isLoading ? LOADING_ : SIGN_UP}</button>

          <div className={classes.signInContainer}>
            {EXISTING_ACCOUNT_TEXT}
            <div className={classes.signInLink} onClick={() => navigate(endpoints.frontend.signIn)}>
              {LOG_IN}
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};

const styles = theme => ({
  labelError: {
    position: 'absolute',
    top: '4.5em',
    fontSize: '1.2em',
    color: 'red',
  },
  signUp: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    height: '1000vh',
    width: '100vw',
    backgroundColor: theme.palette.primary.background,
    zIndex: 2,
  },
  signUpForm: {
    top: '17vh',
    width: '40em',
    height: '42em',
    display: 'flex',
    position: 'absolute',
    flexDirection: 'column',
    padding: '0 5em 5em 5em',
    border: `1px solid ${theme.palette.secondary.border}`,
    borderRadius: '1em',
  },
  signUpHeader: {
    fontSize: '2em',
    fontWeight: 600,
    marginBottom: '0.5em'
  },
  signUpTopBar: {
    right: '2.5em',
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    marginBottom: '2em',
    justifyContent: 'space-between',
    width: '34em',
  },
  signUpClose: {
    fontSize: '2em',
    fontWeight: 600,
    cursor: 'pointer',
  },
  signUpWhycon: {
    marginTop: '1em',
  },
  signUpDetails: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  usernameLabelShrunk: {
    transition: 'font-size 0.4s, top 0.4s, left 0.4s',
    color: theme.palette.primary.label.original,
    position: 'absolute',
    top: '12.3em',
    left: '6.2em',
    fontSize: '0.9em',
  },
  usernameLabel: {
    transition: 'font-size 0.4s, top 0.4s, left 0.4s',
    color: theme.palette.primary.label.original,
    position: 'absolute',
    top: '7.4em',
    left: '3.5em',
    fontSize: '1.6em',
  },
  usernameInput: {
    fontSize: '2em',
    padding: '13px 5px 5px 5px',
    outline: 'none',
    borderRadius: '4px',
    border: `1px solid ${theme.palette.secondary.border}`,
    color: 'inherit',
    backgroundColor: theme.palette.primary.background,
  },
  displayNameLabelShrunk: {
    transition: 'font-size 0.4s, top 0.4s, left 0.4s',
    color: theme.palette.primary.label.original,
    position: 'absolute',
    top: '18.4em',
    left: '6.2em',
    fontSize: '0.9em',
  },
  displayNameLabel: {
    transition: 'font-size 0.4s, top 0.4s, left 0.4s',
    color: theme.palette.primary.label.original,
    position: 'absolute',
    top: '10.9em',
    left: '3.5em',
    fontSize: '1.6em',
  },
  displayNameInput: {
    fontSize: '2em',
    padding: '13px 5px 5px 5px',
    outline: 'none',
    borderRadius: '4px',
    border: `1px solid ${theme.palette.secondary.border}`,
    color: 'inherit',
    backgroundColor: theme.palette.primary.background,
  },
  emailLabelShrunk: {
    transition: 'font-size 0.4s, top 0.4s, left 0.4s',
    color: theme.palette.primary.label.original,
    position: 'absolute',
    top: '24.6em',
    left: '6.2em',
    fontSize: '0.9em',
  },
  emailLabel: {
    transition: 'font-size 0.4s, top 0.4s, left 0.4s',
    color: theme.palette.primary.label.original,
    position: 'absolute',
    top: '14.4em',
    left: '3.5em',
    fontSize: '1.6em',
  },
  emailInput: {
    fontSize: '2em',
    padding: '13px 5px 5px 5px',
    outline: 'none',
    borderRadius: '4px',
    border: `1px solid ${theme.palette.secondary.border}`,
    color: 'inherit',
    backgroundColor: theme.palette.primary.background,
  },
  passwordLabelShrunk: {
    transition: 'font-size 0.4s, top 0.4s, left 0.4s',
    color: theme.palette.primary.label.original,
    position: 'absolute',
    top: '30.7em',
    left: '6.2em',
    fontSize: '0.9em',
  },
  passwordLabel: {
    transition: 'font-size 0.4s, top 0.4s, left 0.4s',
    color: theme.palette.primary.label.original,
    position: 'absolute',
    top: '17.8em',
    left: '3.5em',
    fontSize: '1.6em',
  },
  passwordInput: {
    fontSize: '2em',
    padding: '13px 2.4em 5px 5px',
    outline: 'none',
    borderRadius: '4px',
    border: `1px solid ${theme.palette.secondary.border}`,
    color: 'inherit',
    backgroundColor: theme.palette.primary.background,
  },
  focusedLabel: {
    color: theme.palette.blue.original,
  },
  focusedInput: {
    border: `1px solid ${theme.palette.blue.original}`,
  },
  submit: {
    height: '3em',
    width: '14em',
    background: theme.palette.primary.background,
    border: `1px solid ${theme.palette.secondary.border}`,
    borderRadius: '5em',
    color: 'inherit',
    fontSize: '1.2em',
    fontWeight: 600,
    alignSelf: 'center',
    cursor: 'pointer',
    '&:disabled': {
      color: theme.palette.disabled.text,
      background: theme.palette.disabled.background,
    },
  },
  passwordVisibilityButton: {
    position: 'absolute',
    top: '28.8em',
    left: '30.8em',
    cursor: 'pointer',
  },
  signInContainer: {
    display: 'flex',
    position: 'absolute',
    bottom: '2em',
    left: '12em',
  },
  signInText: {

  },
  signInLink: {
    marginLeft: '0.3em',
    color: 'blue',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontWeight: 600,
  },
});

export default withStyles(styles)(SignUp);
