import axios from "axios";

const API_URL = "http://localhost:8000/api/user/";

const register = (username, email, password,password_confirmation,tc) => {
  console.log(username, email, password,password_confirmation,tc)
  return axios.post(API_URL + "register", {
    "name":
    username,
    email,
    password,
    password_confirmation,
    tc
  });
};

const login = (email, password) => {
  return axios
    .post(API_URL + "login", {
      email,
      password
    })
    .then((response) => {
      if (response) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
  return axios.post(API_URL + "signout").then((response) => {
    return response.data;
  });
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
}

export default AuthService;
