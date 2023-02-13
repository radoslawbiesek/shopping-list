const TOKEN_KEY = 'auth_token';

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function deleteToken() {
  return localStorage.removeItem(TOKEN_KEY);
}
