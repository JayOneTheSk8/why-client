export const dispatchEvent = (eventName, payload = {}) => {
  const event = new CustomEvent(eventName, { detail: payload });
  window.dispatchEvent(event);
};
