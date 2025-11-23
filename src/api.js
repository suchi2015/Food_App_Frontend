import axios from "axios";

const Api = axios.create({
  baseURL: "http://localhost:5000", // your backend url
});

// Add token automatically to requests
Api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = token;
  }
  return req;
});

export default Api;
