import { useEffect, useRef, useState } from 'react';

import constants from './constants';

const {
  general: {
    eventTypes: {
      CLICK,
      RESIZE,
    },
  },
} = constants;

// onClick outside element, run callback
export const useOnClickOutsideRef = (callback, initialValue = null) => {
  const elementRef = useRef(initialValue);

  useEffect(() => {
    const handler = (event) => {
      if (!elementRef.current?.contains(event.target)) {
        callback();
      }
    };
    window.addEventListener(CLICK, handler);
    return () => window.removeEventListener(CLICK, handler);
  }, [callback]);

  return elementRef;
};

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
};

// Keep track of window dimensions
export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions(getWindowDimensions());
    };

    window.addEventListener(RESIZE, handleResize);
    return () => window.removeEventListener(RESIZE, handleResize);
  }, []);

  return windowDimensions;
};
