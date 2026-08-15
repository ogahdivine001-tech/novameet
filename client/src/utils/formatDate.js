export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return `${formatDate(date)} · ${formatTime(date)}`;
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  const now = new Date();
  const target = new Date(date);
  const diffMs = target.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);

  if (Math.abs(diffMins) < 1) return 'now';
  if (Math.abs(diffMins) < 60) {
    return diffMins > 0 ? `in ${diffMins}m` : `${Math.abs(diffMins)}m ago`;
  }
  const diffHours = Math.round(diffMins / 60);
  if (Math.abs(diffHours) < 24) {
    return diffHours > 0 ? `in ${diffHours}h` : `${Math.abs(diffHours)}h ago`;
  }
  const diffDays = Math.round(diffHours / 24);
  return diffDays > 0 ? `in ${diffDays}d` : `${Math.abs(diffDays)}d ago`;
};

export const formatDuration = (minutesOrSeconds, isSeconds = false) => {
  const totalSeconds = isSeconds ? minutesOrSeconds : minutesOrSeconds * 60;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
};

export const formatElapsed = (startDate) => {
  if (!startDate) return '00:00';
  const diffSeconds = Math.max(
    0,
    Math.floor((Date.now() - new Date(startDate).getTime()) / 1000)
  );
  const hrs = Math.floor(diffSeconds / 3600);
  const mins = Math.floor((diffSeconds % 3600) / 60);
  const secs = diffSeconds % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return hrs > 0 ? `${pad(hrs)}:${pad(mins)}:${pad(secs)}` : `${pad(mins)}:${pad(secs)}`;
};
