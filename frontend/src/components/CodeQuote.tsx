import React, { useMemo } from 'react';

type Quote = {
  text: string;
  author?: string;
};

// Small, developer-friendly quotes. Rotates daily and renders as code.
const QUOTES: Quote[] = [
  { text: 'Simplicity is the soul of efficiency.', author: 'Austin Freeman' },
  { text: 'Programs must be written for people to read.', author: 'Harold Abelson' },
  { text: 'Make it work, make it right, make it fast.', author: 'Kent Beck' },
  { text: 'Premature optimization is the root of all evil.', author: 'Donald Knuth' },
  { text: 'The only way to go fast, is to go well.', author: 'Robert C. Martin' },
  { text: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds' },
  { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
  { text: 'Simplicity is prerequisite for reliability.', author: 'Edsger W. Dijkstra' },
  { text: 'Good code is its own best documentation.', author: 'Steve McConnell' },
  { text: 'Code never lies, comments sometimes do.', author: 'Ron Jeffries' },
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

type Lang = 'ts' | 'py';

function dailyLang(): Lang {
  // Alternate by day: even => ts, odd => py
  return dayKey() % 2 === 0 ? 'ts' : 'py';
}

function renderSnippet(quote: Quote, lang: Lang): { header: string; body: string } {
  const text = quote.text.replace(/"/g, '\\"');
  const author = quote.author ? ` - ${quote.author}` : '';

  if (lang === 'ts') {
    // TypeScript-style snippet
    const header = 'TypeScript';
    const body = [
      '/* thought_of_the_day.ts */',
      'export const thoughtOfTheDay: string = (() => {',
      `  const quote: string = "${text}";`,
      `  const author: string = "${author.trim()}";`,
      '  return author ? `${quote} ${author}` : quote;',
      '})();',
    ].join('\n');
    return { header, body };
  }

  // Python-style snippet
  const header = 'Python';
  const body = [
    '# thought_of_the_day.py',
    'from typing import Final',
    `QUOTE: Final[str] = "${text}"`,
    `AUTHOR: Final[str] = "${author.trim()}"`,
    'thought_of_the_day: Final[str] = f"{QUOTE} {AUTHOR}".strip()',
  ].join('\n');
  return { header, body };
}

const CodeQuote: React.FC = () => {
  const quote = useMemo(() => pickDaily(QUOTES), []);
  const lang = useMemo(dailyLang, []);
  const snippet = useMemo(() => renderSnippet(quote, lang), [quote, lang]);

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
      aria-label="Daily Thought (as code)"
    >
      {/* Window header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: 10, background: '#ff5f57', display: 'inline-block' }} />
          <span style={{ width: 10, height: 10, borderRadius: 10, background: '#ffbd2e', display: 'inline-block' }} />
          <span style={{ width: 10, height: 10, borderRadius: 10, background: '#28c840', display: 'inline-block' }} />
        </div>
        <div style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif', fontSize: 12 }}>
          {snippet.header}
        </div>
      </div>

      {/* Code area */}
      <pre
        style={{
          margin: 0,
          padding: '0.75rem 1rem',
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          borderRadius: 12,
          fontFamily: 'SFMono-Regular, Consolas, Monaco, Menlo, ui-monospace, monospace',
          fontSize: 13.5,
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          border: '1px solid var(--border-default)'
        }}
      >
        <code>{snippet.body}</code>
      </pre>
    </div>
  );
};

export default CodeQuote;
