import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { withStyles } from '@material-ui/core';

import constants from '../../constants';
import { axiosInstance } from '../../axiosInstance';
import { useWindowDimensions } from '../../hooks';
import { dispatchEvent } from '../../util';

import BackIcon from '../Shared/BackIcon';
import LoadingIcon from '../Shared/LoadingIcon';
import ProfileItem from '../Shared/ProfileItem';
import PostItem from '../Shared/PostItem';

import SearchBar from './SearchBar';
import TopSearch from './TopSearch';

const {
  endpoints,
  components: {
    searchPage: {
      QUERY,
      unfoundMessage,
      headers: {
        TOP,
        PEOPLE,
        POSTS,
        COMMENTS,
      },
    },
  },
  errors: {
    componentMessages: {
      errorFormat,
    },
    keys: {
      GENERAL_ERROR,
    },
  },
  general: {
    eventTypes: {
      RESIZE_BORDER_EXTENSION,
    },
    fieldTexts: {
      REFRESH,
    },
  },
  util: {
    limits: {
      MOBILE_VIEW_PIXEL_LIMIT,
    },
  },
} = constants;

const SearchPage = ({ classes }) => {
  const [searchParams] = useSearchParams();
  const { width } = useWindowDimensions();

  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [selectedPage, setSelectedPage] = useState(TOP);
  const [mobileView, setMobileView] = useState(false);

  useEffect(() => dispatchEvent(RESIZE_BORDER_EXTENSION), [isLoading, data]);
  useEffect(() => getData(searchParams), [searchParams, selectedPage]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (width < MOBILE_VIEW_PIXEL_LIMIT) {
      setMobileView(true);
    } else {
      setMobileView(false);
    }
  }, [width]);

  const pageEndpoint = () => {
    switch (selectedPage) {
      case TOP:
        return endpoints.backend.topSearch;
      case PEOPLE:
        return endpoints.backend.usersSearch;
      case POSTS:
        return endpoints.backend.postsSearch;
      case COMMENTS:
        return endpoints.backend.commentsSearch;
      default:
        return endpoints.backend.topSearch;
    }
  };

  const getData = (params) => {
    setIsLoading(true);
    setErrors({});
    setData({});

    const text = decodeURIComponent(params.get(QUERY));
    const searchEndpoint = pageEndpoint();

    axiosInstance.get(searchEndpoint, {
      params: {
        search: {
          text,
        },
      },
    })
      .then((res) => setData(res.data))
      .catch(err => {
        if (err.response) {
          const { data: errorData } = err.response;

          if (errorData.errors) {
            setErrors({ ...errors, [GENERAL_ERROR]: errorData.errors.join(', ') });
          } else {
            setErrors({ ...errors, [GENERAL_ERROR]: err.message });
          }
        } else {
          setErrors({ ...errors, [GENERAL_ERROR]: err.message });
        }
      })
      .finally(() => setIsLoading(false));
  };

  const profileItems = (users) => {
    if (users.length === 0) {
      return (
        <div className={classes.noDataText}>
          {unfoundMessage('users')}
        </div>
      );
    }

    return users.map((u, idx) => {
      return (
        <ProfileItem key={`SearchPeople${idx}`} user={u} />
      );
    });
  };

  const postItems = (posts) => {
    if (posts.length === 0) {
      return (
        <div className={classes.noDataText}>
          {unfoundMessage(POSTS)}
        </div>
      );
    }

    return posts.map((p, idx) => {
      return (
        <PostItem key={`SearchPosts${idx}`} post={p} />
      );
    });
  };

  const commentItems = (comments) => {
    if (comments.length === 0) {
      return (
        <div className={classes.noDataText}>
          {unfoundMessage(COMMENTS)}
        </div>
      );
    }

    return comments.map((c, idx) => {
      return (
        <PostItem key={`SearchComment${idx}`} post={c} isComment />
      );
    });
  };

  if (Object.keys(errors).length) return <div className={classes.errorsContainer}>
    <div className={classes.errorsHeader}>{errorFormat(Object.values(errors).join(', '))}</div>
    <div className={classes.refreshPage} onClick={() => getData(searchParams)}>{REFRESH}</div>
  </div>;

  return (
    <div className={classes.searchPage}>
      <div className={mobileView ? classes.mobileNavbar : classes.navbar}>
        <div className={classes.searchHeader}>
          <div className={classes.backButton}>
            <BackIcon />
          </div>

          <div className={classes.searchBar}>
            <SearchBar defaultText={searchParams.get(QUERY)} fromPage={'SearchPage'} />
          </div>

          <div></div>
        </div>

        <div className={classes.searchPageNavbar}>
          <div
            className={classes.navbarOptionContainer}
            onClick={() => {
              if (selectedPage !== TOP) {
                setIsLoading(true);
                setSelectedPage(TOP);
              }
            }}
          >
            <div className={selectedPage === TOP ? classes.selectedNavbarOption : classes.navbarOption}>{TOP}</div>
            {
              selectedPage === TOP &&
                <div className={classes.selectedPage}></div>
            }
          </div>

          <div
            className={classes.navbarOptionContainer}
            onClick={() => {
              if (selectedPage !== PEOPLE) {
                setIsLoading(true);
                setSelectedPage(PEOPLE);
              }
            }}
          >
            <div className={selectedPage === PEOPLE ? classes.selectedNavbarOption : classes.navbarOption}>{PEOPLE}</div>
            {
              selectedPage === PEOPLE &&
                <div className={classes.selectedPage}></div>
            }
          </div>

          <div
            className={classes.navbarOptionContainer}
            onClick={() => {
              if (selectedPage !== POSTS) {
                setIsLoading(true);
                setSelectedPage(POSTS);
              }
            }}
          >
            <div className={selectedPage === POSTS ? classes.selectedNavbarOption : classes.navbarOption}>{POSTS}</div>
            {
              selectedPage === POSTS &&
                <div className={classes.selectedPage}></div>
            }
          </div>

          <div
            className={classes.navbarOptionContainer}
            onClick={() => {
              if (selectedPage !== COMMENTS) {
                setIsLoading(true);
                setSelectedPage(COMMENTS);
              }
            }}
          >
            <div className={selectedPage === COMMENTS ? classes.selectedNavbarOption : classes.navbarOption}>{COMMENTS}</div>
            {
              selectedPage === COMMENTS &&
                <div className={classes.selectedPage}></div>
            }
          </div>
        </div>
      </div>

      {
        isLoading
          ? <div className={classes.loadingIcon}>
            <LoadingIcon />
          </div>
          : selectedPage === TOP
            ? <TopSearch searchData={data} />
            : selectedPage === PEOPLE
              ? profileItems(data.users)
              : selectedPage === POSTS
                ? postItems(data.posts)
                : selectedPage === COMMENTS && commentItems(data.comments)
      }
      <div className={classes.searchResults}></div>
    </div>
  );
};

const styles = theme => ({
  searchPage: {
    paddingTop: '8.89em',
  },
  loadingIcon: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRight: `1px solid ${theme.palette.primary.border}`
  },
  errorsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '1em',
    borderRight: `1px solid ${theme.palette.primary.border}`,
  },
  errorsHeader: {
    fontSize: '2em',
    fontWeight: 600,
    textAlign: 'center',
  },
  refreshPage: {
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  navbar: {
    position: 'fixed',
    top: 0,
    backgroundColor: theme.palette.primary.navbar,
    borderRight: `1px solid ${theme.palette.primary.border}`,
    width: theme.centerPanel.width,
    borderBottom: `1px solid ${theme.palette.primary.border}`,
    backdropFilter: 'blur(2px)',
  },
  mobileNavbar: {
    position: 'fixed',
    top: 0,
    backgroundColor: theme.palette.primary.navbar,
    borderRight: `1px solid ${theme.palette.primary.border}`,
    width: theme.centerPanel.mobileWidth,
    borderBottom: `1px solid ${theme.palette.primary.border}`,
    backdropFilter: 'blur(2px)',
  },
  searchHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1em',
  },
  backButton: {
    display: 'flex',
  },
  searchBar: {
    width: '50%',
  },
  searchPageNavbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  navbarOptionContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '25%',
    cursor: 'pointer',
    transition: 'background-color 0.4s',
    '&:hover': {
      backgroundColor: theme.palette.primary.hover,
    },
  },
  selectedNavbarOption: {
    fontSize: '1.2em',
    padding: '1em',
    fontWeight: 600,
    color: theme.palette.primary.text,
  },
  navbarOption: {
    fontSize: '1.2em',
    padding: '1em',
    color: theme.palette.disabled.text,
  },
  selectedPage: {
    border: `2px solid ${theme.palette.blue.original}`,
    borderRadius: '3em',
    width: '2.5em',
  },
  searchResults: {

  },
  noDataText: {
    borderRight: `1px solid ${theme.palette.primary.border}`,
    textAlign: 'center',
    fontSize: '2em',
    color: '#8b8b8b',
  },
});

export default withStyles(styles)(SearchPage);
