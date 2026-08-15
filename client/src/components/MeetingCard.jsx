import { HiClock, HiLockClosed, HiUserGroup, HiDotsVertical } from 'react-icons/hi';
import { useState } from 'react';
import { formatDate, formatTime } from '../utils/formatDate';

const statusStyles = {
  scheduled: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  ended: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const MeetingCard = ({ meeting, onJoin, onDelete, onCopyLink }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const status = meeting.status || 'scheduled';

  return (
    <div className="card p-5 hover:shadow-card-hover transition-shadow animate-fade-in relative">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-[rgb(var(--color-text-primary))] truncate">
              {meeting.title}
            </h3>
            <span className={`badge ${statusStyles[status] || statusStyles.scheduled}`}>
              {status}
            </span>
          </div>
          <p className="text-xs text-[rgb(var(--color-text-secondary))] mt-1 font-mono">
            {meeting.meetingId}
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1.5 rounded-lg text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-border))]/60 focus-ring"
            aria-label="Meeting options"
            aria-expanded={menuOpen}
          >
            <HiDotsVertical />
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 top-9 z-10 w-40 card p-1 shadow-card-hover"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <button
                onClick={() => {
                  onCopyLink?.(meeting.meetingId);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[rgb(var(--color-border))]/50"
              >
                Copy link
              </button>
              {onDelete && (
                <button
                  onClick={() => {
                    onDelete(meeting.id || meeting._id);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {meeting.description && (
        <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-2 line-clamp-2">
          {meeting.description}
        </p>
      )}

      <div className="flex items-center gap-4 mt-4 text-xs text-[rgb(var(--color-text-secondary))]">
        <span className="flex items-center gap-1">
          <HiClock aria-hidden="true" />
          {meeting.scheduledAt
            ? `${formatDate(meeting.scheduledAt)} · ${formatTime(meeting.scheduledAt)}`
            : formatDate(meeting.createdAt)}
        </span>
        {meeting.hasPassword && (
          <span className="flex items-center gap-1">
            <HiLockClosed aria-hidden="true" /> Protected
          </span>
        )}
        {Array.isArray(meeting.participants) && (
          <span className="flex items-center gap-1">
            <HiUserGroup aria-hidden="true" /> {meeting.participants.length}
          </span>
        )}
      </div>

      {status !== 'ended' && status !== 'cancelled' && (
        <button
          onClick={() => onJoin?.(meeting.meetingId)}
          className="btn btn-primary w-full mt-4 text-sm"
        >
          Join Now
        </button>
      )}
    </div>
  );
};

export default MeetingCard;
