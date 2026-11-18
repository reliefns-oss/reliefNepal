'use client';

import { useEffect, useState } from 'react';
import { Landmark } from 'lucide-react';
import { apiRequest } from '../../lib/api/client.js';
import GovernmentActionCard from './GovernmentActionCard.jsx';
import './government-action-section.css';

export default function GovernmentActionSection() {
  const [actions, setActions] = useState([]);
  const [state, setState] = useState('loading');

  useEffect(() => {
    let active = true;
    apiRequest('/government-actions')
      .then((data) => {
        if (!active) return;
        setActions(Array.isArray(data) ? data.filter((item) => item?.title && item?.slug) : []);
        setState('ready');
      })
      .catch(() => {
        if (active) setState('error');
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      id="government-partnerships"
      className="rn-government-actions"
      aria-labelledby="government-actions-heading"
    >
      <div className="rn-government-actions-container">
        <header className="rn-government-actions-header">
          <span className="rn-government-actions-eyebrow">
            <Landmark size={15} aria-hidden="true" />
            Government Partnership
          </span>
          <h2 id="government-actions-heading">Joint Action with Government</h2>
          <p>
            Collaborative initiatives strengthening bridges between communities
            and government bodies for sustainable development across Nepal.
          </p>
          <a className="rn-government-actions-all" href="/government-actions">
            View all initiatives
          </a>
        </header>

        <div className="rn-government-actions-grid">
          {actions.slice(0, 3).map((action, index) => (
            <GovernmentActionCard
              action={action}
              index={index}
              key={action.id || action.slug}
            />
          ))}
          {state === 'loading' && (
            <p className="rn-government-actions-message" role="status">
              Loading government partnership initiatives…
            </p>
          )}
          {state === 'error' && (
            <p className="rn-government-actions-message" role="status">
              Initiatives are temporarily unavailable. Please check back soon.
            </p>
          )}
          {state === 'ready' && actions.length === 0 && (
            <p className="rn-government-actions-message">
              Government partnership initiatives will appear here as they are published.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
