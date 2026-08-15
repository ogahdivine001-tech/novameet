import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiMenu, HiVideoCamera, HiPlusCircle } from 'react-icons/hi';
import Sidebar from '../components/Sidebar';
import MeetingCard from '../components/MeetingCard';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import useMeeting from '../hooks/useMeeting';
import { copyToClipboard, buildMeetingLink } from '../utils/meetingUtils';

const Meetings = () => {
  const navigate = useNavigate();
  const { meetings, loading, fetchMeetings, removeMeeting } = useMeeting();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchMeetings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopyLink = async (meetingId) => {
    await copyToClipboard(buildMeetingLink(meetingId));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this meeting? This cannot be undone.')) {
      await removeMeeting(id);
    }
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

        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">
                My Meetings
              </h1>
              <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">
                Every meeting you've hosted, in one place.
              </p>
            </div>
            <button onClick={() => navigate('/meetings/create')} className="btn btn-primary hidden sm:flex text-sm">
              <HiPlusCircle /> New Meeting
            </button>
          </div>

          <div className="mt-6">
            {loading ? (
              <LoadingSpinner />
            ) : meetings.length === 0 ? (
              <div className="card">
                <EmptyState
                  icon={HiVideoCamera}
                  title="No meetings yet"
                  description="Create your first meeting to get started."
                  action={
                    <button onClick={() => navigate('/meetings/create')} className="btn btn-primary text-sm">
                      New meeting
                    </button>
                  }
                />
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {meetings.map((m) => (
                  <MeetingCard
                    key={m._id}
                    meeting={m}
                    onJoin={(id) => navigate(`/meeting/${id}`)}
                    onCopyLink={handleCopyLink}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Meetings;
