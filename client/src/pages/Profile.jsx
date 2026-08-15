import { useState } from 'react';
import { HiMenu, HiPencil } from 'react-icons/hi';
import Sidebar from '../components/Sidebar';
import useAuth from '../hooks/useAuth';
import userService from '../services/userService';
import { getInitials, getAvatarColor } from '../utils/meetingUtils';
import { formatDate } from '../utils/formatDate';

const Profile = () => {
  const { user, updateUserInContext } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await userService.updateProfile({ name });
      updateUserInContext(res.user);
      setMessage('Profile updated successfully');
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
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

        <div className="max-w-2xl mx-auto px-5 sm:px-8 py-8">
          <h1 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">Profile</h1>
          <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">
            Manage your personal information.
          </p>

          {message && (
            <div className="mt-5 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-sm">
              {message}
            </div>
          )}
          {error && (
            <div className="mt-5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="card p-6 mt-6">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
                style={{ backgroundColor: getAvatarColor(user?.name) }}
              >
                {getInitials(user?.name)}
              </div>
              <div>
                <p className="font-semibold text-[rgb(var(--color-text-primary))]">{user?.name}</p>
                <p className="text-sm text-[rgb(var(--color-text-secondary))]">{user?.email}</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1.5">
                  Full name
                </label>
                {editing ? (
                  <form onSubmit={handleSave} className="flex gap-2">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field"
                      autoFocus
                    />
                    <button type="submit" disabled={loading} className="btn btn-primary text-sm px-4">
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setName(user?.name || '');
                      }}
                      className="btn btn-secondary text-sm px-4"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[rgb(var(--color-text-primary))]">{user?.name}</p>
                    <button
                      onClick={() => setEditing(true)}
                      className="text-sm text-nova-600 font-medium hover:underline flex items-center gap-1"
                    >
                      <HiPencil /> Edit
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1.5">
                  Email
                </label>
                <p className="text-sm text-[rgb(var(--color-text-secondary))]">{user?.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1.5">
                  Account created
                </label>
                <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                  {formatDate(user?.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
