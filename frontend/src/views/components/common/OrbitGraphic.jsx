export default function OrbitGraphic({ caption = 'Projects in motion' }) {
  return (
    <div className="orbit" aria-hidden="true">
      <svg viewBox="0 0 420 420" className="orbit-svg">
        <defs>
          <linearGradient id="orbitGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>
        </defs>
        <circle className="orbit-ring ring-a" cx="210" cy="210" r="168" />
        <circle className="orbit-ring ring-b" cx="210" cy="210" r="118" />
        <circle className="orbit-ring ring-c" cx="210" cy="210" r="68" />
        <circle className="orbit-core" cx="210" cy="210" r="22" fill="url(#orbitGlow)" />
        <g className="orbit-nodes">
          <circle cx="210" cy="42" r="8" />
          <circle cx="328" cy="210" r="7" />
          <circle cx="92" cy="210" r="6" />
          <circle cx="292" cy="92" r="5" />
          <circle cx="128" cy="318" r="7" />
        </g>
      </svg>
      <p className="orbit-caption">{caption}</p>
    </div>
  );
}
