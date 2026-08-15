import api from './api';

const register = async (data) => {
  const res = await api.post('/auth/register', data);
  return res.data;
};

const login = async (data) => {
  const res = await api.post('/auth/login', data);
  return res.data;
};

const getMe = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};

const authService = { register, login, getMe };

export default authService;
