import React, { useContext, useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core';

import constants from '../../constants';
import { AuthContext } from '../../authContext';
import { axiosInstance } from '../../axiosInstance';

const {
  endpoints,
  components: {
    profilePage: {
      EDIT_PROFILE,
    },
  },
  errors: {
    keys: {
      GENERAL_ERROR,
    },
  },
  general: {
    fields: {
      DISPLAY_NAME,
      EMAIL,
    },
    titles: {
      DISPLAY_NAME_TITLE,
      EMAIL_TITLE,
    },
    fieldTexts: {
      LOADING_,
      SAVE,
    },
  },
} = constants;

const EditProfile = ({ classes, closeFunction }) => {
  const context = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(false);

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [labelClassnames, setLabelClassnames] = useState({
    displayName: classes.displayNameLabelShrunk,
    email: classes.emailLabelShrunk,
  });
  const [focusedInputs, setFocusedInputs] = useState({
    displayName: false,
    email: false,
  });

  useEffect(() => {
    setDisplayName(context.displayName);
    setEmail(context.email);
  }, [context]);

  const shrinkLabel = (field) => {
    return (e) => {
      e.preventDefault();
      setFocusedInputs({ ...focusedInputs, [field]: true });
      setLabelClassnames({ ...labelClassnames, [field]: classes[`${field}LabelShrunk`] });
    };
  };

  const expandLabel = (field) => {
    return (e) => {
      e.preventDefault();
      setFocusedInputs({ ...focusedInputs, [field]: false });

      if (e.target.value !== '') { return; }

      setLabelClassnames({ ...labelClassnames, [field]: classes[`${field}Label`] });
    };
  };

  const handeEditUser = (e) => {
    e.preventDefault();

    setIsLoading(true);
    setErrors({});

    axiosInstance.put(endpoints.backend.userData(context.id), {
      user: {
        display_name: displayName.trim(),
        email: email.trim(),
      },
    })
      .then((res) => {
        context.login(res.data);
        window.location.reload();
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
    <div className={classes.editProfile} onClick={() => closeFunction(false)}>
      <form onSubmit={handeEditUser} className={classes.editProfileForm} onClick={(e) => e.stopPropagation()}>
        <div className={classes.topBar}>
          <div className={classes.closeButton} onClick={() => closeFunction(false)}>X</div>
          <div className={classes.editProfileHeader}>{EDIT_PROFILE}</div>
          <button
            type="submit"
            className={classes.submit}
            disabled={
              isLoading
                || !displayName.trim()
                || !email.trim()
                || (displayName === context.displayName && email === context.email)
            }
          >
            {isLoading ? LOADING_ : SAVE}
          </button>
        </div>

        {
          errors[GENERAL_ERROR] &&
            <div className={classes.labelError}>{errors[GENERAL_ERROR]}</div>
        }

        <div className={classes.editProfileContainer}>
          <div className={classes.labelContainer}>
            <label
              htmlFor={DISPLAY_NAME}
              className={`${labelClassnames[DISPLAY_NAME]} ${focusedInputs[DISPLAY_NAME] ? classes.focusedLabel : ''}`}
            >
              {DISPLAY_NAME_TITLE}
            </label>
          </div>

          <input
            id={DISPLAY_NAME}
            spellCheck={false}
            className={`${classes.displayNameInput} ${focusedInputs[DISPLAY_NAME] ? classes.focusedInput : ''}`}
            defaultValue={context.displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            onFocus={shrinkLabel(DISPLAY_NAME)}
            onBlur={expandLabel(DISPLAY_NAME)}
          />

          <div className={classes.labelContainer}>
            <label
              htmlFor={EMAIL}
              className={`${labelClassnames[EMAIL]} ${focusedInputs[EMAIL] ? classes.focusedLabel : ''}`}
            >
              {EMAIL_TITLE}
            </label>
          </div>

          <input
            id={EMAIL}
            type={EMAIL}
            spellCheck={false}
            className={`${classes.emailInput} ${focusedInputs[EMAIL] ? classes.focusedInput : ''}`}
            defaultValue={context.email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={shrinkLabel(EMAIL)}
            onBlur={expandLabel(EMAIL)}
          />
        </div>
      </form>
    </div>
  );
};

const styles = theme => ({
  editProfile: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    height: '1000vh',
    width: '100vw',
    backgroundColor: 'rgb(0, 0, 0, 0.6)',
    zIndex: 4,
  },
  editProfileForm: {
    top: '17vh',
    width: '40em',
    height: '42em',
    display: 'flex',
    position: 'absolute',
    flexDirection: 'column',
    padding: '0 2em 2em 2em',
    border: `1px solid ${theme.palette.secondary.border}`,
    borderRadius: '1em',
    backgroundColor: theme.palette.primary.background,
    alignItems: 'center',
  },
  closeButton: {
    padding: '0.5em',
    cursor: 'pointer',
  },
  editProfileHeader: {

  },
  submit: {
    fontSize: '1em',
    fontWeight: 600,
    backgroundColor: theme.palette.primary.background,
    border: '1px solid black',
    borderRadius: '1em',
    padding: '0.2em 0.5em',
    color: theme.palette.primary.text,
    cursor: 'pointer',
    '&:disabled': {
      cursor: 'not-allowed',
      backgroundColor: theme.palette.disabled.background,
      color: theme.palette.disabled.text,
    }
  },
  labelContainer: {
    width: 0,
    height: 0,
  },
  displayNameLabel: {
    color: theme.palette.primary.label.original,
    position: 'relative',
    whiteSpace: 'nowrap',
    top: '0.3em',
    right: '7.8em',
    fontSize: '2em',
    transition: 'font-size 0.4s, top 0.4s, right 0.4s',
  },
  emailLabel: {
    color: theme.palette.primary.label.original,
    position: 'relative',
    whiteSpace: 'nowrap',
    top: '0.3em',
    right: '7.8em',
    fontSize: '2em',
    transition: 'font-size 0.4s, top 0.4s, right 0.4s',
  },
  displayNameLabelShrunk: {
    color: theme.palette.primary.label.original,
    position: 'relative',
    whiteSpace: 'nowrap',
    right: '17.2em',
    fontSize: '0.9em',
    transition: 'font-size 0.4s, top 0.4s, right 0.4s',
  },
  emailLabelShrunk: {
    color: theme.palette.primary.label.original,
    position: 'relative',
    whiteSpace: 'nowrap',
    right: '17.2em',
    fontSize: '0.9em',
    transition: 'font-size 0.4s, top 0.4s, right 0.4s',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '0.5em 0 1em 0',
    fontWeight: 600,
    fontSize: '1.5em',
    width: '23em',
  },
  labelError: {
    color: 'red',
  },
  editProfileContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  displayNameInput: {
    width: '16em',
    fontSize: '2em',
    padding: '17px 5px 5px 5px',
    outline: 'none',
    borderRadius: '4px',
    border: `1px solid ${theme.palette.secondary.border}`,
    marginBottom: '1em',
    color: 'inherit',
    backgroundColor: theme.palette.primary.background,
  },
  emailInput: {
    width: '16em',
    fontSize: '2em',
    padding: '17px 5px 5px 5px',
    outline: 'none',
    borderRadius: '4px',
    border: `1px solid ${theme.palette.secondary.border}`,
    marginBottom: '1em',
    color: 'inherit',
    backgroundColor: theme.palette.primary.background,
  },
  focusedLabel: {
    color: theme.palette.blue.original,
  },
  focusedInput: {
    border: `1px solid ${theme.palette.blue.original}`,
  },
});

export default withStyles(styles)(EditProfile);
