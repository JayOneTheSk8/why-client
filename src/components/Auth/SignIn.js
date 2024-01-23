import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { withStyles } from '@material-ui/core';

import constants from '../../constants';
import { AuthContext } from '../../authContext';
import { axiosInstance } from '../../axiosInstance';

import WhyCon from '../Shared/WhyCon';
import GlassesIcon from '../Shared/GlassesIcon';

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
} = constants;

const SignIn = ({ classes }) => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [labelClassnames, setLabelClassnames] = useState({
    username: classes.usernameLabel,
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
          <label htmlFor={USERNAME} className={labelClassnames[USERNAME]}>{USERNAME_TITLE}</label>
          <input
            id={USERNAME}
            spellCheck={false}
            className={classes.usernameInput}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={shrinkLabel(USERNAME)}
            onBlur={expandLabel(USERNAME)}
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

const styles = () => ({
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
    backgroundColor: 'white',
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
    border: '1px solid black',
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
  usernameLabelShrunk: {
    transition: 'font-size 0.4s, top 0.4s, left 0.4s',
    position: 'absolute',
    top: '12.3em',
    left: '6.2em',
    fontSize: '0.9em',
  },
  usernameLabel: {
    transition: 'font-size 0.4s, top 0.4s, left 0.4s',
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
    border: '1px solid black',
  },
  passwordLabelShrunk: {
    transition: 'font-size 0.4s, top 0.4s, left 0.4s',
    position: 'absolute',
    top: '18.4em',
    left: '6.2em',
    fontSize: '0.9em',
  },
  passwordLabel: {
    transition: 'font-size 0.4s, top 0.4s, left 0.4s',
    position: 'absolute',
    top: '10.9em',
    left: '3.5em',
    fontSize: '1.6em',
  },
  passwordInput: {
    fontSize: '2em',
    padding: '13px 2.4em 5px 5px',
    outline: 'none',
    borderRadius: '4px',
    border: '1px solid black',
  },
  submit: {
    height: '3em',
    width: '14em',
    background: 'white',
    border: '1px solid black',
    borderRadius: '5em',
    color: 'black',
    fontSize: '1.2em',
    fontWeight: 600,
    alignSelf: 'center',
    cursor: 'pointer',
    '&:disabled': {
      background: '#DCDCDC',
    },
  },
  passwordVisibilityButton: {
    position: 'absolute',
    top: '17.8em',
    left: '30.8em',
    cursor: 'pointer',
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
