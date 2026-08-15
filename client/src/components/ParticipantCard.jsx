import { useEffect, useRef } from "react";
import { HiMicrophone, HiUserCircle } from "react-icons/hi";
import { BsMicMuteFill } from "react-icons/bs";
import { getInitials, getAvatarColor } from "../utils/meetingUtils";

const ParticipantCard = ({
  stream,
  name,
  isLocal = false,
  micOn = true,
  cameraOn = true,
  isHost = false,
  handRaised = false,
  isSpeaking = false,
  screenSharing = false,
}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {
        // Autoplay can be blocked before any user gesture; safe to ignore
        // since the user already interacted with the page to join.
      });
    }
  }, [stream]);

  const showVideo = !!stream && cameraOn;

  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center group ${
        isSpeaking ? "ring-2 ring-nova-500" : ""
      }`}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className={`w-full h-full object-cover ${isLocal ? "scale-x-[-1]" : ""} ${
          showVideo ? "opacity-100" : "opacity-0 absolute inset-0"
        }`}
      />

      {!showVideo && (
        <div className="flex flex-col items-center justify-center gap-2">
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold"
            style={{ backgroundColor: getAvatarColor(name) }}
          >
            {getInitials(name)}
          </div>
        </div>
      )}

      {screenSharing && (
        <span className="absolute top-3 left-3 badge bg-nova-600 text-white">
          Presenting
        </span>
      )}

      {handRaised && (
        <span
          className="absolute top-3 right-3 text-2xl"
          role="img"
          aria-label="Hand raised"
        >
          ✋
        </span>
      )}

      <div className="absolute bottom-0 left-0 right-0 px-3 py-2 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent">
        <span className="text-white text-xs sm:text-sm font-medium truncate flex items-center gap-1.5">
          {name} {isLocal && "(You)"}
          {isHost && (
            <span className="badge bg-nova-500 text-white text-[9px] py-0.5">
              Host
            </span>
          )}
        </span>
        <span
          className={`w-6 h-6 rounded-full flex items-center justify-center ${
            micOn ? "text-white" : "bg-red-500 text-white"
          }`}
          aria-label={micOn ? "Microphone on" : "Microphone muted"}
        >
          {micOn ? (
            <HiMicrophone className="text-sm" />
          ) : (
            <BsMicMuteFill className="text-sm" />
          )}
        </span>
      </div>
    </div>
  );
};

export default ParticipantCard;
