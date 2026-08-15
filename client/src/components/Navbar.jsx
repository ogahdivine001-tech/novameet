import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiVideoCamera, HiMenu, HiX } from 'react-icons/hi';
import useAuth from '../hooks/useAuth';
import { getInitials, getAvatarColor } from '../utils/meetingUtils';

const navLinks = [
  { label: 'Home', href: '/#home' },
  { label: 'Features', href: '/#features' },
  { label: 'Solutions', href: '/#solutions' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'About', href: '/#faq' },
];

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[rgb(var(--color-bg))]/80 border-b border-[rgb(var(--color-border))]">
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 focus-ring rounded-lg" aria-label="NovaMeet home">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-nova-500 to-nova-800 flex items-center justify-center shadow-card">
            <HiVideoCamera className="text-white text-lg" aria-hidden="true" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-[rgb(var(--color-text-primary))]">
            NovaMeet
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-3 py-2 text-sm font-medium rounded-lg text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-border))]/50 transition-colors focus-ring"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="btn btn-secondary text-sm py-2">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost text-sm py-2">
                Logout
              </button>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: getAvatarColor(user?.name) }}
                title={user?.name}
              >
                {getInitials(user?.name)}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost text-sm py-2">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary text-sm py-2">
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-lg text-[rgb(var(--color-text-primary))] focus-ring"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-5 py-4 animate-slide-up">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-sm font-medium rounded-lg text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-border))]/50"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-[rgb(var(--color-border))]">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn btn-secondary w-full" onClick={() => setMobileOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="btn btn-ghost w-full">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary w-full" onClick={() => setMobileOpen(false)}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary w-full" onClick={() => setMobileOpen(false)}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
