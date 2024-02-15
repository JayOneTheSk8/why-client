import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import validator from 'validator';

import constants from '../../constants';
import { AuthContext } from '../../authContext';
import { axiosInstance } from '../../axiosInstance';
import { useWindowDimensions } from '../../hooks';

import WhyCon from '../Shared/WhyCon';
import TextInput from '../Shared/TextInput';
import PasswordInput from '../Shared/PasswordInput';

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
      MOBILE_VIEW_PIXEL_LIMIT,
      USERNAME_LIMIT,
    },
  },
} = constants;

const SignUp = ({ classes }) => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const { width } = useWindowDimensions();

  const usernameInput = useRef(null);
  const displayNameInput = useRef(null);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [shrinkDisplayNameLabel, setShrinkDisplayNameLabel] = useState(false);

  const [mobileView, setMobileView] = useState(false);

  useEffect(() => {
    if (width < MOBILE_VIEW_PIXEL_LIMIT) {
      setMobileView(true);
    } else {
      setMobileView(false);
    }
  }, [width]);

  const updateUsername = (e) => {
    // Reject spaces
    const text = e.target.value.replaceAll(/ /g, '');

    usernameInput.current.value = text;
    setUsername(text);

    // Match display name if it's not filled in or being filled in
    // Make sure to shrink label
    if (!displayNameInput.current.value || displayNameInput.current.value === text.slice(0, -1)) {
      setShrinkDisplayNameLabel(true);
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
      <form className={mobileView ? classes.mobileSignUpForm : classes.signUpForm } onSubmit={handleSignUp}>
        <div className={mobileView ? classes.mobileSignUpTopBar : classes.signUpTopBar}>
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

        <div className={mobileView ? classes.mobileSignUpDetails : classes.signUpDetails}>
          <TextInput
            id={USERNAME}
            reference={usernameInput}
            title={USERNAME_TITLE}
            changeFunc={(e) => updateUsername(e)}
            maxLength={USERNAME_LIMIT}
          />

          <TextInput
            id={DISPLAY_NAME}
            reference={displayNameInput}
            title={DISPLAY_NAME_TITLE}
            overrideShrinkLabel={shrinkDisplayNameLabel}
            changeFunc={(e) => setDisplayName(e.target.value)}
          />

          <TextInput
            id={EMAIL}
            title={EMAIL_TITLE}
            changeFunc={(e) => setEmail(e.target.value)}
          />

          <PasswordInput
            id={PASSWORD}
            title={PASSWORD_TITLE}
            changeFunc={(e) => setPassword(e.target.value)}
          />

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

          <div className={mobileView ? classes.mobileSignInContainer : classes.signInContainer}>
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
  mobileSignUpForm: {
    top: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    position: 'absolute',
    flexDirection: 'column',
    padding: '0 5em 5em 5em',
    overflow: 'scroll',
  },
  signUpHeader: {
    fontSize: '2em',
    fontWeight: 600,
    marginBottom: '0.5em',
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
  mobileSignUpTopBar: {
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    marginBottom: '2em',
    justifyContent: 'space-between',
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
  mobileSignUpDetails: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '26em',
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
  signInContainer: {
    display: 'flex',
    position: 'absolute',
    bottom: '2em',
    left: '12em',
  },
  mobileSignInContainer: {
    display: 'flex',
    alignSelf: 'center',
    whiteSpace: 'nowrap',
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
