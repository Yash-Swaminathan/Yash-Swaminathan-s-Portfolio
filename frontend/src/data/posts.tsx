import React from 'react';
import { SamplerBudget, SamplerDecision, SamplerHashing, SamplerPlacement } from '../components/WritingFigures';

export interface Post {
  slug: string;
  title: string;
  summary: string;
  date: string;
  dateLabel: string;
  Body: React.FC;
}

const TraceSampler: React.FC = () => (
  <>
    <p>
      I spent my internship on StackAdapt's backend infra team working on our data ingestion pipeline, and the project I'm most
      proud of is a custom trace sampler I built to fix a problem I'd actually created myself.
    </p>

    <h2>The problem</h2>
    <p>
      After I instrumented 22 Go microservices with OpenTelemetry, we were suddenly generating ~4,500 traces/sec. We were sampling
      a random 10% of all traces, which sounds fine until you realize "random" means a trace showing a real error had the exact
      same odds of survival as a totally normal request. When something actually broke, there was no guarantee the trace you
      needed to debug it still existed.
    </p>
    <SamplerBudget />

    <h2>The fix</h2>
    <p>
      I built a sampler that still keeps roughly 10% of total volume, but changes <em>which</em> 10%. Error traces and abnormally
      slow traces always get kept. The rest gets sampled normally.
    </p>

    <h2>Hashing to keep traces linked across services</h2>
    <p>
      A single request touches multiple services, and each one decides independently whether to keep its own spans. Nothing
      coordinates between them. That's a problem: if each service rolled the dice separately, you could end up with service A
      keeping its spans for a request while service B drops its spans for that <em>same</em> request. The trace just dead-ends
      halfway through.
    </p>
    <p>
      Fix: hash the trace ID. Same input, same hash, every time, so every service lands on the same keep/drop decision
      independently, with zero communication needed. Consistency for free.
    </p>
    <SamplerHashing />

    <h2>The tradeoff, and why it was fine</h2>
    <p>
      One honest limitation: this doesn't guarantee 100% of traces stay fully linked end-to-end. A happy-path trace can still end
      up partial if services land on different sides of the sample, since the hash gives you <em>consistency</em>, not a guarantee
      every service keeps every trace. But that wasn't actually the goal. What we cared about was making sure error and slow
      traces stayed linked across services, since those are the ones you actually need when debugging. Losing a bit of continuity
      on routine, successful requests was a totally fine trade for never losing the trail on something that actually broke.
    </p>

    <h2>Error &amp; slow traces</h2>
    <p>
      Instead of one global "slow" number, each service defines its own threshold in its config, based on real measured latency
      for that service. Makes sense: a slow trace for one service might be totally normal for another. Error thresholds work the
      same way, tunable per service.
    </p>
    <SamplerDecision />

    <h2>Why not a central collector?</h2>
    <p>
      The standard way to do this is a central collector, a separate service that buffers full traces and samples after seeing
      the whole thing. I looked at it and passed. It meant building and running a whole new piece of infrastructure to maintain,
      for a problem that didn't need that much machinery yet. Instead I added the sampler straight into a shared library all 22
      services already used, so turning it on anywhere was just a config change. No new service, no new deploy, no new thing to
      babysit.
    </p>
    <SamplerPlacement />

    <h2>Metrics + dashboard</h2>
    <p>
      On top of the sampler, I added end-to-end and consolidation-e2e metrics and used them to build an on-call dashboard so
      engineers could see which calls were failing, how often, and whether it looked like a workflow issue, a span issue, or just
      a bug.
    </p>

    <p className="writing-post-stack">OpenTelemetry · Go · Kafka · SQS · gRPC · Temporal · TiDB · Grafana Tempo</p>
  </>
);

export const posts: Post[] = [
  {
    slug: 'trace-sampler',
    title: 'Building a Smarter Trace Sampler at StackAdapt',
    summary: 'Keeping the same 10% of trace volume, but making sure the errors and slow requests are in it.',
    date: '2026-10',
    dateLabel: 'Oct 2026',
    Body: TraceSampler
  }
];
