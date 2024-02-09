import React from 'react';
import { withStyles } from '@material-ui/core';

const SearchGlassIcon = ({ classes, width, height, highlighted }) => {
  return (
    <svg
      className={classes.searchGlassIcon}
      width={width || '1.5em'}
      height={height || '1.5em'}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 32 32"
      version="1.1"
      xmlSpace="preserve"
      strokeWidth={highlighted ? 3 : 1}
    >
      <g transform="matrix(1,0,0,1,-432,-48)">
        <path d="M452.626,70.009C452.64,70.025 452.655,70.04 452.67,70.056L460.254,77.639C460.644,78.029 461.277,78.029 461.668,77.639C462.058,77.249 462.058,76.615 461.668,76.225L454.084,68.641C454.068,68.625 454.052,68.61 454.035,68.595C455.679,66.629 456.669,64.096 456.669,61.334C456.669,55.079 451.59,50 445.334,50C439.079,50 434,55.079 434,61.334C434,67.59 439.079,72.669 445.334,72.669C448.111,72.669 450.655,71.668 452.626,70.009ZM445.334,52C450.486,52 454.669,56.183 454.669,61.334C454.669,66.486 450.486,70.669 445.334,70.669C440.183,70.669 436,66.486 436,61.334C436,56.183 440.183,52 445.334,52Z" />
      </g>
    </svg>
  );
};

const styles = theme => ({
  searchGlassIcon: {
    fill: theme.palette.primary.text,
    stroke: theme.palette.primary.text,
  },
});

export default withStyles(styles)(SearchGlassIcon);
