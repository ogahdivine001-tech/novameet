const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6 animate-fade-in">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-nova-50 dark:bg-nova-950 flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-nova-600 dark:text-nova-400" aria-hidden="true" />
        </div>
      )}
      <h3 className="text-base font-semibold text-[rgb(var(--color-text-primary))]">
        {title}
      </h3>
      {description && (
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))] max-w-xs">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;
