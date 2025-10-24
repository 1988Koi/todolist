import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "https://spamwarelist.azurewebsites.net/api-docs/";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;
