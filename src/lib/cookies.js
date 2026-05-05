export function getCookie(name, defaultValue = "") {
  const value = localStorage.getItem(name);
  return value === null ? defaultValue : value;
}

export function setCookie(name, value) {
  localStorage.setItem(name, value);
}
