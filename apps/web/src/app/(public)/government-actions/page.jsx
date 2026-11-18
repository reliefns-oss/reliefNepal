import Link from 'next/link';
import GovernmentActionCard from '../../../components/home/GovernmentActionCard.jsx';
import '../../../components/home/government-action-section.css';

const apiBase = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
).replace(/\/$/, '');

async function getActions() {
  const response = await fetch(`${apiBase}/government-actions`, {
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Government initiatives could not be loaded.');
  const payload = await response.json();
  return Array.isArray(payload?.data) ? payload.data : [];
}

export const metadata = {
  title: 'Joint Action with Government | Relief Nepal',
  description:
    'Explore collaborative initiatives between Relief Nepal, communities, and government bodies across Nepal.',
};

export default async function GovernmentActionsPage() {
  const actions = await getActions();

  return (
    <main className="rn-government-actions min-h-[65vh]">
      <div className="rn-government-actions-container">
        <header className="rn-government-actions-header">
          <span className="rn-government-actions-eyebrow">Government Partnership</span>
          <h1>Joint Action with Government</h1>
          <p>
            Collaborative initiatives strengthening bridges between communities
            and government bodies for sustainable development across Nepal.
          </p>
          <Link className="rn-government-actions-all" href="/#government-partnerships">
            Back to homepage
          </Link>
        </header>
        <div className="rn-government-actions-grid">
          {actions.map((action, index) => (
            <GovernmentActionCard
              action={action}
              index={index}
              key={action.id || action.slug}
            />
          ))}
          {actions.length === 0 && (
            <p className="rn-government-actions-message">
              Government partnership initiatives will appear here as they are published.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
