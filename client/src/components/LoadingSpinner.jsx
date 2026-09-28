export default function LoadingSpinner({ label, size = "md", fullScreen = false, className = "" }) {
  const classes = [
    "app-loader",
    `app-loader--${size}`,
    fullScreen && "app-loader--screen min-h-screen bg-slate-950 text-white",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={classes} role="status" aria-live="polite" aria-label={label || "Loading"}>
      <span className="app-loader__mark" aria-hidden="true">
        <span className="app-loader__orbit">
          <span className="app-loader__satellite app-loader__satellite--cyan" />
          <span className="app-loader__satellite app-loader__satellite--indigo" />
          <span className="app-loader__satellite app-loader__satellite--gold" />
        </span>
        <span className="app-loader__core" />
      </span>
      {label && <span className="app-loader__label">{label}</span>}
    </div>
  );
}