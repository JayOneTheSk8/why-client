import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core';

import constants from '../../constants';
import { dispatchEvent } from '../../util';

import GithubIcon from '../Shared/GithubIcon';
import LinkedInIcon from '../Shared/LinkedInIcon';

import websiteImg from './Website.png';

const {
  components: {
    aboutPage: {
      ABOUT_HEADER,
      CLIENT_GITHUB_REPO_URL,
      CLIENT_GITHUB_REPO_TEXT,
      SERVER_GITHUB_REPO_URL,
      SERVER_GITHUB_REPO_TEXT,
      GITHUB_PROFILE_URL,
      GITHUB_PROFILE_TEXT,
      LINKEDIN_PROFILE_URL,
      LINKEDIN_PROFILE_TEXT,
      WEBSITE_URL,
      WEBSITE_TEXT,
    },
  },
  general: {
    eventTypes: {
      RESIZE_BORDER_EXTENSION,
    },
  },
} = constants;

const AboutPage = ({ classes }) => {
  const [highlightedWebsite, setHighlightedWebsite] = useState(false);

  useEffect(() => dispatchEvent(RESIZE_BORDER_EXTENSION), []);

  return (
    <div className={classes.aboutPage}>
      <div className={classes.aboutHeader}>
        {ABOUT_HEADER}
      </div>

      <a className={classes.urlLink} href={CLIENT_GITHUB_REPO_URL} target="_blank" rel="noreferrer">
        <GithubIcon />
        <div className={classes.linkText}>
          {CLIENT_GITHUB_REPO_TEXT}
        </div>
      </a>

      <a className={classes.urlLink} href={SERVER_GITHUB_REPO_URL} target="_blank" rel="noreferrer">
        <GithubIcon />
        <div className={classes.linkText}>
          {SERVER_GITHUB_REPO_TEXT}
        </div>
      </a>

      <a className={classes.urlLink} href={GITHUB_PROFILE_URL} target="_blank" rel="noreferrer">
        <GithubIcon />
        <div className={classes.linkText}>
          {GITHUB_PROFILE_TEXT}
        </div>
      </a>

      <a className={classes.urlLink} href={LINKEDIN_PROFILE_URL} target="_blank" rel="noreferrer">
        <LinkedInIcon />
        <div className={classes.linkText}>
          {LINKEDIN_PROFILE_TEXT}
        </div>
      </a>

      <a
        className={classes.linkWithMedia}
        href={WEBSITE_URL}
        onMouseEnter={() => setHighlightedWebsite(true)}
        onMouseLeave={() => setHighlightedWebsite(false)}
        target="_blank"
        rel="noreferrer"
      >
        <div className={classes.linkText}>
          {WEBSITE_TEXT}
        </div>
        <img
          src={websiteImg}
          className={
            `${
              classes.mediaImage
            } ${
              highlightedWebsite ? classes.highlightedMediaImage :  classes.nonhighlightedMediaImage
            }`
          }
        />
      </a>
    </div>
  );
};

const styles = theme => ({
  aboutPage: {
    paddingTop: '2em',
    borderRight: `1px solid ${theme.palette.primary.border}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  aboutHeader: {
    fontSize: '1.3em',
    fontWeight: 600,
    textAlign: 'center',
    padding: '0 2em',
    marginBottom: '1em',
    whiteSpace: 'pre-wrap',
  },
  urlLink: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: theme.palette.primary.text,
    marginBottom: '1em',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  linkText: {
    marginLeft: '0.5em',
    fontWeight: 600,
    fontSize: '1.5em',
  },
  linkWithMedia: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textDecoration: 'none',
    color: theme.palette.primary.text,
    marginBottom: '1em',
  },
  mediaImage: {
    width: '40vw'
  },
  nonhighlightedMediaImage: {
    border: '8px double transparent',
  },
  highlightedMediaImage: {
    border: `8px double ${theme.palette.primary.text}`
  },
});

export default withStyles(styles)(AboutPage);
