import { useEffect, useRef } from 'react';

import constants from './constants';

const {
  general: {
    eventTypes: {
      CLICK,
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
