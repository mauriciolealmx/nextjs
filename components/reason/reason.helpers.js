export const debounce = (func, wait, immediate) => {
  let timeout;

  return function debouncedFn() {
    const later = () => {
      timeout = null;
      if (!immediate) {
        func();
      }
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) {
      func();
    }
  };
};
