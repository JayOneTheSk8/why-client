import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { withStyles } from '@material-ui/core';

import constants from '../../constants';
import { AuthContext } from '../../authContext';

import UserIcon from '../Shared/UserIcon';
import SearchGlassIcon from '../SearchPage/SearchGlassIcon';

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
} = constants;

const Sidebar = ({ classes }) => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [highlightedProfileIcon, setHighlightedProfileIcon] = useState(false);
  const [highlightedSearchIcon, setHighlightedSearchIcon] = useState(false);

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

  const navigateToProfile = () => {
    if (context.id) {
      navigate(endpoints.frontend.userPage(context.username));
    } else {
      navigate(endpoints.frontend.signIn);
    }
  };

  return (
    <div className={classes.sidebar}>
      <div className={classes.sidebarOption} onClick={() => navigate(endpoints.frontend.search)}>
        <SearchGlassIcon width={'4em'} height={'3.3em'} />
        <div
          className={`${
            classes.optionText
          } ${
            highlightedSearchIcon ? classes.highlightedOptionText : ''
          }`}
        >
          {SEARCH}
        </div>
      </div>

      <div className={classes.sidebarOption} onClick={navigateToProfile}>
        <UserIcon highlighted={highlightedProfileIcon} />
        <div
          className={`${
            classes.optionText} ${
            highlightedProfileIcon ? classes.highlightedOptionText : ''
          }`}
        >
          {PROFILE}
        </div>
      </div>
    </div>
  );
};

const styles = () => ({
  sidebar: {

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
  },
  searchIcon: {

  },
});

export default withStyles(styles)(Sidebar);
