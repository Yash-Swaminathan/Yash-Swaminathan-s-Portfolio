export interface ProjectSection {
  heading: string;
  content: string;
  bullets?: string[];
  figure?: string;
}

export interface Project {
  slug: string;
  title: string;
  name?: string;
  subtitle: string;
  year: number;
  month?: number;
  tags: string[];
  metrics: string[];
  kpis?: string[];
  description: string;
  longDescription?: string;
  overview?: string;
  diagram?: string;
  figure?: string;
  technicalPresentation?: boolean;
  setupUrl?: string;
  extensionUrl?: string;
  sections?: ProjectSection[];
  tech: string[];
  coreStack?: string[];
  demoUrl?: string;
  repoUrl?: string;
  resourceLabels?: { repo: string; demo: string };
  featured: boolean;
  status?: 'live' | 'demo' | 'archived' | 'in-progress';
}

const projectCatalog: Project[] = [
  {
    slug: 'chatterbox',
    title: 'ChatterBox',
    subtitle: 'A real-time chat app where visitors can message me privately',
    year: 2025,
    month: 11,
    tags: ['Backend', 'Messaging'],
    metrics: ['Conversation rooms', 'Redis message caching'],
    description: 'A deployed messaging app where a quick signup opens a live chat with me. Visitors cannot see or message each other.',
    overview: 'ChatterBox is a real-time messaging app I built and deployed on Railway, with live delivery and presence over WebSockets. On the live site, signing up opens a chat with me. I get notified when someone writes, and visitors cannot see or message each other.',
    figure: 'chatterbox-topology',
    technicalPresentation: true,
    setupUrl: 'https://github.com/Yash-Swaminathan/ChatterBox/blob/main/DEPLOY.md',
    sections: [
      {
        heading: 'System Architecture',
        content: 'One image, one origin: the Dockerfile builds the client and the server serves it alongside the API and the socket, so there is no Nginx and no cross-origin configuration. PostgreSQL is the record; Redis holds presence, caches, unread counts, and notification throttling. Push and email are plain `fetch` calls with an eight-second timeout, each skipped when its environment variable is missing, and the app starts without object storage.'
      },
      {
        heading: 'Engineering decisions',
        content: '',
        bullets: [
          'Persist, then broadcast: recipients only see messages after they are saved in Postgres. Optimistic UI gives the sender immediate feedback while the write completes.',
          'Notifications off the delivery path: slow push or email providers do not delay chat. Cooldowns and an hourly cap reduce spam, so not every message triggers an alert.',
          'Postgres full-text search instead of Elasticsearch: a GIN index keeps search in the existing database, without a second datastore to keep in sync. A dedicated search engine would offer more flexibility.',
          'Advisory locks on conversation creation: concurrent requests are serialized so they do not create duplicate direct conversations.',
          'Private by default in owner-only mode: visitors can only message the owner, with no user search or email exposure. The restrictions are enforced server-side, not just hidden in the UI.',
          'One deployable, one instance: Express serves the React build, avoiding a separate frontend proxy and cross-origin setup. Scaling out still requires coordinating process-local rate limits and connection checks, even with the Redis Socket.IO adapter.'
        ]
      },
      {
        heading: 'Features and testing',
        content: 'JWT authentication and password reset handle account access. Resend sends email notifications to me and to visitors when I reply. Owner-only mode keeps visitor conversations private, with restrictions enforced on the server. The project includes about 800 server tests.'
      },
      {
        heading: 'Inside the server',
        figure: 'chatterbox-server',
        content: 'Two entry points share the same models and services. REST handles everything that can be fetched or changed on demand; the socket handles everything that has to arrive without asking.'
      },
      {
        heading: 'Message flow',
        figure: 'chatterbox-message-flow',
        content: 'The client shows the message immediately under a `tempId` and swaps in the real id on `message:sent`; a `message:error` carrying the same `tempId` turns it into a retry. The database write happens before any broadcast, so a recipient never sees a message that was not stored.\n\nLimits: 30 messages per minute, 5 per second, with a 30 second penalty.'
      },
      {
        heading: 'Notifications',
        figure: 'chatterbox-notifications',
        content: 'Three paths, all throttled through Redis keys. If Redis is down the throttle check is allowed through, on the reasoning that a duplicate ping is better than a missed visitor.'
      },
      {
        heading: 'Data model',
        figure: 'chatterbox-data-model',
        content: 'Messages carry a GIN full-text index for search, and direct-conversation creation takes a PostgreSQL advisory lock so two simultaneous requests cannot create duplicates.'
      },
      {
        heading: 'What lives in Redis',
        figure: 'chatterbox-redis',
        content: 'PostgreSQL is the record. Redis holds everything that is cheap to lose: the server starts and keeps delivering messages without it, minus presence, unread badges, and throttling.'
      }
    ],
    tech: ['Node.js', 'Express', 'Socket.IO', 'PostgreSQL', 'Redis', 'React', 'Vite', 'JWT', 'Docker', 'Railway'],
    coreStack: ['Node.js', 'PostgreSQL', 'Redis'],
    repoUrl: 'https://github.com/Yash-Swaminathan/ChatterBox',
    demoUrl: 'https://chat.yashswaminathan.com',
    resourceLabels: { repo: 'Source', demo: 'Live' },
    featured: true,
    status: 'live'
  },
  {
    slug: 'termshare',
    title: 'termshare',
    subtitle: 'Share a live terminal in the browser using Go and WebSockets',
    year: 2026,
    month: 5,
    tags: ['Backend', 'Developer tools'],
    metrics: ['Host-controlled viewer input', 'Scrollback replay'],
    description: 'A Go server connects a Unix shell to browser terminals over WebSockets, with read-only viewers and optional shared typing.',
    overview: 'termshare lets someone watch a terminal from another browser without installing a terminal client. Start a share from VS Code or the Go CLI, then send the viewer link to someone on the same network. The host chooses whether viewers can type.',
    figure: 'termshare-topology',
    technicalPresentation: true,
    setupUrl: 'https://github.com/Yash-Swaminathan/termshare#quick-start',
    extensionUrl: 'https://marketplace.visualstudio.com/items?itemName=YashSwaminathan.termshare',
    sections: [
      {
        heading: 'System Architecture',
        content: 'A single Go process serves the browser interface and connects one shell to its viewers through a Unix pseudo-terminal. Terminal bytes travel over WebSockets; the session checks write permissions before accepting browser input.'
      },
      {
        heading: 'Engineering decisions',
        content: '',
        bullets: [
          'Read-only viewers by default: watching does not grant control of the shell. The host can allow shared typing, with permissions checked on the server.',
          'Bounded queues instead of waiting for every viewer: slow clients are disconnected so they cannot hold up terminal output for everyone else.',
          'Keep sessions in memory: no database to run, but a restart loses the shell and its scrollback. New viewers can replay up to 256 KiB from the current session.',
          'Trusted-network sharing instead of a hosted relay: fewer services and no accounts, but viewers need the same LAN or VPN. There is no built-in HTTPS or tunneling.'
        ]
      },
      {
        heading: 'Permissions and session state',
        content: 'The viewer URL contains the session ID. The host URL also contains a secret key, which grants typing, terminal resizing, and control over viewer write access. Viewers start read-only; the host can enable or disable their input during the session.\n\nThe session keeps up to 256 KiB of recent terminal output for new viewers. Each client has a bounded output queue, and clients that cannot keep up are disconnected rather than blocking the output broadcast.'
      },
      {
        heading: 'Terminal flow and trade-offs',
        figure: 'termshare-flow',
        content: 'The browser connects to `/s/{id}/ws`. Binary frames carry terminal output and authorized keystrokes; text frames carry JSON role updates, viewer counts, permission changes, and resize requests. Only the host can resize the PTY or change viewer permissions.\n\nThe session broadcasts shell output to each client, retaining recent bytes for late joiners. Bounded queues let the server disconnect slow clients rather than block the broadcast. State is in memory, so restarting the process does not preserve the shell or its scrollback.'
      },
      {
        heading: 'Try it locally',
        content: 'Install the [VS Code extension](https://marketplace.visualstudio.com/items?itemName=YashSwaminathan.termshare) and run `termshare: Start Share` from the command palette. It launches the server, copies the viewer link, and opens the host link. Open the viewer link in a second browser window to try it yourself, or share it with someone on the same LAN or VPN.\n\nThe extension bundles the server. It requires Linux, macOS, or Windows with WSL. Keep the host key private. For the CLI, follow the [setup guide](https://github.com/Yash-Swaminathan/termshare#quick-start).'
      }
    ],
    tech: ['Go', 'Gorilla WebSocket', 'Unix PTY', 'xterm.js'],
    coreStack: ['Go', 'WebSockets', 'xterm.js'],
    repoUrl: 'https://github.com/Yash-Swaminathan/termshare',
    featured: true,
    status: 'demo'
  },
  {
    slug: "e-commerce-platform",
    title: "E-Commerce Platform",
    subtitle: "Cloud-native microservices with Kubernetes orchestration",
    year: 2025,
    month: 5,
    tags: ["Microservices", "Cloud", "DevOps"],
    metrics: ["Kubernetes deployment", "AWS integration", "Automated CI/CD"],
    coreStack: ["Spring Boot", "Go", "Kubernetes"],
    description: "Modern e-commerce platform built with microservices architecture (Spring Boot & Go), Kubernetes orchestration, AWS cloud integration, and automated CI/CD pipeline.",
    overview: "This project explores running an e-commerce app across multiple services: Spring Boot for users and orders, and Go for the product catalog and search. It includes local Docker Compose setup and Kubernetes and AWS deployment configuration. It is not currently hosted, to avoid AWS costs.",
    technicalPresentation: true,
    figure: "ecommerce-topology",
    setupUrl: "https://github.com/Yash-Swaminathan/E-Commerce-Platform#setup-instructions",
    sections: [
      {
        "heading": "System Architecture",
        "content": "Docker Compose starts four services and one PostgreSQL database, and each row of the diagram is one service with the table it uses. The Go catalog owns the `products` table and the Go search service reads the same table. The Spring Boot user service registers accounts in `users`, and the order service maps `orders` and `order_items`. The Next.js storefront calls each service on its own URL; there is no gateway in front of them."
      },
      {
        "heading": "Engineering decisions",
        "content": "",
        "bullets": [
          "Separate services instead of one backend: distinct code boundaries, but more processes and network calls to manage.",
          "Spring Boot and Go together: each service can use its own stack, at the cost of maintaining two languages and build systems.",
          "Shared Postgres locally: easier to get everything running, but service boundaries do not provide complete database isolation.",
          "Postgres search instead of a separate search engine: the Go service queries product names and descriptions directly, keeping setup simple but limiting search features.",
          "Local development instead of an always-on AWS demo: avoids ongoing cloud costs, but reviewers need to run the project to try it."
        ]
      },
      {
        "heading": "Service boundaries",
        "content": "The product catalog is a Gin service with create, read, update, and delete routes on `/products`, using parameterized SQL. Search is a second Gin service with one route, `GET /search?q=`, which runs a case-insensitive `LIKE` over product names and descriptions. Because both read the same table, a new product is searchable as soon as it is saved.\n\nThe user service hashes passwords with BCrypt on registration and protects its routes with HTTP Basic. The order service has its data model and the logic to total an order, but no HTTP routes yet, so the storefront's cart and checkout pages are not connected to it.\n\nPayments exist as separate code that Compose does not start: a Spring Boot service that creates and confirms Stripe PaymentIntents, and a Node API using Prisma that handles Stripe webhooks, refunds, disputes, and product image uploads to S3."
      },
      {
        "heading": "Deployment",
        "content": "Locally, Compose waits for the PostgreSQL health check before starting the services. An init script creates the `ecommerce` database with `products` and `users`; Hibernate creates the order tables.\n\nThe Kubernetes manifests run two replicas of each service behind ClusterIP services, with PostgreSQL as a StatefulSet. The user service has an autoscaler that goes from 2 to 10 pods at 70% CPU. Terraform covers the S3 bucket for product images and its IAM role, not the cluster itself.\n\nThe GitHub Actions workflow tests the Spring and Go services, pushes images to ECR, and applies the manifests. It needs AWS credentials, which are not configured, so the cloud path has not been run as a public deployment."
      }
    ],
    tech: [
      "Spring Boot",
      "Go",
      "Gin",
      "Java 17",
      "Kubernetes",
      "Docker",
      "PostgreSQL",
      "AWS S3",
      "Terraform",
      "GitHub Actions",
      "Stripe",
      "Next.js",
      "REST API",
      "Microservices"
    ],
    repoUrl: "https://github.com/Yash-Swaminathan/E-Commerce-Platform",
    featured: true,
    status: 'demo'
  },
  {
    slug: "schema-validator",
    name: "Schema Validator",
    title: "Configuration File Management & Validation System",
    subtitle: "YAML validation service with FastAPI and PostgreSQL",
    year: 2025,
    month: 1,
    tags: ["Full-Stack", "API", "Database"],
    metrics: ["YAML validation", "RESTful API", "Cloud deployed"],
    coreStack: ["FastAPI", "React", "PostgreSQL"],
    description: "FastAPI service that validates YAML configuration files against predefined schemas, stores configurations in PostgreSQL, and provides a REST API interface with React frontend.",
    overview: "Schema Validator checks uploaded YAML against a predefined schema and explains validation errors. It also compares YAML files and provides a React interface for managing configuration records stored in PostgreSQL.",
    technicalPresentation: true,
    figure: "schema-topology",
    setupUrl: "https://github.com/Yash-Swaminathan/Schema-Validator#installation--setup",
    sections: [
      {
        "heading": "System Architecture",
        "content": "A React app calls one FastAPI container, and each row of the diagram is one request path. Validation parses the upload with PyYAML's safe loader and checks it against the JSON Schema in `Schema.py`. Comparison parses two documents and diffs the parsed data with DeepDiff. Neither path touches the database. Only the `/configs` endpoints reach PostgreSQL, after Pydantic has checked the request body."
      },
      {
        "heading": "Engineering decisions",
        "content": "",
        "bullets": [
          "JSON Schema instead of handwritten YAML checks: explicit, reusable validation rules, but the schema still needs to evolve with the data.",
          "Compare parsed data instead of raw text: structural changes stand out without formatting noise. List order is ignored, which is not suitable when ordering has meaning.",
          "Validate on the server as well as in the form: API clients get the same checks, at the cost of maintaining both input feedback and backend validation.",
          "Separate frontend and API deployments: React can run on Vercel while FastAPI runs on Cloud Run, but URLs and cross-origin configuration need to be managed."
        ]
      },
      {
        "heading": "Validation and comparison",
        "content": "The schema requires `name`, a non-negative integer `age`, and `email`. It optionally accepts `is_active`, a list of `hobbies`, and an `address` that must include a street and city. `POST /validate` returns `is_valid` with a message that says whether the failure was a YAML parsing error, a schema violation, or a problem in the schema itself.\n\nComparison accepts two uploaded files or two blocks of pasted YAML. It only requires that both documents parse; it does not check them against the schema. The response says whether they are identical and lists the structural differences, ignoring list order."
      },
      {
        "heading": "Configuration storage",
        "content": "The form checks fields with Yup before sending, and Pydantic repeats the checks on the server: letters-only name and city, non-negative age, valid email. Records are created, then fetched, updated, or deleted by id; there is no list endpoint.\n\nEach request opens its own psycopg2 connection and runs parameterized SQL. The `configs` table is created on startup if it does not exist, and the API still starts when the database is unreachable, so validation and comparison keep working without it."
      }
    ],
    tech: [
      "FastAPI",
      "Python",
      "PostgreSQL",
      "React",
      "JavaScript",
      "Docker",
      "Docker Compose",
      "Poetry",
      "jsonschema",
      "PyYAML",
      "DeepDiff",
      "psycopg2",
      "Formik",
      "Yup",
      "Vercel",
      "Google Cloud Run"
    ],
    demoUrl: "https://schema-validator-lilac.vercel.app/",
    resourceLabels: { repo: 'Source', demo: 'Live' },
    repoUrl: "https://github.com/Yash-Swaminathan/Schema-Validator",
    featured: true,
    status: 'live'
  },
  {
    slug: "calgary-urban-intelligence",
    title: "Calgary Urban Intelligence Dashboard",
    subtitle: "3D real estate and zoning visualization",    
    year: 2025,
    month: 7,
    tags: ["3D", "Open Data", "LLM", "Flask"],
    metrics: ["Live Socrata data", "LLM filters", "Save/load projects"],
    coreStack: ["Three.js", "React", "Python", "Flask"],
    description: "A 3D Calgary dashboard combining building, zoning, and assessment data with natural-language filtering.",
    overview: "This dashboard puts Calgary building data into an interactive 3D view. React and Three.js display the buildings, while Flask gathers open data and translates natural-language queries into filters. Projects can be saved and loaded.",
    technicalPresentation: true,
    figure: "calgary-topology",
    setupUrl: "https://github.com/Yash-Swaminathan/3D-Map-of-Calgary/tree/master/yash-takehome-main/urban-design-dashboard",
    sections: [
      {
        "heading": "System Architecture",
        "content": "A React and three.js client calls one Flask app, and each row of the diagram is one request path. The first map load merges OpenStreetMap footprints with five Calgary open datasets and stores the result; later loads read that table. A typed question goes through a small local Flan-T5 model and pattern rules to become a filter, which is applied to the stored buildings. Saved projects keep the filter set, not the buildings."
      },
      {
        "heading": "Engineering decisions",
        "content": "",
        "bullets": [
          "Fetch one bounded area and cache it instead of loading the whole city: the first load calls six sources and is slow, then later loads read the database. The cache only refreshes on request, so it can go stale.",
          "A small local model plus pattern rules instead of a hosted LLM: no API key or per-query cost, and common filters still work if the model cannot load. Only supported patterns such as height, type, value, and zoning are understood.",
          "OpenStreetMap as the base layer with Calgary data merged on top: footprints are available even when a city dataset fails, but coverage differs between sources, and missing heights, addresses, zoning, or values are filled with estimates.",
          "SQLite by default: saved projects do not require a separate database server locally, but a larger shared deployment would need to revisit that choice."
        ]
      },
      {
        "heading": "Building data",
        "content": "`GET /api/buildings/area` takes a bounding box. If the `buildings` table is empty or a refresh is requested, the fetcher queries OpenStreetMap through Overpass, then merges in Calgary roof outlines, 3D building heights, building permits, property assessments, and land-use districts from the city's Socrata API. Each city dataset is optional: a failed request is logged and skipped.\n\nThe merged records are normalized and stored, and the response includes summary statistics. Where a source has no height, address, zoning, or assessed value for a building, the backend fills in an estimate, so not every figure shown is a city record. The client extrudes each footprint to its height and colours it by assessed value or type."
      },
      {
        "heading": "Natural-language filters",
        "content": "Queries such as 'show commercial buildings' or 'buildings over 100 feet' become structured filters for type, height, value, or zoning. The backend loads `google/flan-t5-small` in the Flask process and asks it which kind of filter the question describes. The actual values, such as a height or a zoning code, are then pulled from the question with pattern matching.\n\nIf the model is unavailable or produces no filter, a rule-based parser handles the question on its own. The resulting filter is applied in Python to the cached buildings, and the matching set is returned to the map."
      },
      {
        "heading": "Saved projects",
        "content": "A project is a name, a description, and the active filters stored as JSON. Loading a project reapplies those filters to the cached buildings with the same code the query path uses. Users are identified by username only; there are no passwords.\n\nSQLAlchemy creates the `buildings`, `projects`, and `users` tables on startup. SQLite is the default, and setting `DATABASE_URL` points the app at another database."
      }
    ],
    tech: ["React", "Three.js", "Python", "Flask", "Socrata API", "OpenStreetMap", "SQLite", "Flan-T5", "WebGL"],
    repoUrl: "https://github.com/Yash-Swaminathan/3D-Map-of-Calgary",
    featured: false,
    status: 'in-progress'
  }
];

export const projects = projectCatalog.sort((first, second) =>
  second.year - first.year || (second.month || 0) - (first.month || 0)
);

export const getFeaturedProjects = (): Project[] => {
  return projects.filter(project => project.featured);
};

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find(project => project.slug === slug);
};

export const getAllProjectSlugs = (): string[] => {
  return projects.map(project => project.slug);
};
