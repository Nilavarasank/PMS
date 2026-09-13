export default function BrandMark({ size = 42 }) {
  return (
    <span className="brand-mark" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 48 48">
        <rect x="2" y="2" width="44" height="44" rx="14" fill="#6d28d9" />
        <path d="M16 34V14h12.4c5.4 0 8.8 3.1 8.8 7.9 0 4.9-3.5 8.1-8.9 8.1H22V34h-6zm6-10.8h5.6c2.3 0 3.6-1.3 3.6-3.3s-1.3-3.2-3.6-3.2H22v6.5z" fill="#f5f3ff" />
      </svg>
    </span>
  );
}
