export function getCookie(name, defaultValue = "") {
  const cookies = Object.fromEntries(document.cookie.split("; ").map((row) => row.split("=")));
  const value = cookies[name];
  return value === undefined ? defaultValue : decodeURIComponent(value);
}

export function setCookie(name, value) {
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=31536000; path=/; SameSite=Lax`;
}

export function clearCookie(name) {
  document.cookie = `${name}=; max-age=0; path=/; SameSite=Lax`;
}
