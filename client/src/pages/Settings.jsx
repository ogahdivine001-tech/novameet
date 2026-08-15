import { useState } from 'react';
import { HiMenu, HiSun, HiMoon, HiDesktopComputer } from 'react-icons/hi';
import Sidebar from '../components/Sidebar';
import useTheme from '../hooks/useTheme';
import userService from '../services/userService';

const themeOptions = [
  { value: 'light', label: 'Light', icon: HiSun },
  { value: 'dark', label: 'Dark', icon: HiMoon },
  { value: 'system', label: 'System', icon: HiDesktopComputer },
];

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notifications, setNotifications] = useState({
    meetingReminders: true,
    chatMessages: true,
    productUpdates: false,
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await userService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setMessage('Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

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

        <div className="max-w-2xl mx-auto px-5 sm:px-8 py-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">Settings</h1>
            <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">
              Manage your preferences and account security.
            </p>
          </div>

          {message && (
            <div className="px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-sm">
              {message}
            </div>
          )}
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Theme */}
          <div className="card p-6">
            <h2 className="font-semibold text-[rgb(var(--color-text-primary))]">Theme</h2>
            <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">
              Choose how NovaMeet looks on this device.
            </p>
            <div className="grid grid-cols-3 gap-3 mt-4">
              {themeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTheme(opt.value)}
                  className={`flex flex-col items-center gap-2 py-4 rounded-xl border transition-colors focus-ring ${
                    theme === opt.value
                      ? 'border-nova-600 bg-nova-50 dark:bg-nova-950 text-nova-700 dark:text-nova-400'
                      : 'border-[rgb(var(--color-border))] text-[rgb(var(--color-text-secondary))] hover:border-nova-300'
                  }`}
                  aria-pressed={theme === opt.value}
                >
                  <opt.icon className="text-xl" />
                  <span className="text-xs font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="card p-6">
            <h2 className="font-semibold text-[rgb(var(--color-text-primary))]">Notifications</h2>
            <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">
              Choose what you want to be notified about.
            </p>
            <div className="mt-4 space-y-3">
              {[
                { key: 'meetingReminders', label: 'Meeting reminders' },
                { key: 'chatMessages', label: 'New chat messages' },
                { key: 'productUpdates', label: 'Product updates' },
              ].map((item) => (
                <label key={item.key} className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-[rgb(var(--color-text-primary))]">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={notifications[item.key]}
                    onChange={() =>
                      setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
                    }
                    className="w-4 h-4 rounded accent-nova-600"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="card p-6">
            <h2 className="font-semibold text-[rgb(var(--color-text-primary))]">Security</h2>
            <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">
              Update your password to keep your account secure.
            </p>
            <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-3">
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Current password"
                className="input-field"
                required
              />
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="New password"
                className="input-field"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                className="input-field"
                required
              />
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
