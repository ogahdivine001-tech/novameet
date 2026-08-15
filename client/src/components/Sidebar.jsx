import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  HiHome,
  HiVideoCamera,
  HiCalendar,
  HiClock,
  HiUser,
  HiCog,
  HiLogout,
  HiX,
} from "react-icons/hi";
import useAuth from "../hooks/useAuth";
import { getInitials, getAvatarColor } from "../utils/meetingUtils";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: HiHome },
  { label: "Meetings", to: "/meetings", icon: HiVideoCamera },
  { label: "Schedule", to: "/meetings/schedule", icon: HiCalendar },
  { label: "History", to: "/meetings/history", icon: HiClock },
  { label: "Profile", to: "/profile", icon: HiUser },
  { label: "Settings", to: "/settings", icon: HiCog },
];

const Sidebar = ({ mobileOpen, onCloseMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const content = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-5">
        <Link
          to="/"
          className="flex items-center gap-2 focus-ring rounded-lg"
          aria-label="Back to NovaMeet home"
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-nova-500 to-nova-800 flex items-center justify-center">
            <HiVideoCamera className="text-white text-sm" />
          </span>
          <span className="font-extrabold text-[rgb(var(--color-text-primary))]">
            NovaMeet
          </span>
        </Link>
        <button
          onClick={onCloseMobile}
          className="md:hidden p-1.5 rounded-lg text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-border))]/60"
          aria-label="Close sidebar"
        >
          <HiX />
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/dashboard"}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors focus-ring ${
                isActive
                  ? "bg-nova-600 text-white shadow-card"
                  : "text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-border))]/50 hover:text-[rgb(var(--color-text-primary))]"
              }`
            }
          >
            <item.icon className="text-lg" aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-[rgb(var(--color-border))]">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: getAvatarColor(user?.name) }}
          >
            {getInitials(user?.name)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[rgb(var(--color-text-primary))] truncate">
              {user?.name}
            </p>
            <p className="text-xs text-[rgb(var(--color-text-secondary))] truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-border))]/50 hover:text-red-600 transition-colors focus-ring"
        >
          <HiLogout className="text-lg" aria-hidden="true" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 border-r border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] h-screen sticky top-0">
        {content}
      </aside>

      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative w-72 max-w-[80vw] bg-[rgb(var(--color-surface))] h-full animate-slide-up">
            {content}
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
