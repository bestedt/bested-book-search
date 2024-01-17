// using this package to decode the token and get the user's information out of it
import decode from 'jwt-decode';

// creating a new class AuthService
class AuthService {
  // get user data
  getProfile() {
    return decode(this.getToken());
  }

  // check if user's logged in
  loggedIn() {
    const token = this.getToken();
    const isTokenValid = !!token && !this.isTokenExpired(token);
  
    console.log('Token:', token);
    console.log('Is Token Valid:', isTokenValid);
  
    return isTokenValid;
  }
  
  // check if token is expired
  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  }

  getToken() {
    // retrieves the user token from localStorage
    return localStorage.getItem('id_token');
  }

  login(idToken) {
    // saving user token to localStorage
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  logout() {
    // clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    // this will reload the page and reset the state of the application
    window.location.assign('/');
  }
}

export default new AuthService();
