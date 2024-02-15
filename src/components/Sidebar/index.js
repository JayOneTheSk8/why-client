import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { withStyles } from '@material-ui/core';

import constants from '../../constants';
import { AuthContext } from '../../authContext';
import { useWindowDimensions } from '../../hooks';

import UserIcon from '../Shared/UserIcon';
import SearchGlassIcon from '../SearchPage/SearchGlassIcon';
import DarkModeCheckbox from '../Shared/DarkModeCheckbox';

const {
  endpoints,
  components: {
    profilePage: {
      PROFILE
    },
    searchPage: {
      SEARCH,
    },
  },
  util: {
    limits: {
      MOBILE_VIEW_PIXEL_LIMIT,
    },
  },
} = constants;

const Sidebar = ({ classes }) => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const { width } = useWindowDimensions();

  const [highlightedProfileIcon, setHighlightedProfileIcon] = useState(false);
  const [highlightedSearchIcon, setHighlightedSearchIcon] = useState(false);
  const [mobileView, setMobileView] = useState(false);

  useEffect(() => {
    if (context.id) {
      // Highlight Profile
      if (location.pathname === endpoints.frontend.userPage(context.username)) {
        setHighlightedProfileIcon(true);
      } else {
        setHighlightedProfileIcon(false);
      }

      // Highlight Search
      if (location.pathname === endpoints.frontend.search) {
        setHighlightedSearchIcon(true);
      } else {
        setHighlightedSearchIcon(false);
      }
    }
  }, [context, location]);

  useEffect(() => {
    if (width < MOBILE_VIEW_PIXEL_LIMIT) {
      setMobileView(true);
    } else {
      setMobileView(false);
    }
  }, [width]);

  const navigateToProfile = () => {
    if (context.id) {
      navigate(endpoints.frontend.userPage(context.username));
    } else {
      navigate(endpoints.frontend.signIn);
    }
  };

  return (
    <div className={classes.sidebar}>
      <div className={mobileView ? classes.mobileSidebarOption : classes.sidebarOption} onClick={() => navigate(endpoints.frontend.search)}>
        <SearchGlassIcon width={'4em'} height={'3.3em'} highlighted={highlightedSearchIcon} />
        {
          mobileView ||
            <div
              className={`${
                classes.optionText
              } ${
                highlightedSearchIcon ? classes.highlightedOptionText : ''
              }`}
            >
              {SEARCH}
            </div>
        }
      </div>

      <div className={mobileView ? classes.mobileSidebarOption : classes.sidebarOption} onClick={navigateToProfile}>
        <UserIcon highlighted={highlightedProfileIcon} />

        {
          mobileView ||
            <div
              className={`${
                classes.optionText} ${
                highlightedProfileIcon ? classes.highlightedOptionText : ''
              }`}
            >
              {PROFILE}
            </div>
        }
      </div>

      {
        mobileView &&
          <div className={mobileView ? classes.mobileSidebarOption : classes.sidebarOption}>
            <div className={classes.darkModeCheckbox}>
              <DarkModeCheckbox />
            </div>
          </div>
      }
    </div>
  );
};

const styles = theme => ({
  sidebar: {
    width: 'max-content',
  },
  highlightedOptionText: {
    fontWeight: 600,
  },
  optionText: {
    fontSize: '2em',
    marginLeft: '0.3em',
  },
  sidebarOption: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    width: 'max-content',
    marginTop: '2em',
    borderRadius: '4em',
    transition: 'background-color 0.2s',
    padding: '5px 7px',
    '&:hover': {
      backgroundColor: theme.palette.primary.hover,
    },
  },
  mobileSidebarOption: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    width: 'max-content',
    borderRadius: '4em',
    transition: 'background-color 0.2s',
    padding: '5px 7px',
    '&:hover': {
      backgroundColor: theme.palette.primary.hover,
    },
  },
  darkModeCheckbox: {
    marginLeft: '0.5em',
  },
  searchIcon: {

  },
});

export default withStyles(styles)(Sidebar);
