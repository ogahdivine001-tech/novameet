import { Link } from 'react-router-dom';
import { HiVideoCamera, HiHome } from 'react-icons/hi';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[rgb(var(--color-bg))]">
      <div className="text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-nova-50 dark:bg-nova-950 flex items-center justify-center mx-auto mb-6">
          <HiVideoCamera className="text-nova-600 dark:text-nova-400 text-3xl" />
        </div>
        <h1 className="text-6xl font-extrabold text-nova-600">404</h1>
        <p className="text-lg font-semibold text-[rgb(var(--color-text-primary))] mt-2">
          This page went off-camera
        </p>
        <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1 max-w-sm mx-auto">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link to="/" className="btn btn-primary mt-6 inline-flex">
          <HiHome /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
