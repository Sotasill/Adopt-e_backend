import axios from 'axios';
import store from '../redux/store';
import { refreshToken, logout } from '../redux/auth/authActions';

// Создаем экземпляр axios с базовой конфигурацией
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000, // Таймаут в 5 секунд
});

// Эндпоинты API
export const API_URLS = {
  login: '/auth/login',
  registerBreeder: '/auth/register/breeder',
  registerUser: '/auth/register/user',
  refresh: '/auth/refresh',
  logout: '/auth/logout',
  updateAvatar: '/user/avatar',
  updateProfileBackground: '/user/profile/background',
};

// Проверка доступности сервера
export const checkServerAvailability = async () => {
  try {
    await api.get('/health');
    return true;
  } catch (error) {
    return false;
  }
};

// Интерцептор для добавления токена к запросам
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    // Публичные эндпоинты, не требующие авторизации
    const publicEndpoints = [
      API_URLS.login,
      API_URLS.registerBreeder,
      API_URLS.registerUser,
      API_URLS.refresh,
      '/health',
    ];

    // Добавляем Content-Type: application/json только если это не multipart/form-data
    if (!config.headers['Content-Type'] && !(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    if (token && user) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (!publicEndpoints.includes(config.url)) {
      // Если нет токена и пользователя, и это не публичный эндпоинт
      window.location.href = '/login';
      return Promise.reject('Не авторизован');
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// ... rest of the code stays the same ...
