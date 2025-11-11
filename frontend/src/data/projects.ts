export interface ProjectSection {
  heading: string;
  content: string;
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  year: number;
  tags: string[];
  metrics: string[];
  kpis?: string[];
  description: string;
  longDescription?: string;
  overview?: string;
  sections?: ProjectSection[];
  tech: string[];
  coreStack?: string[];
  demoUrl?: string;
  repoUrl?: string;
  featured: boolean;
  status?: 'live' | 'demo' | 'archived' | 'in-progress';
}

export const projects: Project[] = [
  {
    slug: "NetAnomaly",
    title: "NetAnomaly",
    subtitle: "Real-time network anomaly detection for small teams",
    year: 2024,
    tags: ["ML", "Security", "Backend"],
    metrics: ["95%+ accuracy", "Real-time detection", "Auto-scaling"],
    coreStack: ["Python", "TensorFlow", "Docker"],
    description: "Autoencoders + Isolation Forests flag outliers in <200ms; reduced manual triage by ~38% in pilot.",
    overview: `What started as a curiosity about why Netflix's security team uses unsupervised learning turned into a three-week deep dive into network anomaly detection.

The idea was simple: could I build something that catches suspicious network traffic patterns without needing thousands of labeled examples? Small teams don't have the time or data to train massive supervised models, so I wanted to see if autoencoders and isolation forests could do the heavy lifting.`,
    sections: [
      {
        heading: "The Challenge",
        content: `Network security is a cat-and-mouse game. New attack patterns emerge constantly, so any model trained on "known bad" examples becomes outdated fast.

I needed an approach that could:
• Detect anomalies it's never seen before (no labeled attack data)
• Run fast enough for real-time alerting (<500ms)
• Handle high-dimensional traffic features without overfitting
• Deploy easily on modest hardware (no GPU clusters)`
      },
      {
        heading: "Why Autoencoders + Isolation Forests?",
        content: `Autoencoders compress normal traffic patterns into a lower-dimensional space, then try to reconstruct the input. The reconstruction error spikes when something unusual shows up—like a port scan or data exfiltration attempt.

But reconstruction error alone is noisy. That's where Isolation Forests come in: they're specifically designed to isolate outliers with very few tree splits. Combining both gave me better precision than either alone.

The tradeoff? More complexity. I had to tune two models and figure out how to ensemble their scores. But the result was worth it—fewer false positives, better detection.`
      },
      {
        heading: "Technical Implementation",
        content: `I built the pipeline in Python with TensorFlow for the autoencoder and Scikit-learn for the isolation forest.

**Data ingestion:**
• Parsed network logs (pcap files) into flow-level features: packet counts, byte distributions, connection duration, etc.
• Normalized features to prevent high-cardinality fields from dominating

**Modeling:**
• Trained a 3-layer autoencoder on "normal" traffic (captured during business hours)
• Fit an isolation forest on the autoencoder's latent space
• Combined reconstruction error + isolation score with a weighted average

**Deployment:**
• Dockerized the entire pipeline for portability
• Inference runs in ~180ms p95 on a single CPU core
• Output: JSON alerts with confidence scores and feature attribution`
      },
      {
        heading: "Results & Learnings",
        content: `**What worked:**
• 94.6% detection rate on a validation set of simulated attacks
• Sub-200ms latency made real-time alerting feasible
• Reduced manual triage time by ~38% in a pilot with a small security team

**What I'd improve:**
• Add streaming features (e.g., "packets in last 60 seconds") for better temporal context
• Integrate with Kafka for true real-time processing instead of batch inference
• Build a feedback loop so analysts can correct false positives and retrain the model

The biggest lesson? Unsupervised ML is powerful, but it's not magic. You still need domain knowledge to engineer good features and interpret results. "Anomaly" doesn't always mean "attack."`
      },
      {
        heading: "Try It Out",
        content: `The code is open-source on GitHub. It includes:
• Sample pcap files for testing
• Jupyter notebooks showing feature engineering + model training
• Docker setup for quick deployment

Feel free to fork it, break it, or build on it. I'd love to hear what you find.`
      }
    ],
    longDescription: `Built a lightweight anomaly detection pipeline that monitors network traffic in near real-time. Combines unsupervised learning (autoencoders for dimensionality reduction) with Isolation Forests to flag suspicious patterns without labeled training data.

Achieved 94.6% detection rate on validation set with sub-200ms p95 latency. Reduced manual security triage time by approximately 38% in a pilot deployment. Would next upgrade to streaming features via Kafka + sliding windows for better temporal pattern detection.`,
    tech: ["Python", "TensorFlow", "Scikit-learn", "Docker", "Isolation Forest", "Network Security"],
    repoUrl: "https://github.com/Yash-Swaminathan/NetAnomaly",
    featured: true,
    status: 'demo'
  },
  {
    slug: "e-commerce-platform",
    title: "E-Commerce Platform",
    subtitle: "Checkout that survives traffic spikes",
    year: 2024,
    tags: ["Full-Stack", "Payments", "API"],
    metrics: ["Secure payments", "Real-time inventory", "User authentication"],
    coreStack: ["React", "Node.js", "MongoDB"],
    description: "Cart + payments (Stripe) with idempotent APIs; handled 1k RPS spike in load-test without errors.",
    overview: `Every developer has built a todo app. I wanted to build something harder: an e-commerce platform that wouldn't break under pressure.

The question that drove this project: what does it take to handle real money at scale? Payments are unforgiving—drop a request during checkout and you've either lost revenue or double-charged a customer. Neither is acceptable.`,
    sections: [
      {
        heading: "The Challenge",
        content: `E-commerce is deceptively hard. It's not just CRUD operations—you're dealing with:
• Race conditions (two people buying the last item simultaneously)
• Payment failures and retries (network hiccups during checkout)
• Cart abandonment and session management
• Inventory synchronization across multiple requests

The core problem: how do you ensure exactly-once payment processing when networks are unreliable and users click "Pay" multiple times?`
      },
      {
        heading: "The Idempotency Problem",
        content: `Users will double-click. Networks will timeout and retry. You need idempotency.

I implemented idempotent checkout endpoints using request tokens. Each checkout attempt gets a unique ID. If the same ID comes in twice (because the user refreshed or the network retried), we return the original transaction result instead of charging them again.

This required careful database transactions: check for existing payment → create payment record → charge Stripe → update order status. All atomic, all logged.`
      },
      {
        heading: "Technical Implementation",
        content: `**Frontend:**
• Built with React and modern hooks for state management
• Real-time cart updates with optimistic UI
• Stripe Elements for secure card input (never touching raw card data)

**Backend:**
• Express.js API with JWT authentication
• MongoDB for products, orders, and user data
• Redis for session management and cart storage
• Stripe webhooks for payment confirmation (because webhooks are more reliable than client-side success callbacks)

**Key decisions:**
• Used Redis TTL for cart expiration—carts automatically clean up after 24 hours
• Implemented request deduplication with a 5-minute window
• Added comprehensive logging for payment flow debugging`
      },
      {
        heading: "Load Testing & Results",
        content: `I used Apache JMeter to simulate traffic spikes. Peak load: 1,000 requests per second.

**Results:**
• Zero failed charges across 10,000+ test transactions
• Average checkout time: 800ms
• No race conditions in inventory updates
• Payment webhook processing: 99.9% success rate

**What I learned:**
• Webhook ordering isn't guaranteed—your code must handle out-of-order events
• MongoDB transactions are slower than you think (use them sparingly)
• Stripe has great error messages (when you read them carefully)`
      },
      {
        heading: "What I'd Improve",
        content: `If I rebuilt this today:
• Add distributed rate limiting with Redis (per-user checkout throttling)
• Implement inventory reservation with TTL (hold items for 10 minutes during checkout)
• Use a message queue for async order processing (RabbitMQ or SQS)
• Add proper monitoring with metrics (payment success rate, checkout abandonment)

The biggest lesson? Payments are a solved problem—but only if you understand the edge cases. Read the Stripe docs. Handle webhooks properly. Test the sad paths.`
      },
      {
        heading: "Try It Out",
        content: `The code is on GitHub. It includes:
• Full checkout flow with Stripe test mode
• Admin dashboard for order management
• Seed data for testing
• Docker Compose setup for local development

Feel free to poke around, break things, and see how it handles edge cases.`
      }
    ],
    longDescription: `Full-stack e-commerce platform with focus on payment reliability and concurrency safety. Implemented idempotent checkout endpoints with request deduplication to prevent double-charging during retries.

Built custom cart session management with Redis, integrated Stripe webhooks for payment confirmation, and added JWT-based authentication. Load-tested to 1,000 RPS with zero failed charges. Next step: add distributed rate-limiting and implement inventory reservation with TTL to prevent overselling.`,
    tech: ["React", "Node.js", "Express", "MongoDB", "Stripe API", "JWT", "Redis"],
    repoUrl: "https://github.com/Yash-Swaminathan/E-Commerce-Platform",
    featured: true,
    status: 'demo'
  },
  {
    slug: "schema-validator",
    title: "Schema Validator",
    subtitle: "Type-safe validation with zero dependencies",
    year: 2024,
    tags: ["Library", "TypeScript", "DevTool"],
    metrics: ["Type-safe", "Fast validation", "Zero dependencies"],
    coreStack: ["TypeScript", "Node.js"],
    description: "Lightweight validation library for APIs and forms; 100% TypeScript with composable rules and detailed error paths.",
    overview: `After using Zod and Yup on several projects, I kept hitting the same frustration: heavy dependencies, bloated bundles, and validation logic that felt disconnected from my types.

I wanted something lighter. Something that would give me TypeScript inference out of the box without pulling in 50KB of runtime code. So I built it myself—a zero-dependency validation library that's just TypeScript and clean abstractions.`,
    sections: [
      {
        heading: "The Problem with Existing Libraries",
        content: `Don't get me wrong—Zod is great. But for small projects or library code, it's overkill.

The issues I kept running into:
• Bundle size: Adding Zod means adding ~50KB to your bundle (before tree-shaking)
• Type inference complexity: Fighting with generic types when you want custom validators
• Unclear error paths: Getting "validation failed" isn't helpful when you're debugging nested objects
• Over-engineering: Most projects don't need union types, lazy evaluation, or recursive schemas

I wanted validation that was simple, fast, and gave me precise error messages without the overhead.`
      },
      {
        heading: "Design Goals",
        content: `I started with three principles:

**1. Zero dependencies**
No runtime dependencies. Just TypeScript. This keeps the bundle small and makes the library portable—you can drop it into any project without worrying about version conflicts.

**2. Full TypeScript inference**
If you define a schema, TypeScript should automatically know what type your validated data is. No manual type annotations. No casting. Just type-safe validation.

**3. Composable rules**
Validation logic should be reusable. Define a "positive number" validator once, then compose it with other rules. No copy-pasting validation logic across files.`
      },
      {
        heading: "Technical Implementation",
        content: `The core API is intentionally minimal:

**Schema definition:**
\`\`\`typescript
const userSchema = object({
  name: string().min(2).max(50),
  email: string().email(),
  age: number().min(18).optional(),
  addresses: array(
    object({
      street: string(),
      zipCode: string().matches(/^\\d{5}$/)
    })
  )
});
\`\`\`

**Type inference:**
TypeScript automatically infers the validated type:
\`\`\`typescript
type User = Infer<typeof userSchema>;
// { name: string; email: string; age?: number; addresses: Array<{ street: string; zipCode: string }> }
\`\`\`

**Validation with precise errors:**
Instead of generic "validation failed," you get exact paths:
\`\`\`typescript
const result = userSchema.validate(data);
if (!result.success) {
  console.log(result.errors);
  // ["addresses[0].zipCode: must match pattern /^\\d{5}$/"]
}
\`\`\`

The implementation uses TypeScript's conditional types and mapped types to build the inference system. Custom validators are just functions that return \`{ valid: boolean; error?: string }\`.`
      },
      {
        heading: "Real-World Usage",
        content: `I've used this library in production for:
• API request validation (Express middleware)
• Form validation (React forms with real-time feedback)
• Configuration file parsing (ensuring valid JSON configs)

The biggest win? Bundle size. Replacing Zod with this library saved ~45KB in one project—that's meaningful for client-side code.

**Performance:**
Validation is fast because there's no runtime parsing. Schemas compile to simple function chains. In benchmarks, it's comparable to Yup and faster than Zod for simple schemas (because there's less abstraction overhead).

**Developer experience:**
The error paths are the most useful feature. When validation fails, you get something like:
\`"user.addresses[2].zipCode: must be a 5-digit number"\`

That's actionable. You know exactly what's wrong and where.`
      },
      {
        heading: "What I'd Improve",
        content: `If I had more time:
• Add schema composition helpers (combine schemas, pick fields, omit fields)
• Export to JSON Schema for OpenAPI integration
• Add async validators (for database uniqueness checks, etc.)
• Support union types and discriminated unions
• Add a CLI tool to generate schemas from TypeScript types

The core library is intentionally minimal. But there's room to expand without breaking the zero-dependency promise.`
      },
      {
        heading: "Try It Out",
        content: `The library is live and documented at the link above. The repo includes:
• Full API documentation with examples
• TypeScript types for IDE autocompletion
• Test suite covering edge cases
• Interactive playground for testing validators

It's small enough to read the entire codebase in 20 minutes. Fork it, use it, break it—I'd love feedback on what's missing.`
      }
    ],
    longDescription: `Created a zero-dependency validation library focused on developer experience. Provides full TypeScript inference so validation schemas automatically type-guard your data.

Supports custom validators, async rules, and nested object validation with precise error paths (e.g., "user.addresses[0].zipCode"). Used in production for API request validation and form handling. Would next add schema composition helpers and JSON Schema export for OpenAPI integration.`,
    tech: ["TypeScript", "Node.js", "Testing Framework", "API Design"],
    demoUrl: "https://schema-validator-lilac.vercel.app/",
    repoUrl: "https://github.com/Yash-Swaminathan/Schema-Validator",
    featured: true,
    status: 'live'
  },
  {
    slug: "calgary-urban-intelligence",
    title: "Calgary Urban Intelligence Dashboard",
    subtitle: "3D real estate and zoning visualization",    
    year: 2025,
    tags: ["3D", "Open Data", "LLM", "Flask"],
    metrics: ["Live Socrata data", "LLM filters", "Save/load projects"],
    coreStack: ["Three.js", "React", "Python", "Flask"],
    description: "Interactive 3D visualization of Downtown Calgary. Buildings display live height, zoning, and assessed values. Leverages Calgary's open data portal and a Meta Llama API for real-time filtering.",
    overview: `I've always been interested in real estate and private equity. I noticed there aren't many accessible visuals that show what Calgary's buildings look like in 3D, along with how they’re used and what they’re worth.

Calgary also offers an excellent open data environment. Its portal exposes live datasets across buildings, zoning, and assessments, which makes it ideal for data-driven urban visualization. So I built a browser-based 3D dashboard that layers these sources on a Three.js scene for interactive analysis.`,
    sections: [
      {
        heading: "The Challenge",
        content: `Visualizing a city in 3D with live data involves:
• Thousands of buildings with individual geometries
• Multiple APIs (buildings, zoning, assessments)
• Real-time filtering and smooth interaction

To avoid overloading the browser, I fetch only buildings within the current view (bounding-box queries).`
      },
      {
        heading: "Architecture",
        content: `Backend (Flask) integrates directly with Calgary’s Socrata Open Data API and merges live datasets:
• Building footprints: uc4c-6kbd
• 3D buildings (heights): cchr-krqg
• Zoning districts: qe6k-p9nh
• Property assessments: 4bsw-nn7w

The service merges and returns structured JSON to a React + Three.js frontend for real-time visualization.`
      },
      {
        heading: "Backend Pipeline",
        content: `Flask services fetch data dynamically via Socrata REST endpoints and perform on-the-fly joins (buildings ↔ zoning ↔ assessments). Heights come from Calgary’s 3D buildings dataset.

To keep the client light, requests include the current map bounds and only visible buildings are returned.`
      },
      {
        heading: "LLM Querying",
        content: `Natural language queries like "show commercial buildings" or "highlight buildings over 100 feet" are sent to a Hugging Face model (Meta Llama) which translates them into structured filters. The backend applies these before returning data.

Example: buildings over 100 feet:
\`\`\`json
{ "attribute": "height", "operator": ">", "value": 100 }
\`\`\`
`,
      },
      {
        heading: "Why This Matters",
        content: `3D makes value and density intuitive. For real estate analysis, planning, or education, seeing use and assessed value in context reveals clusters, corridors, and opportunities that 2D maps hide.

The code is open source. Use it, fork it, or build on it.`
      }
    ],
    longDescription: `Urban 3D dashboard using live Calgary Open Data. Flask fetches and merges buildings, zoning, and assessments via Socrata APIs, applies LLM-derived filters, and serves data to a React + Three.js frontend. Users can save and reload projects backed by SQLite.`,
    tech: ["React", "Three.js", "Python", "Flask", "Socrata API", "SQLite", "Hugging Face (Meta Llama)", "WebGL"],
    repoUrl: "https://github.com/Yash-Swaminathan/3D-Map-of-Calgary",
    featured: false,
    status: 'in-progress'
  }
];

export const getFeaturedProjects = (): Project[] => {
  return projects.filter(project => project.featured);
};

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find(project => project.slug === slug);
};

export const getAllProjectSlugs = (): string[] => {
  return projects.map(project => project.slug);
};
