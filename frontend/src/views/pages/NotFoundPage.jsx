import { Link } from 'react-router-dom';
import BrandMark from '@/views/components/common/BrandMark';
import OrbitGraphic from '@/views/components/common/OrbitGraphic';

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <BrandMark size={56} />
      <p className="eyebrow">404</p>
      <h1>This page is missing</h1>
      <p className="muted">The link may be outdated, or the project was removed.</p>
      <OrbitGraphic caption="Nothing to review on this path" />
      <Link to="/dashboard" className="btn btn-primary">
        Back to dashboard
      </Link>
    </div>
  );
}
