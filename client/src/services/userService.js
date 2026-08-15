import api from './api';

const getProfile = async () => {
  const res = await api.get('/users/profile');
  return res.data;
};

const updateProfile = async (data) => {
  const res = await api.put('/users/profile', data);
  return res.data;
};

const updatePassword = async (data) => {
  const res = await api.put('/users/password', data);
  return res.data;
};

const userService = { getProfile, updateProfile, updatePassword };

export default userService;
