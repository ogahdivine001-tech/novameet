import { useEffect, useState } from 'react';
import { HiMenu, HiClock } from 'react-icons/hi';
import Sidebar from '../components/Sidebar';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import useMeeting from '../hooks/useMeeting';
import useAuth from '../hooks/useAuth';
import { formatDate, formatDuration } from '../utils/formatDate';

const statusStyles = {
  ended: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const MeetingHistory = () => {
  const { historyMeetings, loading, fetchHistory } = useMeeting();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            Meeting History
          </h1>
          <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">
            A record of your past meetings.
          </p>

          <div className="mt-6">
            {loading ? (
              <LoadingSpinner />
            ) : historyMeetings.length === 0 ? (
              <div className="card">
                <EmptyState icon={HiClock} title="No meeting history" description="Meetings you've completed will show up here." />
              </div>
            ) : (
              <div className="card overflow-hidden">
                <div className="hidden sm:grid grid-cols-5 gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))] border-b border-[rgb(var(--color-border))]">
                  <span className="col-span-2">Title</span>
                  <span>Date</span>
                  <span>Duration</span>
                  <span>Status</span>
                </div>
                <div className="divide-y divide-[rgb(var(--color-border))]">
                  {historyMeetings.map((m) => {
                    const duration =
                      m.startedAt && m.endedAt
                        ? formatDuration(
                            Math.round((new Date(m.endedAt) - new Date(m.startedAt)) / 1000),
                            true
                          )
                        : '—';
                    const isHost = m.host?._id === user?.id || m.host === user?.id;
                    return (
                      <div
                        key={m._id}
                        className="grid grid-cols-1 sm:grid-cols-5 gap-1 sm:gap-4 px-5 py-4 text-sm"
                      >
                        <div className="sm:col-span-2">
                          <p className="font-medium text-[rgb(var(--color-text-primary))]">{m.title}</p>
                          <p className="text-xs text-[rgb(var(--color-text-secondary))] font-mono">{m.meetingId}</p>
                        </div>
                        <span className="text-[rgb(var(--color-text-secondary))]">
                          {formatDate(m.endedAt || m.createdAt)}
                        </span>
                        <span className="text-[rgb(var(--color-text-secondary))]">{duration}</span>
                        <div className="flex items-center gap-2">
                          <span className={`badge ${statusStyles[m.status] || statusStyles.ended}`}>
                            {m.status}
                          </span>
                          {isHost && (
                            <span className="badge bg-nova-100 text-nova-700 dark:bg-nova-950 dark:text-nova-400">
                              Host
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MeetingHistory;
