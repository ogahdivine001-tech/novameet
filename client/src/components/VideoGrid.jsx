import ParticipantCard from './ParticipantCard';

const getGridClass = (count) => {
  if (count <= 1) return 'grid-cols-1';
  if (count === 2) return 'grid-cols-1 sm:grid-cols-2';
  if (count <= 4) return 'grid-cols-2';
  if (count <= 6) return 'grid-cols-2 sm:grid-cols-3';
  return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';
};

const VideoGrid = ({ localParticipant, remoteParticipants }) => {
  const total = 1 + remoteParticipants.length;

  return (
    <div
      className={`grid ${getGridClass(total)} gap-3 sm:gap-4 h-full auto-rows-fr overflow-y-auto p-3 sm:p-4`}
    >
      {localParticipant && (
        <ParticipantCard
          stream={localParticipant.stream}
          name={localParticipant.name}
          isLocal
          micOn={localParticipant.micOn}
          cameraOn={localParticipant.cameraOn}
          isHost={localParticipant.isHost}
          handRaised={localParticipant.handRaised}
          screenSharing={localParticipant.screenSharing}
        />
      )}
      {remoteParticipants.map((p) => (
        <ParticipantCard
          key={p.socketId}
          stream={p.stream}
          name={p.name}
          micOn={p.micOn}
          cameraOn={p.cameraOn}
          isHost={p.isHost}
          handRaised={p.handRaised}
          screenSharing={p.screenSharing}
        />
      ))}
    </div>
  );
};

export default VideoGrid;
