const BASE_URL = process.env.NODE_ENV === 'production' ? 'http://api.around.us.to' : 'http://localhost:3000';

const customFetch = async (url, headers) => {
  const res = await fetch(url, headers);
  return await (
    res.ok ? res.json() : Promise.reject(res.statusText));
};

export const register = (email, password) => {
  return customFetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
};

export const login = (email, password) => {
  return customFetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
};

export const getUserToken = (token) => {
  return customFetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};
