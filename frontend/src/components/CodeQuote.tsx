import React, { useMemo, useState } from 'react';

type Quote = {
  text: string;
  author?: string;
};

// People who inspire me and why
const INSPIRATIONAL_PEOPLE = [
  { name: 'Swaminathan Tanjore (My Dad)', reason: 'Immigrated to Canada from India and built a successful company through resilience and vision.' },
  { name: 'Madhavi Swaminathan (My Mom)', reason: 'Her values, support, and patience shaped who I am today.' },
  { name: 'LeBron James', reason: "It's LeBron..." },
  { name: 'Linus Torvalds', reason: 'Created Linux and Git — motivated by a passion for improvement rather than profit, proving that open-source collaboration can transform the world.' },
  { name: 'Steve Jobs', reason: 'His ability to blend design, innovation, and purpose changed how the world interacts with technology.' },  
];

// Small, developer-friendly quotes. Rotates daily and renders as code.
const QUOTES: Quote[] = [
  { text: 'Yesterday is history, tomorrow is a mystery, but today is a gift. That is why it is called the present.', author: 'Master Oogway' },
  { text: 'Simplicity is the soul of efficiency.', author: 'Austin Freeman' },
  { text: 'Programs must be written for people to read.', author: 'Harold Abelson' },
  { text: 'Make it work, make it right, make it fast.', author: 'Kent Beck' },
  { text: 'Premature optimization is the root of all evil.', author: 'Donald Knuth' },
  { text: 'The only way to go fast, is to go well.', author: 'Robert C. Martin' },
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

// Syntax highlighting colors (IDE-style)
const SYNTAX_COLORS = {
  keyword: '#C586C0',      // Purple for keywords
  string: '#CE9178',       // Orange for strings
  variable: '#9CDCFE',     // Light blue for variables
  type: '#4EC9B0',         // Teal for types
  comment: '#6A9955',      // Green for comments
  function: '#DCDCAA',     // Yellow for functions
  operator: '#D4D4D4',     // Light gray for operators
  punctuation: '#D4D4D4',  // Light gray for punctuation
};

function highlightSyntax(code: string, lang: Lang): React.ReactNode[] {
  const lines = code.split('\n');
  return lines.map((line, lineIndex) => {
    const tokens: React.ReactNode[] = [];
    let currentIndex = 0;

    if (lang === 'ts') {
      // TypeScript syntax highlighting patterns (order matters - first match wins)
      const patterns = [
        { regex: /(\/\*.*?\*\/|\/\/.*$)/g, color: SYNTAX_COLORS.comment },
        { regex: /(`[^`]*`)/g, color: SYNTAX_COLORS.string }, // Template literals first (includes ${...})
        { regex: /(".*?"|'.*?')/g, color: SYNTAX_COLORS.string }, // Regular strings
        { regex: /(export|const|let|var|function|return|if|else|for|while|class|interface|type|import|from)\b/g, color: SYNTAX_COLORS.keyword },
        { regex: /(string|number|boolean|any|void|undefined|null)\b/g, color: SYNTAX_COLORS.type },
        { regex: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\s*[:\(])/g, color: SYNTAX_COLORS.variable },
      ];

      const matches: Array<{ start: number; end: number; color: string; text: string }> = [];

      patterns.forEach(pattern => {
        let match: RegExpExecArray | null;
        const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
        while ((match = regex.exec(line)) !== null) {
          const matchIndex = match.index;
          const matchLength = match[0].length;
          
          // Check if this position is already covered by a previous match
          const overlaps = matches.some(m => 
            (matchIndex >= m.start && matchIndex < m.end) ||
            (matchIndex + matchLength > m.start && matchIndex + matchLength <= m.end) ||
            (matchIndex <= m.start && matchIndex + matchLength >= m.end)
          );
          
          if (!overlaps) {
            matches.push({
              start: matchIndex,
              end: matchIndex + matchLength,
              color: pattern.color,
              text: match[0]
            });
          }
        }
      });

      // Sort matches by start position
      matches.sort((a, b) => a.start - b.start);

      // Build highlighted line
      let lastEnd = 0;
      matches.forEach((match, index) => {
        // Add unhighlighted text before this match
        if (match.start > lastEnd) {
          tokens.push(
            <span key={`${lineIndex}-${index}-before`} style={{ color: SYNTAX_COLORS.operator }}>
              {line.slice(lastEnd, match.start)}
            </span>
          );
        }
        
        // Add highlighted match (skip if it would overlap with previous)
        if (match.start >= lastEnd) {
          tokens.push(
            <span key={`${lineIndex}-${index}-match`} style={{ color: match.color }}>
              {match.text}
            </span>
          );
          lastEnd = match.end;
        }
      });

      // Add remaining unhighlighted text
      if (lastEnd < line.length) {
        tokens.push(
          <span key={`${lineIndex}-end`} style={{ color: SYNTAX_COLORS.operator }}>
            {line.slice(lastEnd)}
          </span>
        );
      }

    } else {
      // Python syntax highlighting patterns (order matters - first match wins)
      const patterns = [
        { regex: /(#.*$)/g, color: SYNTAX_COLORS.comment },
        { regex: /(f"[^"]*"|f'[^']*')/g, color: SYNTAX_COLORS.string }, // f-strings first
        { regex: /(".*?"|'.*?')/g, color: SYNTAX_COLORS.string }, // regular strings
        { regex: /(from|import|def|class|if|else|elif|for|while|return|try|except|finally|with|as|in|is|not|and|or|lambda|yield|async|await)\b/g, color: SYNTAX_COLORS.keyword },
        { regex: /(str|int|float|bool|list|dict|tuple|set|None|True|False|Final)\b/g, color: SYNTAX_COLORS.type },
        { regex: /\b([A-Z_][A-Z0-9_]*)\b/g, color: SYNTAX_COLORS.variable },
      ];

      const matches: Array<{ start: number; end: number; color: string; text: string }> = [];

      patterns.forEach(pattern => {
        let match: RegExpExecArray | null;
        const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
        while ((match = regex.exec(line)) !== null) {
          const matchIndex = match.index;
          const matchLength = match[0].length;
          
          // Check if this position is already covered by a previous match
          const overlaps = matches.some(m => 
            (matchIndex >= m.start && matchIndex < m.end) ||
            (matchIndex + matchLength > m.start && matchIndex + matchLength <= m.end) ||
            (matchIndex <= m.start && matchIndex + matchLength >= m.end)
          );
          
          if (!overlaps) {
            matches.push({
              start: matchIndex,
              end: matchIndex + matchLength,
              color: pattern.color,
              text: match[0]
            });
          }
        }
      });

      // Sort matches by start position
      matches.sort((a, b) => a.start - b.start);

      // Build highlighted line
      let lastEnd = 0;
      matches.forEach((match, index) => {
        // Add unhighlighted text before this match
        if (match.start > lastEnd) {
          tokens.push(
            <span key={`${lineIndex}-${index}-before`} style={{ color: SYNTAX_COLORS.operator }}>
              {line.slice(lastEnd, match.start)}
            </span>
          );
        }
        
        // Add highlighted match (skip if it would overlap with previous)
        if (match.start >= lastEnd) {
          tokens.push(
            <span key={`${lineIndex}-${index}-match`} style={{ color: match.color }}>
              {match.text}
            </span>
          );
          lastEnd = match.end;
        }
      });

      // Add remaining unhighlighted text
      if (lastEnd < line.length) {
        tokens.push(
          <span key={`${lineIndex}-end`} style={{ color: SYNTAX_COLORS.operator }}>
            {line.slice(lastEnd)}
          </span>
        );
      }
    }

    return (
      <div key={lineIndex}>
        {tokens.length > 0 ? tokens : <span style={{ color: SYNTAX_COLORS.operator }}>{line}</span>}
      </div>
    );
  });
}

function renderSnippet(quote: Quote, lang: Lang): { header: string; body: string } {
  const text = quote.text.replace(/"/g, '\\"');
  const author = quote.author ? quote.author : '';

  if (lang === 'ts') {
    // TypeScript-style snippet
    const header = 'TypeScript';
    const body = [
      '/* quote_of_the_day.ts */',
      `const quote: string = "${text}";`,
      `const author: string = "${author}";`,
      'export const quoteOfTheDay: string = author ? `${quote} - ${author}` : quote;',
    ].join('\n');
    return { header, body };
  }

  // Python-style snippet
  const header = 'Python';
  const body = [
    '# thought_of_the_day.py',
    'from typing import Final',
    `QUOTE: Final[str] = "${text}"`,
    `AUTHOR: Final[str] = "${author}"`,
    'thought_of_the_day: Final[str] = f"{QUOTE} - {AUTHOR}".strip() if AUTHOR else QUOTE',
  ].join('\n');
  return { header, body };
}

const CodeQuote: React.FC = () => {
  const quote = useMemo(() => pickDaily(QUOTES), []);
  const lang = useMemo(dailyLang, []);
  const snippet = useMemo(() => renderSnippet(quote, lang), [quote, lang]);
  const highlightedCode = useMemo(() => highlightSyntax(snippet.body, lang), [snippet.body, lang]);
  const dailyPerson = useMemo(() => pickDaily(INSPIRATIONAL_PEOPLE), []);
  const [showOutput, setShowOutput] = useState(false);

  // Generate the actual output that the code would produce
  const codeOutput = useMemo(() => {
    const author = quote.author ? ` - ${quote.author}` : '';
    return `${quote.text}${author}`;
  }, [quote]);

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
      {/* Inspirational Person Section */}
      <div style={{ 
        marginBottom: '1rem', 
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

      {/* Window header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button
            onClick={() => setShowOutput(!showOutput)}
            style={{ 
              width: 10, 
              height: 10, 
              borderRadius: 10, 
              background: '#ff5f57', 
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.1s ease',
              display: 'inline-block',
              position: 'relative'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            title={showOutput ? "Show code" : "Show output"}
          />
          <span style={{ width: 10, height: 10, borderRadius: 10, background: '#ffbd2e', display: 'inline-block' }} />
          <span style={{ width: 10, height: 10, borderRadius: 10, background: '#28c840', display: 'inline-block' }} />
          <span style={{ 
            fontSize: 10, 
            color: 'var(--text-muted)', 
            fontFamily: 'Inter, sans-serif',
            marginLeft: 4,
            userSelect: 'none'
          }}>
            {showOutput ? '← code (red button)' : '→ run (red button)'}
          </span>
        </div>
        <div style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif', fontSize: 12 }}>
          {showOutput ? 'Output' : snippet.header}
        </div>
      </div>

      {/* Code area with syntax highlighting or output */}
      {showOutput ? (
        <div
          style={{
            margin: 0,
            padding: '0.75rem 1rem',
            background: 'var(--bg-primary)',
            borderRadius: 12,
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            lineHeight: 1.6,
            border: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{
            textAlign: 'center',
            color: 'var(--text-primary)',
            padding: '1rem 0'
          }}>
            <div style={{
              fontSize: 16,
              fontWeight: 500,
              marginBottom: '0.5rem',
              color: 'var(--text-primary)'
            }}>
              {quote.text}
            </div>
            {quote.author && (
              <div style={{
                fontSize: 14,
                color: 'var(--text-muted)',
                fontStyle: 'italic'
              }}>
                — {quote.author}
              </div>
            )}
          </div>
        </div>
      ) : (
        <pre
          style={{
            margin: 0,
            padding: '0.75rem 1rem',
            background: 'var(--bg-primary)',
            borderRadius: 12,
            fontFamily: 'SFMono-Regular, Consolas, Monaco, Menlo, ui-monospace, monospace',
            fontSize: 13.5,
            lineHeight: 1.6,
            border: '1px solid var(--border-default)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflow: 'auto'
          }}
        >
          <code style={{ display: 'block' }}>
            {highlightedCode}
          </code>
        </pre>
      )}
    </div>
  );
};

export default CodeQuote;
