import axios from "axios";

const API_URL = `${window.location.protocol}//${window.location.hostname}:8080/api/auth/`;

class AuthService {

  // ✅ LOGIN UNIFICADO
  async login(username, password) {
    const response = await axios.post(API_URL + "signin", {
      username,
      password,
    });

    const data = response.data;

    if (data.accessToken) {
      // ✅ SOLO USAMOS "user"
      localStorage.setItem("user", JSON.stringify(data));
    }

    return data;
  }

  // ✅ LOGOUT LIMPIO
  logout() {
    try {
      axios.post(API_URL + "signout", {}, {
        headers: this.getAuthHeader(),
      });
    } catch (e) {}

    localStorage.removeItem("user");
  }

  register(name, lastname, dni, username, email, phone, password, gender) {
    return axios.post(API_URL + "signup", {
      name,
      lastname,
      dni,
      username,
      email,
      phone,
      password,
      gender,
    });
  }

  forgotPassword(data) {
    return axios.post(API_URL + "forgot-password", data);
  }

  validateResetCode(data) {
    return axios.post(API_URL + "validate-reset-code", data);
  }

  resetPassword(data) {
    return axios.post(API_URL + "reset-password", data);
  }

  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }

  // ✅ HEADER DESDE "user"
  getAuthHeader() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.accessToken) {
      return { Authorization: "Bearer " + user.accessToken };
    }
    return {};
  }
}

export default new AuthService();


