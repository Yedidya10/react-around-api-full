const checkAuth = () => {
  return localStorage.getItem('jwt') !== null;
};

export default checkAuth;