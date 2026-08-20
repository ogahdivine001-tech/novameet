import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiMenu, HiLockClosed, HiLogin } from "react-icons/hi";
import Sidebar from "../components/Sidebar";
import meetingService from "../services/meetingService";
import { isValidMeetingId } from "../utils/meetingUtils";

const JoinMeeting = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [meetingId, setMeetingId] = useState("");
  const [password, setPassword] = useState("");
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmed = meetingId.trim();
    if (!trimmed) {
      setError("Please enter a meeting ID");
      return;
    }
    if (!isValidMeetingId(trimmed)) {
      setError("Meeting ID should look like NOVA-482-913");
      return;
    }

    setLoading(true);
    try {
      await meetingService.joinMeeting(trimmed, password || undefined);
      navigate(`/meeting/${trimmed.toUpperCase()}`, {
        state: { password: password || undefined },
      });
    } catch (err) {
      const data = err.response?.data;
      if (data?.requiresPassword) {
        setRequiresPassword(true);
      }
      setError(data?.message || "Failed to join meeting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[rgb(var(--color-bg))]">
      <Sidebar
        mobileOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      <main className="flex-1 min-w-0">
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-[rgb(var(--color-text-primary))] focus-ring"
            aria-label="Open menu"
          >
            <HiMenu className="text-xl" />
          </button>
          <span className="font-bold text-[rgb(var(--color-text-primary))]">
            NovaMeet
          </span>
          <span className="w-9" />
        </div>

        <div className="max-w-md mx-auto px-5 sm:px-8 py-16">
          <div className="w-14 h-14 rounded-2xl bg-nova-50 dark:bg-nova-950 flex items-center justify-center mb-5">
            <HiLogin className="text-nova-600 dark:text-nova-400 text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">
            Join a meeting
          </h1>
          <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">
            Enter the meeting ID your host shared with you.
          </p>

          {error && (
            <div className="mt-5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="card p-6 mt-6 space-y-4">
            <div>
              <label
                htmlFor="meetingId"
                className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1.5"
              >
                Meeting ID
              </label>
              <input
                id="meetingId"
                value={meetingId}
                onChange={(e) => setMeetingId(e.target.value.toUpperCase())}
                className="input-field font-mono tracking-wide"
                placeholder="NOVA-482-913"
                autoFocus
              />
            </div>

            {requiresPassword && (
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1.5 flex items-center gap-1.5"
                >
                  <HiLockClosed /> Meeting password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="Enter password"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? "Joining meeting..." : "Join Meeting"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default JoinMeeting;
