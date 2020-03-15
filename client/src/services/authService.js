/* eslint-disable class-methods-use-this */
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth/';

// Class used to handle the authentification of the users
class AuthService {
  // Send username and password to the "signin" route in the backend and store the returned accesstoken in the localstorage
  login(user) {
    return axios
      .post(`${API_URL}signin`, {
        username: user.username,
        password: user.password,
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  // Removing the stored item for the session to logout the user
  logout() {
    localStorage.removeItem('user');
  }
}

export default new AuthService();
