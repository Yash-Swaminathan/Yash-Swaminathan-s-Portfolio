import React from 'react';
import './ProjectFigures.css';

type Kind = 'ink' | 'live' | 'store' | 'notify';

const LEGEND: Record<Kind, string> = {
  ink: 'Request / SQL',
  live: 'Real-time (WebSocket)',
  store: 'Data store',
  notify: 'Out-of-band notification'
};

/* ---------- SVG primitives ---------- */

const Defs: React.FC<{ id: string }> = ({ id }) => (
  <defs>
    {(Object.keys(LEGEND) as Kind[]).map(kind => (
      <marker key={kind} id={`${id}-${kind}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 10 5 0 10z" className={`fig-head-${kind}`} />
      </marker>
    ))}
  </defs>
);

const Arrow: React.FC<{ id: string; d: string; kind?: Kind; both?: boolean }> = ({ id, d, kind = 'ink', both }) => (
  <path
    d={d}
    className={`fig-line fig-line-${kind}`}
    markerEnd={`url(#${id}-${kind})`}
    markerStart={both ? `url(#${id}-${kind})` : undefined}
  />
);

interface BoxProps {
  x: number;
  y: number;
  w: number;
  h: number;
  title?: string;
  lines?: string[];
  variant?: 'box' | 'sub' | 'dashed' | 'store';
  tone?: Kind;
}

const Box: React.FC<BoxProps> = ({ x, y, w, h, title, lines = [], variant = 'box', tone }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={6} className={`fig-${variant}`} />
    {title && <text x={x + 14} y={y + 20} className={`fig-title${tone ? ` fig-text-${tone}` : ''}`}>{title}</text>}
    {lines.map((line, index) => (
      <text key={line} x={x + 14} y={y + (title ? 36 : 20) + index * 16} className="fig-mono">{line}</text>
    ))}
  </g>
);

const Label: React.FC<{ x: number; y: number; kind?: Kind; anchor?: 'start' | 'middle' | 'end'; halo?: boolean; children: React.ReactNode }> = ({ x, y, kind, anchor = 'middle', halo, children }) => (
  <text x={x} y={y} textAnchor={anchor} className={`fig-label${kind ? ` fig-text-${kind}` : ''}${halo ? ' fig-halo' : ''}`}>{children}</text>
);

interface FrameProps {
  label: string;
  width: number;
  height: number;
  legend?: (Kind | [Kind, string])[];
  caption?: React.ReactNode;
  children: React.ReactNode;
}

const Frame: React.FC<FrameProps> = ({ label, width, height, legend, caption, children }) => (
  <figure className="fig">
    <div className="fig-scroll" tabIndex={0} role="region" aria-label={`${label}, scrolls horizontally on small screens`}>
      <svg className="fig-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>{children}</svg>
    </div>
    {(legend || caption) && (
      <figcaption>
        {legend && (
          <span className="fig-legend">
            {legend.map(entry => {
              const [kind, text] = typeof entry === 'string' ? [entry, LEGEND[entry]] : entry;
              return <span key={kind} className={`fig-key fig-key-${kind}`}>{text}</span>;
            })}
          </span>
        )}
        {caption && <span className="fig-caption">{caption}</span>}
      </figcaption>
    )}
  </figure>
);

/* ---------- ChatterBox: system topology ---------- */

const ChatterboxTopology: React.FC = () => {
  const id = 'cb-topology';
  return (
    <Frame
      label="ChatterBox system topology: browsers reach one Node container over HTTPS and WSS; the container uses PostgreSQL and Redis and calls ntfy, Resend and optional object storage"
      width={1040}
      height={524}
      legend={['ink', 'live', 'store', 'notify']}
    >
      <Defs id={id} />
      <rect x={280} y={20} width={500} height={484} rx={8} className="fig-zone" />
      <text x={298} y={44} className="fig-cap">RAILWAY PROJECT · HTTPS TERMINATED AT THE PLATFORM PROXY</text>

      <Box x={20} y={104} w={192} h={186} title="Browser" lines={['React 18 SPA · Vite']} />
      <rect x={34} y={162} width={164} height={30} rx={4} className="fig-sub" />
      <rect x={34} y={200} width={164} height={30} rx={4} className="fig-sub" />
      <text x={116} y={181} textAnchor="middle" className="fig-chip">Visitor</text>
      <text x={116} y={219} textAnchor="middle" className="fig-chip">Owner</text>
      <text x={34} y={254} className="fig-mono">axios + socket.io-client</text>
      <text x={34} y={270} className="fig-mono">same origin, no CORS hop</text>

      <rect x={300} y={60} width={460} height={272} rx={6} className="fig-box" />
      <text x={318} y={86} className="fig-title">App container</text>
      <text x={424} y={86} className="fig-mono">node:22-alpine · one process · PORT</text>
      <Box x={318} y={100} w={424} h={46} variant="sub" title="Express static" lines={['client/dist + SPA fallback to index.html']} />
      <Box x={318} y={156} w={424} h={46} variant="sub" title="REST API" lines={['/api · auth users conversations messages contacts']} />
      <Box x={318} y={212} w={424} h={46} variant="sub" tone="live" title="Socket.io" lines={['JWT handshake · rooms · presence · messaging']} />
      <Box x={318} y={268} w={424} h={46} variant="dashed" title="In-process state" lines={['userSockets map · rate limiter · 60s reminder sweep']} />

      <Box x={300} y={400} w={220} h={84} variant="store" tone="store" title="PostgreSQL" lines={['users · sessions · contacts', 'conversations · messages', '21 migrations run on start']} />
      <Box x={540} y={400} w={220} h={84} variant="store" tone="store" title="Redis" lines={['presence · unread · cache', 'cooldowns · reminders zset', 'Socket.io adapter pub/sub']} />

      <Box x={850} y={100} w={170} h={56} title="ntfy" lines={["push to owner's phone"]} />
      <Box x={850} y={176} w={170} h={56} title="Resend" lines={['owner + visitor email']} />
      <Box x={850} y={262} w={170} h={56} variant="dashed" title="Object storage" lines={['S3 API · avatars']} />

      <Arrow id={id} d="M212 179H318" />
      <Arrow id={id} d="M212 235H318" kind="live" both />
      <Arrow id={id} d="M410 332V400" kind="store" />
      <Arrow id={id} d="M650 332V400" kind="store" both />
      <Arrow id={id} d="M760 128H850" kind="notify" />
      <Arrow id={id} d="M760 204H850" kind="notify" />
      <Arrow id={id} d="M760 290H850" />

      <Label x={246} y={172}>HTTPS</Label>
      <Label x={246} y={228} kind="live">WSS</Label>
      <Label x={420} y={370} anchor="start">SQL · pg pool</Label>
      <Label x={660} y={370} anchor="start">get/set · pub/sub</Label>
      <Label x={815} y={121} kind="notify">POST</Label>
      <Label x={815} y={197} kind="notify">POST</Label>
      <Label x={815} y={283}>PUT</Label>
    </Frame>
  );
};

/* ---------- ChatterBox: sending a message ---------- */

const ChatterboxMessageFlow: React.FC = () => {
  const id = 'cb-sequence';
  const lanes: { x: number; name: string; store?: boolean }[] = [
    { x: 90, name: 'Visitor browser' },
    { x: 290, name: 'Server' },
    { x: 480, name: 'PostgreSQL', store: true },
    { x: 640, name: 'Redis', store: true },
    { x: 800, name: 'Owner browser' },
    { x: 950, name: 'ntfy · Resend' }
  ];
  return (
    <Frame
      label="Sequence for sending a message: validate, store in PostgreSQL, update Redis, broadcast to the conversation room, acknowledge the sender, then notify the owner without blocking delivery"
      width={1040}
      height={486}
      legend={['live', 'store', 'notify']}
    >
      <Defs id={id} />
      {lanes.map(lane => (
        <g key={lane.name}>
          <path d={`M${lane.x} 50V470`} className="fig-lifeline" />
          <rect x={lane.x - 65} y={16} width={130} height={34} rx={6} className={lane.store ? 'fig-store' : 'fig-box'} />
          <text x={lane.x} y={38} textAnchor="middle" className={`fig-title fig-title-sm${lane.store ? ' fig-text-store' : ''}`}>{lane.name}</text>
        </g>
      ))}

      <Arrow id={id} d="M90 86H290" kind="live" />
      <Label x={190} y={79} kind="live" halo>message:send + tempId</Label>

      <rect x={286} y={104} width={8} height={24} rx={2} className="fig-activation" />
      <Label x={304} y={120} anchor="start" halo>validate, rate limit (in memory)</Label>

      <Arrow id={id} d="M290 148H480" kind="store" />
      <Label x={304} y={141} anchor="start" halo>isParticipant? blocked?</Label>
      <Arrow id={id} d="M290 180H480" kind="store" />
      <Label x={304} y={173} anchor="start" halo>INSERT message + status rows</Label>
      <Arrow id={id} d="M290 212H640" kind="store" />
      <Label x={304} y={205} anchor="start" halo>DEL recent cache, INCR unread</Label>

      <Arrow id={id} d="M290 248H800" kind="live" />
      <Label x={304} y={241} anchor="start" kind="live" halo>{'message:new → conversation:{id}'}</Label>
      <Arrow id={id} d="M290 248H90" kind="live" />
      <Label x={190} y={241} kind="live" halo>message:new (echo)</Label>
      <Arrow id={id} d="M290 280H90" kind="live" />
      <Label x={190} y={273} kind="live" halo>message:sent tempId → id</Label>

      <path d="M24 312H1016" className="fig-line fig-line-notify" />
      <Label x={304} y={331} anchor="start" kind="notify" halo>not awaited from here: never delays delivery</Label>

      <Arrow id={id} d="M290 362H640" kind="notify" />
      <Label x={304} y={355} anchor="start" kind="notify" halo>ZADD reminders:pending NX, due +90m</Label>
      <Arrow id={id} d="M290 394H640" kind="notify" />
      <Label x={304} y={387} anchor="start" kind="notify" halo>SET NX cooldown 10m, INCR hourly cap</Label>
      <Arrow id={id} d="M290 426H950" kind="notify" />
      <Label x={304} y={419} anchor="start" kind="notify" halo>ntfy push + Resend email to owner</Label>
      <Label x={304} y={445} anchor="start" halo>only if owner offline or first message</Label>
    </Frame>
  );
};

/* ---------- ChatterBox: data model ---------- */

type Column = [name: string, tag?: string];

const Table: React.FC<{ x: number; y: number; name: string; columns: Column[] }> = ({ x, y, name, columns }) => {
  const w = 240;
  const h = 36 + columns.length * 18;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={5} className="fig-box" />
      <path d={`M${x} ${y + 26}V${y + 5}a5 5 0 0 1 5-5H${x + w - 5}a5 5 0 0 1 5 5V${y + 26}Z`} className="fig-thead" />
      <rect x={x} y={y} width={w} height={h} rx={5} className="fig-outline" />
      <text x={x + 12} y={y + 18} className="fig-title fig-title-sm">{name}</text>
      {columns.map(([column, tag], index) => (
        <React.Fragment key={column}>
          <text x={x + 12} y={y + 44 + index * 18} className="fig-mono fig-mono-strong">{column}</text>
          {tag && <text x={x + w - 12} y={y + 44 + index * 18} textAnchor="end" className="fig-mono">{tag}</text>}
        </React.Fragment>
      ))}
    </g>
  );
};

const ChatterboxDataModel: React.FC = () => {
  const id = 'cb-schema';
  return (
    <Frame
      label="ChatterBox data model: sessions, password_resets, contacts, conversation_participants and messages reference users; participants and messages reference conversations; message_status references messages"
      width={1040}
      height={608}
      caption={<>Arrows point from the foreign key to the table it references. Not drawn: <code>message_status.user_id</code> and <code>conversations.created_by</code> also reference <code>users</code>. Only key columns are shown.</>}
    >
      <Defs id={id} />
      <Table x={24} y={20} name="sessions" columns={[['id', 'PK'], ['user_id', 'FK'], ['refresh_token', 'UQ'], ['expires_at'], ['is_active']]} />
      <Table x={24} y={176} name="password_resets" columns={[['id', 'PK'], ['user_id', 'FK'], ['token_hash', 'UQ'], ['expires_at', '30 min'], ['used_at']]} />
      <Table x={24} y={332} name="contacts" columns={[['id', 'PK'], ['user_id', 'FK'], ['contact_user_id', 'FK'], ['is_blocked'], ['is_favorite']]} />

      <Table x={400} y={20} name="users" columns={[['id', 'PK'], ['username', 'UQ'], ['email', 'UQ'], ['password_hash', 'bcrypt'], ['status'], ['last_seen'], ['hide_read_status'], ['email_notifications']]} />
      <Table x={400} y={250} name="conversation_participants" columns={[['conversation_id', 'PK FK'], ['user_id', 'PK FK'], ['role', 'admin|member'], ['joined_at'], ['left_at'], ['last_read_at']]} />
      <Table x={400} y={444} name="conversations" columns={[['id', 'PK'], ['type', 'direct|group'], ['name'], ['avatar_url'], ['created_by', 'FK'], ['updated_at']]} />

      <Table x={776} y={20} name="messages" columns={[['id', 'PK'], ['conversation_id', 'FK'], ['sender_id', 'FK'], ['content', '≤ 10000'], ['reply_to_id', 'self FK'], ['deleted_at', 'soft']]} />
      <Table x={776} y={214} name="message_status" columns={[['message_id', 'FK'], ['user_id', 'FK'], ['status', 'sent→read'], ['delivered_at'], ['read_at']]} />

      <Arrow id={id} d="M264 80H400" />
      <Arrow id={id} d="M264 239H320V130H400" />
      <Arrow id={id} d="M264 395H348V170H400" />
      <Arrow id={id} d="M776 70H640" />
      <Arrow id={id} d="M776 130H708V516H640" />
      <Arrow id={id} d="M896 214V164" />
      <Arrow id={id} d="M520 250V200" />
      <Arrow id={id} d="M520 394V444" />

      <Label x={332} y={73} halo>user_id</Label>
      <Label x={292} y={232} halo>user_id</Label>
      <Label x={306} y={388} halo>2 FKs</Label>
      <Label x={708} y={63} halo>sender_id</Label>
      <Label x={718} y={400} anchor="start" halo>conversation_id</Label>
      <Label x={906} y={193} anchor="start" halo>message_id</Label>
      <Label x={530} y={229} anchor="start" halo>user_id</Label>
      <Label x={530} y={423} anchor="start" halo>conversation_id</Label>
    </Frame>
  );
};

/* ---------- ChatterBox: inside the server ---------- */

interface PipelineStep {
  title: string;
  body: React.ReactNode;
}

const Pipeline: React.FC<{ title: string; path: string; tone?: Kind; steps: PipelineStep[] }> = ({ title, path, tone = 'ink', steps }) => (
  <div className={`fig-pipeline fig-pipeline-${tone}`}>
    <h3>{title}</h3>
    <code className="fig-path">{path}</code>
    <ol>
      {steps.map(step => (
        <li key={step.title}><strong>{step.title}</strong><span>{step.body}</span></li>
      ))}
    </ol>
  </div>
);

const ChatterboxServer: React.FC = () => (
  <div className="fig fig-columns">
    <Pipeline
      title="HTTP request"
      path="app.js → routes/ → controllers/ → models/"
      steps={[
        { title: 'helmet, CORS, JSON body', body: <>CSP allows <code>https:</code> images for avatars. <code>trust proxy</code> is 1 in production so limits see the real client IP.</> },
        { title: 'Rate limit', body: 'Per IP on auth routes: signup 10 per hour, forgot-password 3 per hour per IP and per email.' },
        { title: 'requireAuth', body: <>Verifies the 15 minute access token. Refresh tokens last 7 days and live in <code>sessions</code>.</> },
        { title: 'Owner-only guard', body: <><code>ownerOnly.js</code>: non-owners get 403 on search, group creation, and any target that is not themselves or the owner.</> },
        { title: 'Validation → controller → model', body: <>Controllers emit socket events through <code>app.get('io')</code> when a REST change must show up live.</> }
      ]}
    />
    <Pipeline
      title="Socket connection"
      path="socket/index.js → middleware/socketAuth → handlers/"
      tone="live"
      steps={[
        { title: 'socketAuth', body: <>JWT from the handshake <code>auth</code> callback, so a reconnect always sends the current token.</> },
        { title: 'Join rooms', body: <><code>{'user:{id}'}</code> plus every <code>{'conversation:{id}'}</code> the user belongs to. No client-side join step.</> },
        { title: 'Presence online', body: 'Written to Redis with a 60s TTL, broadcast to contacts, kept alive by a 25s client heartbeat.' },
        { title: 'Event handlers', body: <><code>messageHandler</code> (send, edit, delete, delivered, read) and <code>presenceHandler</code> (heartbeat, status).</> },
        { title: 'Emit, then notify', body: <>Broadcast to the room first; <code>messageNotifications.onMessageSent()</code> runs unawaited afterwards.</> }
      ]}
    />
  </div>
);

/* ---------- ChatterBox: notifications ---------- */

type FlowStep = [kind: 'step' | 'check' | 'out', text: React.ReactNode];

const Flow: React.FC<{ title: string; steps: FlowStep[] }> = ({ title, steps }) => (
  <div className="fig-flow">
    <h3>{title}</h3>
    <ol>
      {steps.map(([kind, text], index) => <li key={index}><span className={`fig-flow-${kind}`}>{text}</span></li>)}
    </ol>
  </div>
);

const ChatterboxNotifications: React.FC = () => (
  <div className="fig fig-flows">
    <Flow
      title="Visitor writes to the owner"
      steps={[
        ['step', 'Message saved and broadcast'],
        ['step', 'Reminder scheduled for +90 min (first unanswered message only)'],
        ['check', 'Owner offline, or first message of the conversation?'],
        ['check', '1 per conversation per 10 min · 30 per hour overall'],
        ['out', 'Push + email to owner']
      ]}
    />
    <Flow
      title="Owner replies"
      steps={[
        ['step', 'Message saved and broadcast'],
        ['step', 'Reminder removed'],
        ['check', 'Recipient has no open socket?'],
        ['check', <><code>email_notifications</code> on · 1 per conversation per 30 min</>],
        ['out', 'Email to visitor, with signed unsubscribe link']
      ]}
    />
    <Flow
      title="Owner has not replied"
      steps={[
        ['step', 'Sweep every 60s'],
        ['step', <>Read entries in <code>reminders:pending</code> with score ≤ now</>],
        ['check', 'Remove first; skip if someone else already removed it'],
        ['out', 'Reminder push + email to owner']
      ]}
    />
    <div className="fig-flow-key"><span className="fig-flow-step">step</span><span className="fig-flow-check">condition</span><span className="fig-flow-out">sent outside the app</span></div>
  </div>
);

/* ---------- ChatterBox: Redis keys ---------- */

const REDIS_KEYS: [key: string, type: string, purpose: string][] = [
  ['presence:{userId}', 'string, 60s TTL', 'Current status. Expires on its own if heartbeats stop.'],
  ['user:sockets:{userId}', 'set', 'Open socket ids; the user goes offline when the last one leaves.'],
  ['user:contacts:{userId}', 'cached list', 'Who to broadcast a presence change to.'],
  ['conversation:{id}:messages:recent', 'cache', 'Latest page of history. Deleted on send, edit and delete.'],
  ['conversation:{id}:unread:{userId}', 'counter', 'Sidebar badge. Reset by message:read.'],
  ['user:{userId}:unread:total', 'counter', 'Total unread across conversations.'],
  ['message:{id}:status', 'cache', 'Delivered and read state per recipient.'],
  ['reminders:pending', 'sorted set', 'Score is the due time, member is the conversation id. Survives a restart.'],
  ['notify:owner:conv:{id}', 'NX key, 10 min', 'One owner notification per conversation per window.'],
  ['notify:owner:hourly', 'counter, 1 h', 'Cap of 30 owner notifications per hour.'],
  ['notify:reply:{conv}:{user}', 'NX key, 30 min', 'One reply email per visitor per window.']
];

const ChatterboxRedis: React.FC = () => (
  <div className="fig fig-scroll fig-table" tabIndex={0} role="region" aria-label="Redis keys used by ChatterBox">
    <table>
      <thead><tr><th>Key</th><th>Type</th><th>Purpose</th></tr></thead>
      <tbody>
        {REDIS_KEYS.map(([key, type, purpose]) => (
          <tr key={key}><td><code>{key}</code></td><td>{type}</td><td>{purpose}</td></tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ---------- termshare: session topology ---------- */

const TermshareTopology: React.FC = () => {
  const id = 'ts-topology';
  return (
    <Frame
      label="termshare topology: host and viewer browsers connect over a WebSocket to one Go process, whose session loop relays bytes between the browsers and a Unix PTY running a shell"
      width={1040}
      height={372}
      legend={[['ink', 'HTTP page load'], ['live', 'WebSocket'], ['store', 'Local terminal I/O']]}
      caption="Binary frames carry terminal bytes; text frames carry JSON control (role, viewer count, permissions, resize)."
    >
      <Defs id={id} />
      <rect x={300} y={20} width={720} height={332} rx={8} className="fig-zone" />
      <text x={318} y={44} className="fig-cap">HOST MACHINE · TRUSTED LAN / VPN · ALL STATE IN MEMORY</text>

      <Box x={20} y={92} w={212} h={178} title="Browser terminals" lines={['xterm.js + fit addon']} />
      <Box x={34} y={146} w={184} h={50} variant="sub" title="Host" lines={['?key= · type · resize']} />
      <Box x={34} y={206} w={184} h={50} variant="sub" title="Viewers" lines={['read-only until allowed']} />

      <rect x={320} y={60} width={400} height={272} rx={6} className="fig-box" />
      <text x={338} y={86} className="fig-title">termshare</text>
      <text x={412} y={86} className="fig-mono">one Go process · gorilla/websocket</text>
      <Box x={338} y={100} w={364} h={46} variant="sub" title="HTTP + WebSocket handlers" lines={['embedded UI · /s/{id} · /s/{id}/ws']} />
      <Box x={338} y={156} w={364} h={46} variant="sub" title="Hub" lines={['session registry · lookup by id']} />
      <Box x={338} y={212} w={364} h={46} variant="sub" tone="live" title="Session loop" lines={['host key · viewer write flag · broadcast']} />
      <Box x={338} y={268} w={177} h={46} variant="dashed" title="Scrollback" lines={['256 KiB · late joiners']} />
      <Box x={525} y={268} w={177} h={46} variant="dashed" title="Client queues" lines={['bounded · drop slow']} />

      <Box x={790} y={92} w={210} h={56} variant="store" tone="store" title="Shell" lines={['$SHELL or bash · one shared']} />
      <Box x={790} y={207} w={210} h={56} variant="store" tone="store" title="Unix PTY" lines={['read · write · host resize']} />

      <Arrow id={id} d="M232 123H338" />
      <Arrow id={id} d="M232 235H338" kind="live" both />
      <Arrow id={id} d="M702 235H790" kind="store" both />
      <Arrow id={id} d="M895 207V148" kind="store" both />

      <Label x={266} y={116}>HTTP</Label>
      <Label x={266} y={228} kind="live">WS</Label>
      <Label x={755} y={228} kind="store">bytes</Label>
      <Label x={905} y={182} anchor="start" kind="store">stdin / stdout</Label>
    </Frame>
  );
};

/* ---------- termshare: terminal flow ---------- */

const TermshareFlow: React.FC = () => {
  const id = 'ts-sequence';
  const lanes: { x: number; name: string; store?: boolean }[] = [
    { x: 110, name: 'Host browser' },
    { x: 330, name: 'Viewer browser' },
    { x: 600, name: 'Session loop' },
    { x: 880, name: 'PTY · shell', store: true }
  ];
  return (
    <Frame
      label="termshare terminal flow: a late viewer receives its role and the scrollback replay; viewer keystrokes are ignored until the host allows typing; shell output is broadcast to every client and a client with a full queue is dropped"
      width={1040}
      height={546}
      legend={[['live', 'WebSocket frame'], ['store', 'PTY read / write'], ['notify', 'Ignored or dropped']]}
    >
      <Defs id={id} />
      {lanes.map(lane => (
        <g key={lane.name}>
          <path d={`M${lane.x} 50V530`} className="fig-lifeline" />
          <rect x={lane.x - 70} y={16} width={140} height={34} rx={6} className={lane.store ? 'fig-store' : 'fig-box'} />
          <text x={lane.x} y={38} textAnchor="middle" className={`fig-title fig-title-sm${lane.store ? ' fig-text-store' : ''}`}>{lane.name}</text>
        </g>
      ))}

      <text x={24} y={80} className="fig-cap fig-halo">A VIEWER JOINS LATE</text>
      <Arrow id={id} d="M330 106H600" kind="live" />
      <Label x={465} y={99} kind="live" halo>{'connect /s/{id}/ws'}</Label>
      <Arrow id={id} d="M600 138H330" kind="live" />
      <Label x={465} y={131} kind="live" halo>role: viewer, canWrite false</Label>
      <Arrow id={id} d="M600 170H330" kind="live" />
      <Label x={465} y={163} kind="live" halo>scrollback replay, up to 256 KiB</Label>
      <Arrow id={id} d="M600 202H110" kind="live" />
      <Arrow id={id} d="M600 202H330" kind="live" />
      <Label x={465} y={195} kind="live" halo>count: viewers</Label>
      <Label x={220} y={195} kind="live" halo>count</Label>

      <text x={24} y={240} className="fig-cap fig-halo">THE VIEWER TYPES BEFORE THE HOST ALLOWS IT</text>
      <Arrow id={id} d="M330 266H600" kind="notify" />
      <Label x={465} y={259} kind="notify" halo>keystroke</Label>
      <Label x={614} y={270} anchor="start" kind="notify" halo>ignored: canWrite is false</Label>
      <Arrow id={id} d="M110 298H600" kind="live" />
      <Label x={220} y={291} kind="live" halo>set_acl: viewersWrite</Label>
      <Label x={614} y={302} anchor="start" halo>host only</Label>
      <Arrow id={id} d="M600 330H110" kind="live" />
      <Arrow id={id} d="M600 330H330" kind="live" />
      <Label x={465} y={323} kind="live" halo>role: canWrite true</Label>
      <Label x={220} y={323} kind="live" halo>role</Label>
      <Arrow id={id} d="M330 362H600" kind="live" />
      <Label x={465} y={355} kind="live" halo>keystroke</Label>
      <Arrow id={id} d="M600 362H880" kind="store" />
      <Label x={740} y={355} kind="store" halo>write</Label>

      <text x={24} y={400} className="fig-cap fig-halo">THE SHELL PRINTS OUTPUT</text>
      <Arrow id={id} d="M880 426H600" kind="store" />
      <Label x={740} y={419} kind="store" halo>read, up to 4096 bytes</Label>
      <rect x={596} y={438} width={8} height={22} rx={2} className="fig-activation" />
      <Label x={614} y={453} anchor="start" halo>append scrollback, queue per client</Label>
      <Arrow id={id} d="M600 482H110" kind="live" />
      <Arrow id={id} d="M600 482H330" kind="live" />
      <Label x={465} y={475} kind="live" halo>output</Label>
      <Label x={220} y={475} kind="live" halo>output</Label>
      <Arrow id={id} d="M600 514H330" kind="notify" />
      <Label x={465} y={507} kind="notify" halo>queue full (256 frames): dropped</Label>
    </Frame>
  );
};

const EcommerceTopology: React.FC = () => {
  const id = 'ecommerce-topology';
  return (
    <Frame
      label="E-commerce service layout: a Next.js storefront calls the Go product catalog and the Spring Boot user service; the Go search service reads the same products table; the order service owns the orders tables. All four share one PostgreSQL database under Docker Compose. A payment service, a Node payments API and the deployment configuration are in the repository but not started by Compose"
      width={1040}
      height={518}
      legend={[['ink', 'HTTP / JSON'], ['store', 'SQL']]}
      caption="Each row is one service and the table it uses. The lower group is in the repository but is not started by Compose. Nothing is currently hosted."
    >
      <Defs id={id} />
      <rect x={270} y={20} width={750} height={340} rx={8} className="fig-zone" />
      <text x={288} y={44} className="fig-cap">DOCKER COMPOSE · FIVE CONTAINERS · ONE SHARED DATABASE</text>

      <Box x={20} y={96} w={190} h={170} title="Storefront" lines={['Next.js 14 · React 18', 'axios · one base URL', 'per service']} />

      <Box x={290} y={96} w={200} h={46} title="Product catalog" lines={['Go · Gin · :8080']} />
      <Box x={518} y={96} w={222} h={46} variant="sub" title="CRUD /products" lines={['lib/pq · parameterized SQL']} />

      <Box x={290} y={158} w={200} h={46} title="Search" lines={['Go · Gin · :8082']} />
      <Box x={518} y={158} w={222} h={46} variant="sub" title="GET /search?q=" lines={['LIKE on name + description']} />

      <Box x={290} y={220} w={200} h={46} title="User service" lines={['Spring Boot · :8081']} />
      <Box x={518} y={220} w={222} h={46} variant="sub" title="POST /api/users/register" lines={['BCrypt hash · HTTP Basic']} />

      <Box x={290} y={282} w={200} h={46} title="Order service" lines={['Spring Boot · :8083']} />
      <Box x={518} y={282} w={222} h={46} variant="sub" title="Order + OrderItem" lines={['JPA service · no routes yet']} />

      <Box x={800} y={56} w={200} h={286} variant="store" tone="store" title="PostgreSQL 15" lines={['database: ecommerce']} />
      <Box x={814} y={108} w={172} h={84} variant="sub" title="products" lines={['name · price · stock', 'image_url']} />
      <Box x={814} y={220} w={172} h={46} variant="sub" title="users" lines={['email · password hash']} />
      <Box x={814} y={282} w={172} h={46} variant="sub" title="orders" lines={['order_items · total']} />

      <Arrow id={id} d="M210 119H290" both />
      <Arrow id={id} d="M210 243H290" both />
      <Arrow id={id} d="M490 119H518" />
      <Arrow id={id} d="M490 181H518" />
      <Arrow id={id} d="M490 243H518" />
      <Arrow id={id} d="M490 305H518" />
      <Arrow id={id} d="M740 119H814" kind="store" both />
      <Arrow id={id} d="M740 181H814" kind="store" />
      <Arrow id={id} d="M740 243H814" kind="store" both />
      <Arrow id={id} d="M740 305H814" kind="store" both />

      <Label x={240} y={112}>JSON</Label>
      <Label x={240} y={236}>JSON</Label>
      <Label x={770} y={174} kind="store">read</Label>

      <rect x={20} y={380} width={1000} height={118} rx={8} className="fig-zone" />
      <text x={38} y={404} className="fig-cap">IN THE REPOSITORY · NOT STARTED BY COMPOSE</text>
      <Box x={38} y={418} w={312} h={62} variant="dashed" title="Payment service" lines={['Spring Boot · Stripe PaymentIntent', 'create · process · list by order']} />
      <Box x={364} y={418} w={312} h={62} variant="dashed" title="Node payments API" lines={['Express · Prisma · Stripe webhooks', 'refunds · disputes · S3 image upload']} />
      <Box x={690} y={418} w={312} h={62} variant="dashed" title="Deployment config" lines={['k8s: 2 replicas each · HPA on users', 'Actions → ECR · Terraform S3 + IAM']} />
    </Frame>
  );
};

const SchemaTopology: React.FC = () => {
  const id = 'schema-topology';
  return (
    <Frame
      label="Schema Validator request paths: the React app calls one FastAPI container. Validation runs PyYAML then jsonschema against Schema.py; comparison runs PyYAML on both documents then DeepDiff; only the configs endpoints pass through Pydantic and psycopg2 to PostgreSQL"
      width={1040}
      height={482}
      legend={[['ink', 'HTTP request / in-process call'], ['store', 'SQL']]}
      caption="Each row is one request path, read left to right. Checking or comparing a file never saves it."
    >
      <Defs id={id} />
      <rect x={280} y={20} width={740} height={336} rx={8} className="fig-zone" />
      <text x={298} y={44} className="fig-cap">CLOUD RUN SERVICE · ONE DOCKER IMAGE · SCALES TO ZERO</text>

      <Box x={20} y={92} w={196} h={248} title="Browser" lines={['React 18 SPA · Vercel']} />
      <Box x={34} y={148} w={168} h={46} variant="sub" title="Validate" lines={['upload one file']} />
      <Box x={34} y={212} w={168} h={46} variant="sub" title="Compare" lines={['files or pasted text']} />
      <Box x={34} y={276} w={168} h={46} variant="sub" title="Config forms" lines={['Formik + Yup checks']} />

      <rect x={300} y={60} width={700} height={280} rx={6} className="fig-box" />
      <text x={318} y={86} className="fig-title">FastAPI app</text>
      <text x={412} y={86} className="fig-mono">python:3.12-slim · uvicorn</text>
      <Box x={780} y={74} w={202} h={46} variant="dashed" title="Schema.py" lines={['required: name age email']} />

      <Box x={318} y={148} w={206} h={46} variant="sub" title="POST /validate" lines={['one uploaded YAML file']} />
      <Box x={552} y={148} w={200} h={46} variant="sub" title="PyYAML" lines={['yaml.safe_load']} />
      <Box x={780} y={148} w={202} h={46} variant="sub" title="jsonschema" lines={['validate against SCHEMA']} />

      <Box x={318} y={212} w={206} h={46} variant="sub" title="POST /compare-schemas" lines={['+ /compare-schema-files']} />
      <Box x={552} y={212} w={200} h={46} variant="sub" title="PyYAML × 2" lines={['safe_load both documents']} />
      <Box x={780} y={212} w={202} h={46} variant="sub" title="DeepDiff" lines={['ignore_order=True']} />

      <Box x={318} y={276} w={206} h={46} variant="sub" title="CRUD /configs" lines={['POST · GET PUT DELETE /{id}']} />
      <Box x={552} y={276} w={200} h={46} variant="sub" title="Pydantic ConfigInput" lines={['name · age ≥ 0 · EmailStr']} />
      <Box x={780} y={276} w={202} h={46} variant="sub" tone="store" title="psycopg2" lines={['parameterized SQL · %s']} />

      <Box x={740} y={396} w={242} h={66} variant="store" tone="store" title="PostgreSQL" lines={['configs table · 11 columns', 'created on startup if absent']} />

      <Arrow id={id} d="M216 171H318" both />
      <Arrow id={id} d="M216 235H318" both />
      <Arrow id={id} d="M216 299H318" both />
      <Arrow id={id} d="M524 171H552" />
      <Arrow id={id} d="M752 171H780" />
      <Arrow id={id} d="M524 235H552" />
      <Arrow id={id} d="M752 235H780" />
      <Arrow id={id} d="M524 299H552" />
      <Arrow id={id} d="M752 299H780" />
      <Arrow id={id} d="M881 120V148" />
      <Arrow id={id} d="M881 322V396" kind="store" both />

      <Label x={248} y={164}>YAML file</Label>
      <Label x={248} y={228}>YAML × 2</Label>
      <Label x={248} y={292}>JSON</Label>
      <Label x={869} y={382} anchor="end" kind="store">SQL · new connection per request</Label>
    </Frame>
  );
};

const CalgaryTopology: React.FC = () => {
  const id = 'calgary-topology';
  return (
    <Frame
      label="Calgary dashboard request paths: the React and three.js client calls one Flask app. Loading an area checks the building cache, and on a miss the DataFetcher merges OpenStreetMap with five Calgary open datasets; a question goes through LLMService and is applied as a filter in Python; projects store filters as JSON. All three use one SQLite database through SQLAlchemy"
      width={1040}
      height={482}
      legend={[['ink', 'HTTP request / in-process call'], ['live', 'Outbound fetch to open data'], ['store', 'SQL']]}
      caption="Each row is one request path, read left to right. Buildings are fetched once and cached; later loads and filters read the cached rows unless a refresh is requested."
    >
      <Defs id={id} />
      <Box x={20} y={92} w={196} h={248} title="Browser" lines={['React 18 · three.js']} />
      <Box x={34} y={148} w={168} h={46} variant="sub" title="3D map" lines={['extruded footprints']} />
      <Box x={34} y={212} w={168} h={46} variant="sub" title="Query box" lines={['plain-English filter']} />
      <Box x={34} y={276} w={168} h={46} variant="sub" title="Projects" lines={['save / load filters']} />

      <rect x={270} y={60} width={534} height={280} rx={6} className="fig-box" />
      <text x={286} y={86} className="fig-title">Flask app</text>
      <text x={364} y={86} className="fig-mono">port 5001 · routes under /api · Flask-SQLAlchemy</text>

      <Box x={286} y={148} w={170} h={46} variant="sub" title="GET /buildings/area" lines={['bounds · refresh']} />
      <Box x={472} y={148} w={150} h={46} variant="sub" title="Cache check" lines={['empty or refresh?']} />
      <Box x={638} y={148} w={150} h={46} variant="sub" tone="live" title="DataFetcher" lines={['merge 6 sources']} />

      <Box x={286} y={212} w={170} h={46} variant="sub" title="POST /query/process" lines={['question + bounds']} />
      <Box x={472} y={212} w={150} h={46} variant="sub" title="LLMService" lines={['flan-t5 then rules']} />
      <Box x={638} y={212} w={150} h={46} variant="sub" title="Filter in Python" lines={['matches_filter()']} />

      <Box x={286} y={276} w={170} h={46} variant="sub" title="/projects" lines={['save · list · load']} />
      <Box x={472} y={276} w={150} h={46} variant="sub" title="Project model" lines={['filters as JSON']} />
      <Box x={638} y={276} w={150} h={46} variant="sub" title="Reapply on load" lines={['same filter code']} />

      <Box x={850} y={84} w={170} h={46} title="OpenStreetMap" lines={['Overpass · base layer']} />
      <Box x={850} y={150} w={170} h={100} title="Calgary Open Data" lines={['Socrata · 5 datasets', 'outlines · 3D heights', 'permits · assessments', 'land-use districts']} />

      <Box x={286} y={392} w={502} h={66} variant="store" tone="store" title="SQLite (default)" lines={['buildings: cached merge result · projects · users', 'DATABASE_URL swaps in another database']} />

      <Arrow id={id} d="M216 171H286" both />
      <Arrow id={id} d="M216 235H286" both />
      <Arrow id={id} d="M216 299H286" both />
      <Arrow id={id} d="M456 171H472" />
      <Arrow id={id} d="M622 171H638" />
      <Arrow id={id} d="M456 235H472" />
      <Arrow id={id} d="M622 235H638" />
      <Arrow id={id} d="M456 299H472" />
      <Arrow id={id} d="M622 299H638" />
      <Arrow id={id} d="M788 163H826V107H850" kind="live" />
      <Arrow id={id} d="M788 179H826V200H850" kind="live" />
      <Arrow id={id} d="M537 340V392" kind="store" both />

      <Label x={243} y={164}>bounds</Label>
      <Label x={243} y={228}>question</Label>
      <Label x={243} y={292}>filters</Label>
      <Label x={549} y={372} anchor="start" kind="store">SQLAlchemy</Label>
    </Frame>
  );
};

export const projectFigures: Record<string, React.FC> = {
  'ecommerce-topology': EcommerceTopology,
  'schema-topology': SchemaTopology,
  'calgary-topology': CalgaryTopology,
  'chatterbox-topology': ChatterboxTopology,
  'chatterbox-server': ChatterboxServer,
  'chatterbox-message-flow': ChatterboxMessageFlow,
  'chatterbox-notifications': ChatterboxNotifications,
  'chatterbox-data-model': ChatterboxDataModel,
  'chatterbox-redis': ChatterboxRedis,
  'termshare-topology': TermshareTopology,
  'termshare-flow': TermshareFlow
};
