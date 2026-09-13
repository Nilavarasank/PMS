export default function Loader({ label = 'Loading…' }) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <span className="loader-orbit" aria-hidden="true">
        <span className="loader-core" />
      </span>
      <span>{label}</span>
    </div>
  );
}
