import BrandMark from '@/views/components/common/BrandMark';
import OrbitGraphic from '@/views/components/common/OrbitGraphic';

export default function AuthLayout({ headline, blurb, caption, children }) {
  return (
    <div className="auth-screen">
      <section className="auth-panel">
        <div className="auth-brand">
          <BrandMark size={48} />
          <span>Project Management System</span>
        </div>
        {children}
      </section>
      <section className="auth-hero">
        <div className="hero-copy">
          <p className="eyebrow">Project Management System</p>
          <h2>{headline}</h2>
          <p>{blurb}</p>
        </div>
        <OrbitGraphic caption={caption} />
      </section>
    </div>
  );
}
