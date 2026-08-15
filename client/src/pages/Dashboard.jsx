import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiMenu,
  HiPlusCircle,
  HiLogin,
  HiCalendar,
  HiVideoCamera,
  HiClock,
  HiTrendingUp,
} from 'react-icons/hi';
import Sidebar from '../components/Sidebar';
import MeetingCard from '../components/MeetingCard';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import useAuth from '../hooks/useAuth';
import useMeeting from '../hooks/useMeeting';
import { copyToClipboard, buildMeetingLink } from '../utils/meetingUtils';

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className="w-11 h-11 rounded-xl bg-nova-50 dark:bg-nova-950 flex items-center justify-center flex-shrink-0">
      <Icon className="text-nova-600 dark:text-nova-400 text-xl" />
    </div>
    <div>
      <p className="text-xl font-bold text-[rgb(var(--color-text-primary))]">{value}</p>
      <p className="text-xs text-[rgb(var(--color-text-secondary))]">{label}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    meetings,
    upcomingMeetings,
    historyMeetings,
    loading,
    fetchMeetings,
    fetchUpcoming,
    fetchHistory,
  } = useMeeting();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchMeetings();
    fetchUpcoming();
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const thisWeekCount = meetings.filter((m) => {
    const created = new Date(m.createdAt);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return created >= weekAgo;
  }).length;

  const minutesUsed = historyMeetings.reduce((sum, m) => {
    if (m.startedAt && m.endedAt) {
      return sum + Math.round((new Date(m.endedAt) - new Date(m.startedAt)) / 60000);
    }
    return sum;
  }, 0);

  const handleCopyLink = async (meetingId) => {
    await copyToClipboard(buildMeetingLink(meetingId));
  };

  const recentMeetings = meetings.slice(0, 4);

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

        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">
                {greeting()}, {user?.name?.split(' ')[0]}
              </h1>
              <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">
                Here's what's happening with your meetings today.
              </p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid sm:grid-cols-3 gap-4 mt-6">
            <button
              onClick={() => navigate('/meetings/create')}
              className="card p-5 flex items-center gap-3 hover:shadow-card-hover transition-shadow text-left focus-ring"
            >
              <HiPlusCircle className="text-2xl text-nova-600" />
              <div>
                <p className="font-semibold text-sm text-[rgb(var(--color-text-primary))]">
                  New Meeting
                </p>
                <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                  Start instantly
                </p>
              </div>
            </button>
            <button
              onClick={() => navigate('/meetings/join')}
              className="card p-5 flex items-center gap-3 hover:shadow-card-hover transition-shadow text-left focus-ring"
            >
              <HiLogin className="text-2xl text-nova-600" />
              <div>
                <p className="font-semibold text-sm text-[rgb(var(--color-text-primary))]">
                  Join Meeting
                </p>
                <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                  Enter a meeting ID
                </p>
              </div>
            </button>
            <button
              onClick={() => navigate('/meetings/schedule')}
              className="card p-5 flex items-center gap-3 hover:shadow-card-hover transition-shadow text-left focus-ring"
            >
              <HiCalendar className="text-2xl text-nova-600" />
              <div>
                <p className="font-semibold text-sm text-[rgb(var(--color-text-primary))]">
                  Schedule Meeting
                </p>
                <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                  Plan ahead
                </p>
              </div>
            </button>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <StatCard icon={HiCalendar} label="Upcoming Meetings" value={upcomingMeetings.length} />
            <StatCard icon={HiVideoCamera} label="Total Meetings" value={meetings.length} />
            <StatCard icon={HiTrendingUp} label="Meetings This Week" value={thisWeekCount} />
            <StatCard icon={HiClock} label="Minutes Used" value={minutesUsed} />
          </div>

          {/* Upcoming meetings */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[rgb(var(--color-text-primary))]">
                Upcoming Meetings
              </h2>
              <Link to="/meetings/schedule" className="text-sm text-nova-600 font-medium hover:underline">
                View all
              </Link>
            </div>
            {loading ? (
              <LoadingSpinner />
            ) : upcomingMeetings.length === 0 ? (
              <div className="card">
                <EmptyState
                  icon={HiCalendar}
                  title="No upcoming meetings"
                  description="Schedule a meeting to see it appear here."
                  action={
                    <Link to="/meetings/schedule" className="btn btn-primary text-sm">
                      Schedule a meeting
                    </Link>
                  }
                />
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingMeetings.slice(0, 3).map((m) => (
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

          {/* Recent meetings */}
          <div className="mt-10 mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[rgb(var(--color-text-primary))]">
                Recent Meetings
              </h2>
              <Link to="/meetings" className="text-sm text-nova-600 font-medium hover:underline">
                View all
              </Link>
            </div>
            {loading ? (
              <LoadingSpinner />
            ) : recentMeetings.length === 0 ? (
              <div className="card">
                <EmptyState
                  icon={HiVideoCamera}
                  title="No meetings yet"
                  description="Create your first meeting to get started."
                  action={
                    <Link to="/meetings/create" className="btn btn-primary text-sm">
                      New meeting
                    </Link>
                  }
                />
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentMeetings.map((m) => (
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
      </main>
    </div>
  );
};

export default Dashboard;
