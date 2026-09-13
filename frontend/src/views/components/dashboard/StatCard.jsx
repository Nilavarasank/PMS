const ICONS = {
  default: (
    <path d="M8 20V8h4v12H8zm8 0V4h4v16h-4zm8 0v-8h4v8h-4z" />
  ),
  success: (
    <path d="M10 17.2 5.8 13l1.8-1.8 2.4 2.4 6.6-6.6L18.4 9 10 17.2z" />
  ),
  warning: (
    <path d="M12 4 3 20h18L12 4zm0 6.5 1 5h-2l1-5zm0 8.2a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2z" />
  ),
  info: (
    <path d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm-.8 4h1.6v1.6h-1.6V8zm0 3.2h1.6V16h-1.6v-4.8z" />
  ),
};

export default function StatCard({ label, value, tone = 'default' }) {
  return (
    <article className={`stat-card tone-${tone}`}>
      <span className="stat-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor">{ICONS[tone] || ICONS.default}</svg>
      </span>
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}
