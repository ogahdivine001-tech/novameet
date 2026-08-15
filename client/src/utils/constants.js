export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const TOKEN_KEY = 'novameet_token';
export const USER_KEY = 'novameet_user';
export const THEME_KEY = 'novameet_theme';

export const MEETING_TYPES = {
  INSTANT: 'instant',
  SCHEDULED: 'scheduled',
};

export const MEETING_STATUS = {
  SCHEDULED: 'scheduled',
  ACTIVE: 'active',
  ENDED: 'ended',
  CANCELLED: 'cancelled',
};
