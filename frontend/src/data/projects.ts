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
  cover: string;
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
  teamSize?: string;
  timeline?: string;
}

export const projects: Project[] = [
  {
    slug: "NetAnomaly",
    title: "NetAnomaly",
    subtitle: "Real-time network anomaly detection for small teams",
    year: 2024,
    tags: ["ML", "Security", "Backend"],
    metrics: ["95%+ accuracy", "Real-time detection", "Auto-scaling"],
    kpis: ["94.6% detection", "200ms p95", "Dockerized"],
    coreStack: ["Python", "TensorFlow", "Docker"],
    cover: "/images/projects/netanomaly.png",
    description: "Autoencoders + Isolation Forests flag outliers in <200ms; reduced manual triage by ~38% in pilot.",
    teamSize: "Solo project",
    timeline: "3 weeks",
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
    kpis: ["0 failed charges", "1k RPS", "JWT auth"],
    coreStack: ["React", "Node.js", "MongoDB"],
    cover: "/images/projects/ecommerce.png",
    description: "Cart + payments (Stripe) with idempotent APIs; handled 1k RPS spike in load-test without errors.",
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
    kpis: ["Zero deps", "Full TS support", "Composable"],
    coreStack: ["TypeScript", "Node.js"],
    cover: "/images/projects/schema-validator.png",
    description: "Lightweight validation library for APIs and forms; 100% TypeScript with composable rules and detailed error paths.",
    longDescription: `Created a zero-dependency validation library focused on developer experience. Provides full TypeScript inference so validation schemas automatically type-guard your data.

Supports custom validators, async rules, and nested object validation with precise error paths (e.g., "user.addresses[0].zipCode"). Used in production for API request validation and form handling. Would next add schema composition helpers and JSON Schema export for OpenAPI integration.`,
    tech: ["TypeScript", "Node.js", "Testing Framework", "API Design"],
    demoUrl: "https://schema-validator-lilac.vercel.app/",
    repoUrl: "https://github.com/Yash-Swaminathan/Schema-Validator",
    featured: true,
    status: 'live'
  },
  {
    slug: "3d-map-calgary",
    title: "3D Map of Calgary",
    subtitle: "Interactive 3D city visualization",
    year: 2024,
    tags: ["3D", "Mapping", "Visualization"],
    metrics: ["3D rendering", "Interactive controls", "Real-time navigation"],
    kpis: ["WebGL", "3D tiles", "Performance"],
    coreStack: ["Three.js", "WebGL", "JavaScript"],
    cover: "/images/projects/calgary-3d.png",
    description: "Interactive 3D visualization of Calgary with real-time navigation and detailed city geometry.",
    longDescription: `Built an interactive 3D map of Calgary using WebGL and modern 3D rendering techniques. The visualization allows users to explore the city from different angles with smooth navigation controls and detailed building models.

Features include real-time 3D rendering, interactive camera controls, and optimized performance for large-scale city geometry. The map provides an immersive way to explore Calgary's urban landscape.`,
    tech: ["Three.js", "WebGL", "JavaScript", "3D Graphics", "Geospatial Data"],
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