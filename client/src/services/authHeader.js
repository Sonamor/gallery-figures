export default function authHeader() {
  // Get the user accessToken saved in localstorage to use it in http requests tp the server
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.accessToken) {
    return { 'x-access-token': user.accessToken };
  }
  return {};
}
