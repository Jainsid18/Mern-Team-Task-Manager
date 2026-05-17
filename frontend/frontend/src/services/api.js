import axios from "axios";

const API = axios.create({
  baseURL: "https://mern-team-task-manager.onrender.com",
});

export default API;
