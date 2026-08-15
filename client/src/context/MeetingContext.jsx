import { createContext, useState, useCallback, useContext } from 'react';
import meetingService from '../services/meetingService';
import { AuthContext } from './AuthContext';

export const MeetingContext = createContext(null);

export const MeetingProvider = ({ children }) => {
  const auth = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [historyMeetings, setHistoryMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMeetings = useCallback(async () => {
    if (!auth?.isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const res = await meetingService.getMeetings();
      setMeetings(res.meetings);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load meetings');
    } finally {
      setLoading(false);
    }
  }, [auth?.isAuthenticated]);

  const fetchUpcoming = useCallback(async () => {
    if (!auth?.isAuthenticated) return;
    try {
      const res = await meetingService.getUpcomingMeetings();
      setUpcomingMeetings(res.meetings);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load upcoming meetings');
    }
  }, [auth?.isAuthenticated]);

  const fetchHistory = useCallback(async () => {
    if (!auth?.isAuthenticated) return;
    try {
      const res = await meetingService.getMeetingHistory();
      setHistoryMeetings(res.meetings);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load meeting history');
    }
  }, [auth?.isAuthenticated]);

  const createMeeting = useCallback(async (data) => {
    const res = await meetingService.createMeeting(data);
    setMeetings((prev) => [res.meeting, ...prev]);
    return res.meeting;
  }, []);

  const removeMeeting = useCallback(async (id) => {
    await meetingService.deleteMeeting(id);
    setMeetings((prev) => prev.filter((m) => (m.id || m._id) !== id));
  }, []);

  const value = {
    meetings,
    upcomingMeetings,
    historyMeetings,
    loading,
    error,
    fetchMeetings,
    fetchUpcoming,
    fetchHistory,
    createMeeting,
    removeMeeting,
  };

  return (
    <MeetingContext.Provider value={value}>{children}</MeetingContext.Provider>
  );
};
