import { HiMicrophone, HiVideoCamera, HiX, HiUserGroup } from 'react-icons/hi';
import { BsMicMuteFill, BsCameraVideoOffFill } from 'react-icons/bs';
import { getInitials, getAvatarColor } from '../utils/meetingUtils';

const ParticipantsPanel = ({
  localParticipant,
  participants,
  isHost,
  onMuteParticipant,
  onRemoveParticipant,
  onClose,
}) => {
  const total = 1 + participants.length;

  const renderRow = (p, isLocal = false) => (
    <div
      key={isLocal ? 'local' : p.socketId}
      className="flex items-center justify-between py-2.5 px-1"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ backgroundColor: getAvatarColor(p.name) }}
        >
          {getInitials(p.name)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-[rgb(var(--color-text-primary))] truncate flex items-center gap-1.5">
            {p.name} {isLocal && '(You)'}
            {p.isHost && (
              <span className="badge bg-nova-500 text-white text-[9px] py-0.5">Host</span>
            )}
          </p>
          {p.handRaised && <span className="text-xs text-amber-500">✋ Hand raised</span>}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={p.micOn ? 'text-[rgb(var(--color-text-secondary))]' : 'text-red-500'}>
          {p.micOn ? <HiMicrophone /> : <BsMicMuteFill />}
        </span>
        <span className={p.cameraOn ? 'text-[rgb(var(--color-text-secondary))]' : 'text-red-500'}>
          {p.cameraOn ? <HiVideoCamera /> : <BsCameraVideoOffFill />}
        </span>
        {isHost && !isLocal && (
          <div className="flex items-center gap-1 ml-1">
            <button
              onClick={() => onMuteParticipant(p.socketId)}
              className="text-[10px] px-2 py-1 rounded-md btn-secondary"
              title="Mute participant"
            >
              Mute
            </button>
            <button
              onClick={() => onRemoveParticipant(p.socketId)}
              className="text-[10px] px-2 py-1 rounded-md text-red-600 border border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Remove participant"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[rgb(var(--color-border))]">
        <h3 className="font-semibold text-sm text-[rgb(var(--color-text-primary))] flex items-center gap-1.5">
          <HiUserGroup /> Participants ({total})
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-border))]/60 focus-ring md:hidden"
          aria-label="Close participants"
        >
          <HiX />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-3 divide-y divide-[rgb(var(--color-border))]">
        {localParticipant && renderRow(localParticipant, true)}
        {participants.map((p) => renderRow(p))}
      </div>
    </div>
  );
};

export default ParticipantsPanel;
