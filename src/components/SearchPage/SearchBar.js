import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { withStyles } from '@material-ui/core';

import constants from '../../constants';
import { axiosInstance } from '../../axiosInstance';
import { useOnClickOutsideRef } from '../../hooks';

import LoadingIcon from '../Shared/LoadingIcon';

import SearchGlassIcon from './SearchGlassIcon';

const {
  endpoints,
  components: {
    searchPage: {
      searchFor,
      SEARCH,
    },
  },
  general: {
    fieldTexts: {
      usernameWithSymbol,
    },
  },
} = constants;

const SearchBar = ({ classes, defaultText, fromPage }) => {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState('');

  const [showUserResults, setShowUserResults] = useState(false);
  const [loadingUserResults, setLoadingUserResults] = useState(false);
  const [userResultsData, setUserResultsData] = useState({});

  const clickRef = useOnClickOutsideRef(() => showUserResults && setShowUserResults(false));

  useEffect(() => {
    if (defaultText) {
      setSearchText(defaultText);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e) => {
    e.preventDefault();
    setShowUserResults(false);
    navigate(endpoints.frontend.searchWithQuery(searchText));
  };

  const handleUserResults = (text) => {
    if (!text) {
      setShowUserResults(false);
      setUserResultsData({});

      return;
    }

    setLoadingUserResults(true);
    setUserResultsData({});

    axiosInstance.get(endpoints.backend.quickSearch, {
      params: {
        search: {
          text,
        },
      },
    })
      .then((res) => {
        setUserResultsData(res.data);
        setShowUserResults(true);
      })
      .catch(err => console.log(err))
      .finally(() => setLoadingUserResults(false));
  };

  const userResults = (data) => {
    const defaultSearch = (
      <div
        key={`${fromPage}-1`}
        className={classes.userResult}
        onClick={handleSearch}
      >
        <div className={classes.regularSearchText}>
          {searchFor(searchText)}
        </div>
      </div>
    );

    return [defaultSearch].concat(
      data.users.map((u, idx) => {
        return (
          <div
            key={`${fromPage}${idx}`}
            className={classes.userResult}
            onClick={() => {
              setShowUserResults(false);
              navigate(endpoints.frontend.userPage(u.username));
            }}
          >
            <div className={classes.userIconContainer}>
              <div className={classes.userIcon}>
                {u.username[0].toUpperCase()}
              </div>
            </div>

            <div className={classes.userDataContainer}>
              <div className={classes.userDisplayName}>
                {u.display_name}
              </div>
              <div className={classes.userUsername}>
                {usernameWithSymbol(u.username)}
              </div>
            </div>
          </div>
        );
      })
    );
  };

  return (
    <div className={classes.searchBarContainer} ref={clickRef}>
      <form className={classes.searchBar} onSubmit={handleSearch}>
        <SearchGlassIcon />
        <input
          type="text"
          className={classes.searchInput}
          defaultValue={defaultText}
          onChange={(e) => {
            setSearchText(e.target.value);
            handleUserResults(e.target.value);
          }}
          onFocus={() => handleUserResults(searchText)}
          placeholder={SEARCH}
        />
        <input type="submit" style={{display: 'none'}} />
      </form>

      <div className={classes.userResultsContainer}>
        {
          showUserResults &&
            (
              loadingUserResults
                ? <div className={classes.loadingIcon}>
                  <LoadingIcon />
                </div>
                : <div className={classes.userResults}>
                  { userResults(userResultsData) }
                </div>
            )
        }
      </div>
    </div>
  );
};

const styles = theme => ({
  searchBarContainer: {

  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    border: `2px solid ${theme.palette.secondary.border}`,
    padding: '0.3em',
    borderRadius: '4em',
    backgroundColor: theme.palette.disabled.background,
  },
  searchInput: {
    fontSize: '1.2em',
    border: 'none',
    outline: 'none',
    backgroundColor: theme.palette.disabled.background,
    color: theme.palette.primary.text,
    width: '100%'
  },
  loadingIcon: {
    border: `1px solid ${theme.palette.secondary.border}`,
    width: '100%',
    borderRadius: '1em',
    position: 'relative',
    zIndex: 3,
    backgroundColor: theme.palette.primary.background,
    display: 'flex',
    justifyContent: 'center',
  },
  userResultsContainer: {
    width: '100%',
    height: 0,
  },
  userResults: {
    border: `1px solid ${theme.palette.secondary.border}`,
    borderRadius: '1em',
    position: 'relative',
    zIndex: 3,
    backgroundColor: theme.palette.primary.background,
  },
  userResult: {
    display: 'flex',
    padding: '0.5em',
    cursor: 'pointer',
    borderRadius: '1em',
    '&:hover': {
      backgroundColor: theme.palette.primary.hover,
    },
  },
  userIconContainer: {

  },
  userIcon: {
    backgroundColor: 'black',
    border: '3px solid grey',
    color: 'white',
    fontSize: '2em',
    borderRadius: '100%',
    padding: '0.2em',
    width: '1.5em',
    height: '1.5em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDataContainer: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    marginLeft: '0.3em',
  },
  userDisplayName: {
    fontWeight: 600,
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  userUsername: {

  },
  regularSearchText: {
    fontSize: '1.2em',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  }
});

export default withStyles(styles)(SearchBar);