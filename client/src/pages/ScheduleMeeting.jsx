import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiMenu, HiCalendar } from 'react-icons/hi';
import Sidebar from '../components/Sidebar';
import MeetingCard from '../components/MeetingCard';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import MeetingModal from '../components/MeetingModal';
import useMeeting from '../hooks/useMeeting';
import { copyToClipboard, buildMeetingLink } from '../utils/meetingUtils';

const ScheduleMeeting = () => {
  const navigate = useNavigate();
  const { upcomingMeetings, loading, fetchUpcoming, createMeeting } = useMeeting();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [createdMeeting, setCreatedMeeting] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 60,
  });

  useEffect(() => {
    fetchUpcoming();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.date || !formData.time) {
      setError('Please fill in the title, date, and time');
      return;
    }

    const scheduledAt = new Date(`${formData.date}T${formData.time}`);
    if (Number.isNaN(scheduledAt.getTime()) || scheduledAt < new Date()) {
      setError('Please choose a valid future date and time');
      return;
    }

    setCreating(true);
    try {
      const meeting = await createMeeting({
        title: formData.title,
        description: formData.description,
        meetingType: 'scheduled',
        scheduledAt: scheduledAt.toISOString(),
        duration: Number(formData.duration) || 60,
      });
      setCreatedMeeting(meeting);
      fetchUpcoming();
      setFormData({ title: '', description: '', date: '', time: '', duration: 60 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule meeting');
    } finally {
      setCreating(false);
    }
  };

  const handleCopyLink = async (meetingId) => {
    await copyToClipboard(buildMeetingLink(meetingId));
  };

  return (
    <div className="flex min-h-screen bg-[rgb(var(--color-bg))]">
      <Sidebar mobileOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />

      <main className="flex-1 min-w-0">
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg focus-ring" aria-label="Open menu">
            <HiMenu className="text-xl text-[rgb(var(--color-text-primary))]" />
          </button>
          <span className="font-bold text-[rgb(var(--color-text-primary))]">NovaMeet</span>
          <span className="w-9" />
        </div>

        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8">
          <h1 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">
            Schedule a meeting
          </h1>
          <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">
            Plan ahead and share the meeting ID once it's ready.
          </p>

          <div className="grid lg:grid-cols-5 gap-6 mt-6">
            <form onSubmit={handleSubmit} className="card p-6 space-y-4 lg:col-span-2 h-fit">
              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1.5">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Quarterly review"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1.5">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1.5">
                    Date
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1.5">
                    Start time
                  </label>
                  <input
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1.5">
                  Duration (minutes)
                </label>
                <input
                  id="duration"
                  name="duration"
                  type="number"
                  min={15}
                  step={15}
                  value={formData.duration}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <button type="submit" disabled={creating} className="btn btn-primary w-full">
                {creating ? 'Scheduling...' : 'Schedule Meeting'}
              </button>
            </form>

            <div className="lg:col-span-3">
              <h2 className="text-lg font-bold text-[rgb(var(--color-text-primary))] mb-4">
                Upcoming
              </h2>
              {loading ? (
                <LoadingSpinner />
              ) : upcomingMeetings.length === 0 ? (
                <div className="card">
                  <EmptyState
                    icon={HiCalendar}
                    title="No upcoming meetings"
                    description="Meetings you schedule will appear here."
                  />
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {upcomingMeetings.map((m) => (
                    <MeetingCard
                      key={m._id}
                      meeting={m}
                      onJoin={(id) => navigate(`/meeting/${id}`)}
                      onCopyLink={handleCopyLink}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {createdMeeting && (
        <MeetingModal
          meeting={createdMeeting}
          onClose={() => setCreatedMeeting(null)}
          onJoinNow={(id) => navigate(`/meeting/${id}`)}
        />
      )}
    </div>
  );
};

export default ScheduleMeeting;
