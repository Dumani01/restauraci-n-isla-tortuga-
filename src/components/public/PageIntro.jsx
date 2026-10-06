import { Waves } from 'lucide-react';

export function PageIntro({ eyebrow, title, children, number }) {
  return (
    <section className="public-page-hero">
      <div className="public-page-hero__texture" />
      <div className="public-page-hero__content">
        <p className="vh-kicker"><Waves size={15} />{eyebrow}</p>
        <h1>{title}</h1>
        <p>{children}</p>
      </div>
      <span className="public-page-hero__number">{number}</span>
    </section>
  );
}
