import Image from 'next/image';
import { ArrowRight, Landmark } from 'lucide-react';

function formatActionDate(value) {
  if (!value) return '';
  const date = new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export default function GovernmentActionCard({ action, index }) {
  const href = `/government-actions/${encodeURIComponent(action.slug)}`;
  const date = formatActionDate(action.action_date);

  return (
    <article className="rn-government-action-card">
      <div className="rn-government-action-image" aria-hidden="true">
        {action.image_url ? (
          <Image
            src={action.image_url}
            alt=""
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <span className="rn-government-action-image-fallback" />
        )}
        <span className="rn-government-action-index">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="rn-government-action-content">
        <div className="rn-government-action-meta">
          <span>
            <Landmark size={14} aria-hidden="true" />
            Joint Action with Government
          </span>
          {date && <time dateTime={action.action_date}>{date}</time>}
        </div>
        <p className="rn-government-action-partner">
          {action.government_partner}
        </p>
        <h3>
          <a href={href}>{action.title}</a>
        </h3>
        <p className="rn-government-action-summary">{action.summary}</p>
        <a className="rn-government-action-link" href={href}>
          Read more <ArrowRight size={17} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
