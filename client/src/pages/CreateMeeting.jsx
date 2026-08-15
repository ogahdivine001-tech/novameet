import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiMenu, HiLockClosed, HiUsers } from 'react-icons/hi';
import Sidebar from '../components/Sidebar';
import MeetingModal from '../components/MeetingModal';
import useMeeting from '../hooks/useMeeting';

const CreateMeeting = () => {
  const navigate = useNavigate();
  const { createMeeting } = useMeeting();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdMeeting, setCreatedMeeting] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 60,
    password: '',
    waitingRoom: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Please provide a meeting title');
      return;
    }

    setLoading(true);
    try {
      const meeting = await createMeeting({
        title: formData.title,
        description: formData.description,
        meetingType: 'instant',
        duration: Number(formData.duration) || 60,
        password: formData.password || undefined,
        waitingRoom: formData.waitingRoom,
      });
      setCreatedMeeting(meeting);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create meeting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[rgb(var(--color-bg))]">
      <Sidebar mobileOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />

      <main className="flex-1 min-w-0">
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-[rgb(var(--color-text-primary))] focus-ring"
            aria-label="Open menu"
          >
            <HiMenu className="text-xl" />
          </button>
          <span className="font-bold text-[rgb(var(--color-text-primary))]">NovaMeet</span>
          <span className="w-9" />
        </div>

        <div className="max-w-2xl mx-auto px-5 sm:px-8 py-10">
          <h1 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">
            Create a meeting
          </h1>
          <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">
            Set up an instant meeting and share the ID with your participants.
          </p>

          {error && (
            <div className="mt-5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="card p-6 mt-6 space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1.5">
                Meeting title
              </label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="Weekly team sync"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1.5">
                Description <span className="text-[rgb(var(--color-text-secondary))] font-normal">(optional)</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="input-field resize-none"
                placeholder="What is this meeting about?"
              />
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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1.5 flex items-center gap-1.5">
                <HiLockClosed /> Meeting password <span className="text-[rgb(var(--color-text-secondary))] font-normal">(optional)</span>
              </label>
              <input
                id="password"
                name="password"
                type="text"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Leave blank for no password"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="waitingRoom"
                checked={formData.waitingRoom}
                onChange={handleChange}
                className="w-4 h-4 rounded accent-nova-600"
              />
              <span className="text-sm text-[rgb(var(--color-text-primary))] flex items-center gap-1.5">
                <HiUsers /> Enable waiting room
              </span>
            </label>

            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? 'Creating meeting...' : 'Create Meeting'}
            </button>
          </form>
        </div>
      </main>

      {createdMeeting && (
        <MeetingModal
          meeting={createdMeeting}
          onClose={() => navigate('/dashboard')}
          onJoinNow={(id) => navigate(`/meeting/${id}`)}
        />
      )}
    </div>
  );
};

export default CreateMeeting;
