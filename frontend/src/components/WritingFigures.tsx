import React from 'react';
import { Arrow, Box, Defs, Frame, Label } from './ProjectFigures';

/* ---------- Trace sampler: same budget, different traces ---------- */

type TraceType = 'norm' | 'error' | 'slow';

const ERROR_TRACES = [13, 37, 62];
const SLOW_TRACES = [28, 71];

const Glyph: React.FC<{ type: TraceType; kept: boolean; x: number; y: number }> = ({ type, kept, x, y }) => {
  const className = `fig-glyph fig-glyph-${type}${kept ? '' : ' is-lost'}`;
  if (type === 'error') {
    return <polygon points={`${x},${y - 8} ${x + 8},${y} ${x},${y + 8} ${x - 8},${y}`} className={className} />;
  }
  if (type === 'slow') {
    return <polygon points={`${x},${y - 8} ${x + 8},${y + 6} ${x - 8},${y + 6}`} className={className} />;
  }
  return <circle cx={x} cy={y} r={5.5} className={className} />;
};

const TracePanel: React.FC<{ y: number; title: string; summary: string; kept: number[] }> = ({ y, title, summary, kept }) => (
  <g>
    <text x={20} y={y + 28} className="fig-title">{title}</text>
    <text x={20} y={y + 46} className="fig-mono">{summary}</text>
    {Array.from({ length: 80 }, (_, index) => {
      const type: TraceType = ERROR_TRACES.includes(index) ? 'error' : SLOW_TRACES.includes(index) ? 'slow' : 'norm';
      return (
        <Glyph
          key={index}
          type={type}
          kept={kept.includes(index)}
          x={36 + (index % 20) * 42.5}
          y={y + 74 + Math.floor(index / 20) * 26}
        />
      );
    })}
  </g>
);

const SamplerBudget: React.FC = () => (
  <Frame
    label="Two samples of the same 80 traces. Random sampling keeps 8 and loses two of three errors and both slow traces. The priority-aware sampler also keeps 8, including every error and slow trace"
    width={880}
    height={384}
    caption="The same 80 traces sampled two ways. Both keep 8. Random sampling loses two of the three errors and both slow traces; the new sampler spends the budget on those first and fills the remainder by hash."
  >
    <TracePanel y={0} title="Before: a random 10%" summary="8 of 80 kept · 1 of 3 errors survives · 0 of 2 slow traces survive" kept={[4, 19, 26, 37, 45, 53, 66, 78]} />
    <line x1={20} y1={180} x2={860} y2={180} className="fig-rule" />
    <TracePanel y={180} title="After: errors and slow traces first" summary="8 of 80 kept · 3 of 3 errors · 2 of 2 slow traces · the rest by hash" kept={[13, 37, 62, 28, 71, 19, 45, 66]} />

    <Glyph type="norm" kept x={36} y={366} />
    <Label x={50} y={370} anchor="start">kept</Label>
    <Glyph type="norm" kept={false} x={116} y={366} />
    <Label x={130} y={370} anchor="start">dropped</Label>
    <Glyph type="error" kept x={226} y={366} />
    <Label x={242} y={370} anchor="start">error trace</Label>
    <Glyph type="slow" kept x={356} y={365} />
    <Label x={372} y={370} anchor="start">slow trace</Label>
    <Glyph type="error" kept={false} x={486} y={366} />
    <Label x={502} y={370} anchor="start">hollow = lost</Label>
  </Frame>
);

/* ---------- Trace sampler: hashing the trace ID ---------- */

const SERVICE_X = [40, 330, 620];

const ServiceRow: React.FC<{ id: string; y: number; title: string; kept: boolean[]; checks: string[]; outcome: string; tone: 'live' | 'error' }> = ({ id, y, title, kept, checks, outcome, tone }) => (
  <g>
    <text x={40} y={y + 24} className="fig-title">{title}</text>
    {SERVICE_X.map((x, index) => (
      <g key={x}>
        <Box
          x={x}
          y={y + 42}
          w={220}
          h={52}
          variant={kept[index] ? 'keep' : 'dashed'}
          tone={kept[index] ? 'live' : undefined}
          title={`Service ${'ABC'[index]}`}
          lines={[kept[index] ? 'keeps its spans' : 'drops its spans']}
        />
        <Label x={x + 14} y={y + 116} anchor="start">{checks[index]}</Label>
        {index < 2 && <Arrow id={id} d={`M${x + 220} ${y + 68}H${x + 290}`} />}
        {index < 2 && <Label x={x + 255} y={y + 60}>7f3a</Label>}
      </g>
    ))}
    <text x={40} y={y + 150} className={`fig-chip fig-text-${tone}`}>{outcome}</text>
  </g>
);

const SamplerHashing: React.FC = () => {
  const id = 'sampler-hashing';
  return (
    <Frame
      label="One request with trace ID 7f3a passes through services A, B and C. With independent random sampling A and C keep their spans and B drops its spans, leaving a hole. When each service hashes the trace ID they all compute the same value and all keep the trace"
      width={880}
      height={370}
      caption="One request, trace ID 7f3a, crossing three services. Independent dice give three different answers and a trace with a hole in it. Hashing the ID gives every service the same number, so they reach the same decision with no coordination."
    >
      <Defs id={id} />
      <ServiceRow
        id={id}
        y={0}
        title="Each service rolls its own dice"
        kept={[true, false, true]}
        checks={['rand() = 0.04 < 0.10', 'rand() = 0.61 ≥ 0.10', 'rand() = 0.08 < 0.10']}
        outcome="B is missing, so the trace dead-ends between A and C."
        tone="error"
      />
      <line x1={20} y1={180} x2={860} y2={180} className="fig-rule" />
      <ServiceRow
        id={id}
        y={190}
        title="Each service hashes the trace ID"
        kept={[true, true, true]}
        checks={['hash(7f3a) = 0.07 < 0.10', 'hash(7f3a) = 0.07 < 0.10', 'hash(7f3a) = 0.07 < 0.10']}
        outcome="Same input, same answer. All three agree without talking to each other."
        tone="live"
      />
    </Frame>
  );
};

/* ---------- Trace sampler: what each service checks ---------- */

const CHECKS = [
  { x: 200, title: 'Error?', line: 'per-service threshold', yes: 'always kept' },
  { x: 420, title: 'Slow?', line: 'per-service threshold', yes: 'always kept' },
  { x: 640, title: 'hash(trace_id)', line: 'under sample rate?', yes: 'sampled share' }
];

const SamplerDecision: React.FC = () => {
  const id = 'sampler-decision';
  return (
    <Frame
      label="Decision flow inside the shared tracing library used by 22 Go services. A span is kept if it is an error, kept if it is slower than the service's own threshold, and otherwise kept only if the hash of its trace ID falls under the sample rate. Everything else is dropped"
      width={940}
      height={270}
      caption="The sampler runs inside the shared library in all 22 services. Errors and slow traces skip the lottery. Everything else is kept only if the hash of its trace ID falls under the sample rate."
    >
      <Defs id={id} />
      <Box x={20} y={50} w={140} h={60} title="22 Go services" lines={['shared OTel library']} />
      <Arrow id={id} d="M160 80H200" />
      {CHECKS.map(check => (
        <g key={check.x}>
          <Box x={check.x} y={50} w={170} h={60} title={check.title} lines={[check.line]} />
          <Arrow id={id} d={`M${check.x + 170} 80H${check.x + 220}`} />
          <Label x={check.x + 195} y={72}>no</Label>
          <Arrow id={id} d={`M${check.x + 85} 110V200`} kind="live" />
          <Label x={check.x + 95} y={150} anchor="start" kind="live">yes</Label>
          <Label x={check.x + 95} y={166} anchor="start">{check.yes}</Label>
        </g>
      ))}
      <Box x={860} y={50} w={60} h={60} variant="dashed" title="Drop" />
      <Box x={200} y={200} w={610} h={50} variant="keep" tone="live" title="Keep" lines={['exported with the rest of the trace']} />
    </Frame>
  );
};

/* ---------- Trace sampler: collector versus library ---------- */

const SERVICES = [
  { y: 50, name: 'service 1' },
  { y: 110, name: 'service 2' },
  { y: 200, name: 'service 22' }
];

const SamplerPlacement: React.FC = () => {
  const id = 'sampler-placement';
  return (
    <Frame
      label="Two architectures. A central collector receives every span from every service, buffers whole traces and samples them, which adds a new service to run. The built design puts the sampler inside the shared library in each service, so only kept spans leave the service and nothing new is deployed"
      width={880}
      height={290}
      caption="A collector has to receive every span before it can decide, and it is a new service to operate. Putting the decision in the library every service already imports means only kept spans leave the process, and rollout is a config change."
    >
      <Defs id={id} />
      <text x={10} y={24} className="fig-title">Central collector (the standard way)</text>
      {SERVICES.map(service => (
        <g key={service.name}>
          <rect x={10} y={service.y} width={110} height={40} rx={4} className="fig-sub" />
          <text x={65} y={service.y + 25} textAnchor="middle" className="fig-chip">{service.name}</text>
        </g>
      ))}
      <text x={65} y={182} textAnchor="middle" className="fig-chip">⋮</text>
      <Arrow id={id} d="M120 70L180 115" />
      <Arrow id={id} d="M120 130L180 145" />
      <Arrow id={id} d="M120 220L180 175" />
      <Label x={160} y={58}>all spans</Label>
      <Box x={180} y={85} w={145} h={120} variant="cost" tone="notify" title="Collector" lines={['buffers all spans,', 'samples whole', 'traces']} />
      <Arrow id={id} d="M325 145H355" />
      <Label x={340} y={137}>kept</Label>
      <Box x={355} y={115} w={75} h={60} variant="store" tone="store" title="Trace" lines={['store']} />
      <Label x={10} y={276} anchor="start" kind="notify">one more service to build, deploy and babysit</Label>

      <line x1={450} y1={10} x2={450} y2={286} className="fig-rule" />

      <text x={470} y={24} className="fig-title">Sampler in the shared library (what I built)</text>
      {SERVICES.map(service => (
        <g key={service.name}>
          <rect x={470} y={service.y} width={170} height={40} rx={4} className="fig-sub" />
          <text x={482} y={service.y + 25} className="fig-chip">{service.name}</text>
          <rect x={572} y={service.y + 8} width={60} height={24} rx={4} className="fig-keep" />
          <text x={602} y={service.y + 24} textAnchor="middle" className="fig-mono fig-text-live">sampler</text>
        </g>
      ))}
      <text x={555} y={182} textAnchor="middle" className="fig-chip">⋮</text>
      <Arrow id={id} d="M640 70L790 130" kind="live" />
      <Arrow id={id} d="M640 130L790 145" kind="live" />
      <Arrow id={id} d="M640 220L790 160" kind="live" />
      <Label x={735} y={226}>kept spans only</Label>
      <Box x={790} y={115} w={80} h={60} variant="store" tone="store" title="Trace" lines={['store']} />
      <Label x={470} y={276} anchor="start" kind="live">turned on per service with a config change</Label>
    </Frame>
  );
};

export { SamplerBudget, SamplerHashing, SamplerDecision, SamplerPlacement };
