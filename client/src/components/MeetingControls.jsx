import {
  HiMicrophone,
  HiVideoCamera,
  HiChatAlt2,
  HiUserGroup,
  HiPhoneMissedCall,
  HiDotsHorizontal,
} from 'react-icons/hi';
import { BsMicMuteFill, BsCameraVideoOffFill, BsDisplay, BsDisplayFill } from 'react-icons/bs';
import { useState } from 'react';

const ControlButton = ({ active, danger, onClick, icon, label, badge }) => (
  <button
    onClick={onClick}
    className={`relative flex flex-col items-center justify-center gap-1 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl transition-colors focus-ring ${
      danger
        ? 'bg-red-500 hover:bg-red-600 text-white'
        : active
        ? 'bg-[rgb(var(--color-border))]/60 text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-border))]'
        : 'bg-red-500/90 hover:bg-red-500 text-white'
    }`}
    aria-label={label}
    aria-pressed={active}
  >
    {badge && (
      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400" />
    )}
    <span className="text-lg sm:text-xl">{icon}</span>
  </button>
);

const MeetingControls = ({
  micOn,
  cameraOn,
  isScreenSharing,
  handRaised,
  chatOpen,
  participantsOpen,
  onToggleMic,
  onToggleCamera,
  onToggleScreenShare,
  onToggleHand,
  onToggleChat,
  onToggleParticipants,
  onLeave,
  onEndMeeting,
  isHost,
  unreadCount = 0,
}) => {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 px-3 py-3 sm:py-4 bg-[rgb(var(--color-surface))] border-t border-[rgb(var(--color-border))] flex-wrap">
      <ControlButton
        active={micOn}
        onClick={onToggleMic}
        icon={micOn ? <HiMicrophone /> : <BsMicMuteFill />}
        label={micOn ? 'Mute microphone' : 'Unmute microphone'}
      />
      <ControlButton
        active={cameraOn}
        onClick={onToggleCamera}
        icon={cameraOn ? <HiVideoCamera /> : <BsCameraVideoOffFill />}
        label={cameraOn ? 'Turn off camera' : 'Turn on camera'}
      />
      <ControlButton
        active={!isScreenSharing}
        onClick={onToggleScreenShare}
        icon={isScreenSharing ? <BsDisplayFill /> : <BsDisplay />}
        label={isScreenSharing ? 'Stop screen share' : 'Start screen share'}
      />

      <button
        onClick={onToggleHand}
        className={`flex flex-col items-center justify-center gap-1 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl transition-colors focus-ring ${
          handRaised
            ? 'bg-amber-400 text-white'
            : 'bg-[rgb(var(--color-border))]/60 text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-border))]'
        }`}
        aria-label={handRaised ? 'Lower hand' : 'Raise hand'}
        aria-pressed={handRaised}
      >
        <span className="text-lg sm:text-xl">✋</span>
      </button>

      <button
        onClick={onToggleChat}
        className={`relative flex flex-col items-center justify-center gap-1 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl transition-colors focus-ring ${
          chatOpen
            ? 'bg-nova-600 text-white'
            : 'bg-[rgb(var(--color-border))]/60 text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-border))]'
        }`}
        aria-label="Toggle chat"
      >
        {unreadCount > 0 && !chatOpen && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
            {unreadCount}
          </span>
        )}
        <HiChatAlt2 className="text-lg sm:text-xl" />
      </button>

      <button
        onClick={onToggleParticipants}
        className={`flex flex-col items-center justify-center gap-1 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl transition-colors focus-ring ${
          participantsOpen
            ? 'bg-nova-600 text-white'
            : 'bg-[rgb(var(--color-border))]/60 text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-border))]'
        }`}
        aria-label="Toggle participants"
      >
        <HiUserGroup className="text-lg sm:text-xl" />
      </button>

      {isHost && (
        <div className="relative">
          <button
            onClick={() => setMoreOpen((v) => !v)}
            className="flex flex-col items-center justify-center gap-1 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[rgb(var(--color-border))]/60 text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-border))] focus-ring"
            aria-label="More options"
            aria-expanded={moreOpen}
          >
            <HiDotsHorizontal className="text-lg sm:text-xl" />
          </button>
          {moreOpen && (
            <div className="absolute bottom-16 right-0 card p-1 w-44 shadow-card-hover z-10">
              <button
                onClick={() => {
                  onEndMeeting();
                  setMoreOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                End meeting for all
              </button>
            </div>
          )}
        </div>
      )}

      <ControlButton
        danger
        onClick={onLeave}
        icon={<HiPhoneMissedCall />}
        label="Leave meeting"
      />
    </div>
  );
};

export default MeetingControls;
