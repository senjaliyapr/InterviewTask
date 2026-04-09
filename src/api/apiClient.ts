import axios from 'axios';
import { store } from '../store';
import { clearPersistedAuth } from '../store/slices/authSlice';

const apiClient = axios.create({
  baseURL: 'https://dev.softwareco.com/interview',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    if (status === 401) {
      store.dispatch(clearPersistedAuth());
    }
    return Promise.reject(err);
  },
);

export default apiClient;
