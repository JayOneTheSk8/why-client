import React from 'react';
import { withStyles } from '@material-ui/core';

const LikeIcon = ({ classes, liked, highlighted }) => {
  return (
    <>
      {
        liked
          ? <svg
            className={classes.likeIcon}
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="3.18 3.4 25.2 25.2"
            enableBackground="new 3.18 3.4 25.2 25.2"
            xmlSpace="preserve"
          >
            <g>
              <path fill="#FF1D1D" d="M16.703,8.615C16.667,8.646,16.438,8.896,16,8.904c-0.265,0-0.52-0.106-0.707-0.293   C13.146,6.464,9.66,6.463,7.513,8.61c-2.146,2.146-2.146,5.631,0,7.778l8.485,8.485l8.486-8.485c2.146-2.146,2.146-5.632,0-7.778   C22.344,6.47,19.059,6.565,16.703,8.615z" />
              <path fill="#FF1D1D" d="M16.004,6.576c-2.941-2.289-7.202-2.083-9.905,0.619c-2.927,2.927-2.927,7.68,0,10.607l9.192,9.192   c0.391,0.391,1.024,0.391,1.415,0l9.192-9.192c2.927-2.927,2.927-7.68,0-10.607C23.208,4.505,18.947,4.315,16.004,6.576z    M24.484,16.388l-8.486,8.485l-8.485-8.485c-2.146-2.146-2.146-5.632,0-7.778c2.147-2.147,5.633-2.146,7.78,0.001   C15.48,8.798,15.735,8.904,16,8.904c0.438-0.008,0.667-0.258,0.703-0.289c2.355-2.05,5.641-2.146,7.781-0.005   C26.63,10.756,26.63,14.241,24.484,16.388z" />
            </g>
          </svg>
          : <svg
            className={classes.likeIcon}
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="3.18 3.4 25.2 25.2"
            xmlSpace="preserve"
          >
            <g>
              <path fill={highlighted ? '#FF1D1D' : '#848484'} d="M16.004,6.576c-2.941-2.289-7.202-2.083-9.905,0.619c-2.927,2.927-2.927,7.68,0,10.607l9.192,9.192   c0.391,0.391,1.024,0.391,1.415,0l9.192-9.192c2.927-2.927,2.927-7.68,0-10.607C23.208,4.505,18.947,4.315,16.004,6.576z M16,8.904   L16,8.904c0.438-0.008,0.667-0.258,0.703-0.289c2.355-2.05,5.641-2.146,7.781-0.005c2.146,2.146,2.146,5.631,0,7.778l-8.486,8.485   l-8.485-8.485c-2.146-2.146-2.146-5.632,0-7.778c2.147-2.147,5.633-2.146,7.78,0.001C15.48,8.798,15.735,8.904,16,8.904z" />
            </g>
          </svg>
      }
    </>
  );
};

const styles = () => ({
  likeIcon: {
    width: '1.2em',
    height: '1.2em',
  },
});

export default withStyles(styles)(LikeIcon);
