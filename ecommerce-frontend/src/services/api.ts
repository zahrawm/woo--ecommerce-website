import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:3000/api',
//   withCredentials: true
// });

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // Enable if using cookies for authentication
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
