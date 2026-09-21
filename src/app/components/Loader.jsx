const sizeClasses = {
  xs: "loading-xs",
  sm: "loading-sm",
  md: "loading-md",
  lg: "loading-lg",
};

const Loader = ({
  size = "md",
  text,
  className = "",
  spinnerClassName = "",
  ariaLabel = "Loading",
}) => {
  const resolvedSize = sizeClasses[size] ?? sizeClasses.md;

  return (
    <span
      className={`inline-flex items-center justify-center gap-2 ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={ariaLabel}
    >
      <span
        className={`loading loading-spinner ${resolvedSize} ${spinnerClassName}`.trim()}
        aria-hidden="true"
      />
      {text && <span className="text-sm font-medium">{text}</span>}
    </span>
  );
};

export default Loader;
