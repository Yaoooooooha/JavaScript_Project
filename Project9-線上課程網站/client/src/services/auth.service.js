import axios from "axios";
const API_URL = "http://localhost:8080/api/user";

// 負責連接到對應的 Auth-Route
class AuthService {
  // Instance Methods
  login(email, password) {
    return axios.post(API_URL + "/login", { email, password });
  }
  logout() {
    localStorage.removeItem("user"); // 移除 JWT => 登出
  }
  register(username, email, password, role) {
    return axios.post(API_URL + "/register", {
      // 要提交的資料
      username,
      email,
      password,
      role,
    });
  }
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

export default new AuthService(); // export Object not Class
