export default function LoadingSpinner({ city }) {
  return (
    <div className="status" data-state="loading" role="status" aria-live="polite">
      <span className="status__icon" aria-hidden="true" />
      <p className="status__text">Loading weather for {city}…</p>
    </div>
  );
}
