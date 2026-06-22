export const safeGetItem = (key) => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const safeSetItem = (key, value) => {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};
