const sizeMap = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-[3px]',
};

const LoadingSpinner = ({ size = 'md', label, fullScreen = false }) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3" role="status">
      <div
        className={`${sizeMap[size]} rounded-full border-nova-600 border-t-transparent animate-spin`}
        aria-hidden="true"
      />
      {label && (
        <span className="text-sm text-[rgb(var(--color-text-secondary))]">{label}</span>
      )}
      <span className="sr-only">Loading</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--color-bg))]">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
