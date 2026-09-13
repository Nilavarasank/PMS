export default function BrandMark({ size = 42 }) {
  return (
    <span className="brand-mark" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 48 48">
        <rect x="2" y="2" width="44" height="44" rx="14" fill="#6d28d9" />
        <text x="24" y="33" text-anchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="26" fontWeight="700" fill="#f5f3ff">P</text>
      </svg>
    </span>
  );
}
