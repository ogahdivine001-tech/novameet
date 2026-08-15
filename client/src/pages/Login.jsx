import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HiVideoCamera, HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import useAuth from '../hooks/useAuth';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Enter a valid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    const result = await login(formData);
    setLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setServerError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[rgb(var(--color-bg))]">
      <div className="w-full max-w-md animate-fade-in">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-nova-500 to-nova-800 flex items-center justify-center shadow-card">
            <HiVideoCamera className="text-white text-lg" />
          </span>
          <span className="text-xl font-extrabold text-[rgb(var(--color-text-primary))]">
            NovaMeet
          </span>
        </Link>

        <div className="card p-8">
          <h1 className="text-2xl font-bold text-[rgb(var(--color-text-primary))] text-center">
            Welcome back
          </h1>
          <p className="text-sm text-[rgb(var(--color-text-secondary))] text-center mt-1">
            Sign in to join or start your meetings
          </p>

          {serverError && (
            <div
              role="alert"
              className="mt-5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm"
            >
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1.5">
                Email
              </label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-secondary))]" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="text-xs text-red-600 mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1.5">
                Password
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-secondary))]" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10 pr-10"
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-secondary))]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-xs text-red-600 mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-[rgb(var(--color-text-secondary))] mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-nova-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
