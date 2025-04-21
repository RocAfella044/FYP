// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // Change this to your Django backend URL
});

export default api;
