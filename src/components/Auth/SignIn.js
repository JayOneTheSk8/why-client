import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { withStyles } from '@material-ui/core';

import constants from '../../constants';
import { AuthContext } from '../../authContext';
import { axiosInstance } from '../../axiosInstance';

import WhyCon from '../Shared/WhyCon';
import TextInput from '../Shared/TextInput';
import PasswordInput from '../Shared/PasswordInput';

const {
  endpoints,
  components: {
    auth: {
      SIGN_IN_HEADER,
      REGISTER_ACCOUNT_TEXT,
      SIGN_IN,
      SIGN_UP,
    },
  },
  errors: {
    keys: {
      GENERAL_ERROR,
    },
  },
  general: {
    fields: {
      PASSWORD,
      USERNAME,
    },
    titles: {
      PASSWORD_TITLE,
      USERNAME_TITLE,
    },
    fieldTexts: {
      LOADING_,
    },
  },
  util : {
    limits: {
      USERNAME_LIMIT,
    },
  },
} = constants;

const SignIn = ({ classes }) => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();

    setIsLoading(true);
    setErrors({});

    axiosInstance.post(endpoints.backend.signIn, {
      user: {
        login: username.trim(),
        password,
      }
    })
      .then(res => context.login(res.data))
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

  return(
    <div className={classes.signIn}>
      <form className={classes.signInForm} onSubmit={handleSignIn}>
        <div className={classes.signInTopBar}>
          <div className={classes.signInClose} onClick={() => navigate(endpoints.frontend.root)}>X</div>

          <div className={classes.signInWhycon}>
            <WhyCon width={'3.5em'} />
          </div>

          <div></div>
        </div>

        <div className={classes.signInHeader}>{SIGN_IN_HEADER}</div>
        {errors[GENERAL_ERROR] &&
          <>
            <span className={classes.labelError}>{errors[GENERAL_ERROR]}</span>
            <div></div>
          </>
        }

        <div className={classes.signInDetails}>
          <TextInput
            id={USERNAME}
            title={USERNAME_TITLE}
            changeFunc={(e) => setUsername(e.target.value)}
            maxLength={USERNAME_LIMIT}
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
              || !password
              || isLoading
            }
          >{isLoading ? LOADING_ : SIGN_IN}</button>

          <div className={classes.signUpContainer}>
            {REGISTER_ACCOUNT_TEXT}
            <div className={classes.signUpLink} onClick={() => navigate(endpoints.frontend.signUp)}>
              {SIGN_UP}
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
  signIn: {
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
  signInForm: {
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
  signInHeader: {
    fontSize: '2em',
    fontWeight: 600,
    marginBottom: '0.5em'
  },
  signInTopBar: {
    right: '2.5em',
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    marginBottom: '2em',
    justifyContent: 'space-between',
    width: '34em',
  },
  signInClose: {
    fontSize: '2em',
    fontWeight: 600,
    cursor: 'pointer',
  },
  signInWhycon: {
    marginTop: '1em',
  },
  signInDetails: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '14.6em',
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
  signUpContainer: {
    display: 'flex',
    position: 'absolute',
    bottom: '2em',
    left: '12em',
  },
  signUpText: {

  },
  signUpLink: {
    marginLeft: '0.3em',
    color: 'blue',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontWeight: 600,
  },
});

export default withStyles(styles)(SignIn);
