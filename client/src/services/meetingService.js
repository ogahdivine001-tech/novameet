import api from './api';

const createMeeting = async (data) => {
  const res = await api.post('/meetings', data);
  return res.data;
};

const getMeetings = async () => {
  const res = await api.get('/meetings');
  return res.data;
};

const getUpcomingMeetings = async () => {
  const res = await api.get('/meetings/upcoming');
  return res.data;
};

const getMeetingHistory = async () => {
  const res = await api.get('/meetings/history');
  return res.data;
};

const getMeetingById = async (id) => {
  const res = await api.get(`/meetings/${id}`);
  return res.data;
};

const joinMeeting = async (meetingId, password) => {
  const res = await api.post(`/meetings/${meetingId}/join`, { password });
  return res.data;
};

const endMeeting = async (id) => {
  const res = await api.post(`/meetings/${id}/end`);
  return res.data;
};

const deleteMeeting = async (id) => {
  const res = await api.delete(`/meetings/${id}`);
  return res.data;
};

const meetingService = {
  createMeeting,
  getMeetings,
  getUpcomingMeetings,
  getMeetingHistory,
  getMeetingById,
  joinMeeting,
  endMeeting,
  deleteMeeting,
};

export default meetingService;
