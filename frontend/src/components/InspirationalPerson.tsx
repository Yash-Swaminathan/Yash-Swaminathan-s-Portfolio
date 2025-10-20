import React, { useMemo } from 'react';

type Person = {
  name: string;
  reason: string;
};

// People who inspire me and why
const INSPIRATIONAL_PEOPLE: Person[] = [
  { name: 'Swaminathan Tanjore (My Dad)', reason: 'Immigrated to Canada from India and built a successful company through resilience and vision.' },
  { name: 'Madhavi Swaminathan (My Mom)', reason: 'Her values, support, and patience shaped who I am today.' },
  { name: 'LeBron James', reason: "It's LeBron..." },
  { name: 'Linus Torvalds', reason: 'Created Linux and Git — motivated by a passion for improvement rather than profit, proving that open-source collaboration can transform the world.' },
  { name: 'Steve Jobs', reason: 'His ability to blend design, innovation, and purpose changed how the world interacts with technology.' },
];

function dayKey(): number {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 0));
  const diff = Number(now) - Number(start);
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return now.getUTCFullYear() * 1000 + dayOfYear; // stable per day
}

function pickDaily<T>(items: T[]): T {
  const key = dayKey();
  const idx = Math.abs(key) % items.length;
  return items[idx];
}

const InspirationalPerson: React.FC = () => {
  const dailyPerson = useMemo(() => pickDaily(INSPIRATIONAL_PEOPLE), []);

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 16,
        padding: '1rem 1rem 1.25rem 1rem',
        boxShadow: '0 0 0 1px var(--border-default), 0 8px 24px rgba(0, 0, 0, 0.12)',
        border: '1px solid var(--border-default)',
        width: 360,
      }}
      aria-label="Someone who inspires me"
    >
      {/* Inspirational Person Section */}
      <div style={{ 
        padding: '0.75rem', 
        backgroundColor: 'var(--bg-primary)', 
        borderRadius: 8,
        border: '1px solid var(--border-default)'
      }}>
        <div style={{ 
          fontSize: 12, 
          fontWeight: 600, 
          color: 'var(--text-muted)', 
          marginBottom: '0.5rem',
          fontFamily: 'Inter, sans-serif'
        }}>
          Someone who inspires me
        </div>
        <div style={{ 
          fontSize: 14, 
          fontWeight: 600, 
          color: 'var(--text-primary)', 
          marginBottom: '0.25rem',
          fontFamily: 'Inter, sans-serif'
        }}>
          {dailyPerson.name}
        </div>
        <div style={{ 
          fontSize: 12, 
          color: 'var(--text-muted)', 
          fontStyle: 'italic',
          fontFamily: 'Inter, sans-serif'
        }}>
          {dailyPerson.reason}
        </div>
      </div>
    </div>
  );
};

export default InspirationalPerson;

