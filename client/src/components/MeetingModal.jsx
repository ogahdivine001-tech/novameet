import { useState } from 'react';
import { HiCheck, HiClipboardCopy, HiX } from 'react-icons/hi';
import { buildMeetingLink, copyToClipboard } from '../utils/meetingUtils';

const MeetingModal = ({ meeting, onClose, onJoinNow }) => {
  const [copied, setCopied] = useState(false);

  if (!meeting) return null;

  const handleCopy = async () => {
    const link = buildMeetingLink(meeting.meetingId);
    const success = await copyToClipboard(link);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="meeting-modal-title"
    >
      <div className="card w-full max-w-md p-6 relative animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-border))]/60 focus-ring"
          aria-label="Close"
        >
          <HiX />
        </button>

        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
          <HiCheck className="text-emerald-600 dark:text-emerald-400 text-2xl" />
        </div>

        <h2 id="meeting-modal-title" className="text-lg font-bold text-[rgb(var(--color-text-primary))]">
          Meeting created successfully
        </h2>
        <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">
          Share this ID with participants so they can join.
        </p>

        <div className="mt-4 p-4 rounded-xl bg-nova-50 dark:bg-nova-950/40 border border-nova-200 dark:border-nova-900 text-center">
          <p className="text-2xl font-bold tracking-widest text-nova-700 dark:text-nova-300 font-mono">
            {meeting.meetingId}
          </p>
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={handleCopy} className="btn btn-secondary flex-1 text-sm">
            <HiClipboardCopy /> {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <button
            onClick={() => onJoinNow?.(meeting.meetingId)}
            className="btn btn-primary flex-1 text-sm"
          >
            Join Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingModal;
