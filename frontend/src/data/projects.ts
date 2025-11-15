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
  diagram?: string;
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
    subtitle: "Real-time network anomaly detection backend",
    year: 2024,
    tags: ["ML", "Security", "Backend"],
    metrics: ["FastAPI API layer", "Dockerized deployment", "Hybrid ML + DL models"],
    coreStack: ["Python 3.10", "FastAPI", "Docker"],
    description: "FastAPI backend that ingests network traffic, engineers features with Pandas/NumPy, and runs ML and deep-learning models to flag anomalies in near real time.",
    overview: `NetAnomaly started as a "what if?" question: how do smaller teams catch weird network behavior without the giant labeled datasets and heavy commercial tools that big companies rely on?

I wanted to learn what it really takes to go from raw packets to something an analyst can act on—not just a model in a notebook, but a service that can sit in the loop, score traffic in near real time, and trigger alerts. The project became my way of tying together networking, unsupervised learning, and modern Python infrastructure (FastAPI, Docker, Poetry) into a single, opinionated backend.`,
    diagram: "/System_Diagram.png",
    sections: [
      {
        heading: "Why I Built This",
        content: `Most security tooling is either extremely simple (log filters and threshold-based alerts) or extremely heavy (expensive IDS platforms that assume you have a dedicated SOC and mountains of labeled data).

I wanted to explore a middle ground: something a small team could actually run that still uses modern ML ideas. NetAnomaly was my way of answering a few questions:
• What does it look like to turn messy packet captures into features a model can actually use?
• How far can unsupervised models (Isolation Forests, autoencoders, LSTMs) go without labeled attacks?
• What does an "ML project" look like when you treat API design, deployability, and observability as first-class concerns, not afterthoughts?`
      },
      {
        heading: "System Architecture",
        content: `The system follows the architecture shown in the system diagram below:

• Network traffic is captured at the edge by a packet capture module (Scapy / PyShark)
• Features are extracted and engineered in a Python pipeline using Pandas and NumPy
• An anomaly detection engine hosts both traditional ML models (Isolation Forest, One-Class SVM) and deep-learning models (autoencoders, LSTM)
• A FastAPI backend exposes health, configuration, detection, and test-alert endpoints
• Alerts and logs flow into a logging/notification layer that operators can connect to email, Slack, or webhooks`
      },
      {
        heading: "Data Collection & Preprocessing",
        content: `NetAnomaly is designed to work with live packet capture, but the repo also ships with reproducible examples based on pcap files and synthetic flows.

• Capture raw packets with Scapy / PyShark or load pcap files for offline runs
• Aggregate packets into connection-level flows
• Extract features like IPs, ports, protocol, packet counts, byte volumes, durations, and inter-arrival times
• Normalize and standardize numeric fields with Pandas / NumPy
• Persist feature scalers alongside trained models so the API and training stay in sync`
      },
      {
        heading: "Models & Training",
        content: `The anomaly detection engine combines traditional ML and deep learning.

Traditional ML:
• Isolation Forest / One-Class SVM implemented with scikit-learn (e.g., in an \`anomaly_detection.py\` module)
• A \`train_ml.py\` script generates synthetic flows or ingests preprocessed data
• Trained models and scalers are saved into a \`models/\` directory

Deep learning:
• Autoencoder / LSTM models built in TensorFlow / Keras (e.g., in \`deep_learning.py\`)
• A \`train_dl.py\` script demonstrates training on synthetic "normal" traffic to make reconstruction error usable as an anomaly score`
      },
      {
        heading: "Backend API & Alerting",
        content: `The FastAPI layer turns the models into a usable IDS-style service.

Core endpoints:
• \`/api/v1/health\` — basic health check
• \`/api/v1/config\` — inspect or tweak detection thresholds and model settings
• \`/api/v1/detect\` — batch anomaly scoring for network flows
• \`/api/v1/test-alert\` — fire a synthetic alert end-to-end

Alerting & logging:
• Python logging writes structured records into the \`logs/\` directory
• Alert abstractions make it easy to plug in email, Slack, or webhook notifiers
• Every prediction includes a score so downstream systems can tune thresholds without retraining`
      },
      {
        heading: "What I Learned",
        content: `Building NetAnomaly showed me how much of "ML engineering" is really systems work.

Key takeaways:
• Feature engineering and data plumbing matter more than model choice
• Sharing scalers and schemas between training code and the FastAPI app avoids subtle drift bugs
• Docker + Poetry make it much easier to ship a reproducible environment, especially with TensorFlow
• Even in an ML-heavy project, API design, observability, and test alerts are just as important as model accuracy`
      }
    ],
    longDescription: `NetAnomaly is a FastAPI-based backend for network anomaly detection. It captures or ingests network traffic, engineers flow-level features with Pandas/NumPy, runs both traditional ML models and deep-learning models, and exposes everything behind clean REST endpoints.

The repo ships with training scripts (\`train_ml.py\`, \`train_dl.py\`), example data, and a Docker setup so you can run the entire stack locally with Python 3.10 and TensorFlow. It's meant as an experimentation sandbox rather than a production IDS, but the architecture mirrors how real-world systems are wired together.`,
    tech: [
      "Python 3.10",
      "FastAPI",
      "Uvicorn",
      "Poetry",
      "Docker",
      "Docker Compose",
      "Scapy",
      "PyShark",
      "Pandas",
      "NumPy",
      "TensorFlow",
      "Keras",
      "Scikit-learn",
      "pytest",
      "Network Security"
    ],
    repoUrl: "https://github.com/Yash-Swaminathan/NetAnomaly",
    featured: true,
    status: 'demo'
  },
  {
    slug: "e-commerce-platform",
    title: "E-Commerce Platform",
    subtitle: "Cloud-native microservices with Kubernetes orchestration",
    year: 2024,
    tags: ["Microservices", "Cloud", "DevOps"],
    metrics: ["Kubernetes deployment", "AWS integration", "Automated CI/CD"],
    coreStack: ["Spring Boot", "Go", "Kubernetes"],
    description: "Modern e-commerce platform built with microservices architecture (Spring Boot & Go), Kubernetes orchestration, AWS cloud integration, and automated CI/CD pipeline.",
    overview: `Building scalable e-commerce infrastructure requires more than just CRUD operations. This project explores what it takes to architect a production-grade platform that can handle real-world retail demands—from product catalogs and user authentication to order processing and payment integration.

I wanted to tackle the challenges small-to-medium merchants face: how do you build a system that's reliable, scalable, and cost-effective without enterprise budgets? The answer: cloud-native microservices with modern DevOps practices. The result is a fully containerized platform with Spring Boot and Go services, Kubernetes orchestration, and infrastructure managed entirely as code.`,
    diagram: "/System-Diagram_e-commerce.png",
    sections: [
      {
        heading: "The Challenge",
        content: `E-commerce platforms face unique technical challenges:
• **Service isolation** — One failing service shouldn't bring down the entire platform
• **Real-time inventory** — When a product is added or updated, all services need immediate access
• **Distributed transactions** — Orders, payments, and inventory must stay synchronized
• **Scalability** — Different services have different load patterns

The core problem: how do you build a distributed system that's both reliable and maintainable without a massive DevOps team?`
      },
      {
        heading: "System Architecture",
        content: `The platform follows a microservices architecture as shown in the system diagram below:

**Spring Boot Services (Java 17)**
• User Service — Authentication and user management
• Order Service — Order processing and fulfillment

**Go Services (Go 1.19)**
• Product Catalog — Product information and inventory
• Search Service — Full-text product search

**Infrastructure**
• PostgreSQL for data persistence
• AWS S3 for product images
• Kubernetes for orchestration
• Docker for containerization

When a new product is added, it's persisted in PostgreSQL and immediately propagated across all services in real time.`
      },
      {
        heading: "Deployment & Infrastructure",
        content: `**Kubernetes Orchestration:**
• Separate deployments for each microservice
• Horizontal pod autoscaling
• Rolling updates with zero downtime
• Health checks and monitoring

**AWS Cloud Integration:**
• S3 for image storage with CloudFront CDN
• EKS for managed Kubernetes cluster
• Terraform for Infrastructure as Code

**CI/CD Pipeline:**
GitHub Actions automates testing, building Docker images, and deploying to Kubernetes. The pipeline has been tested locally (GitHub Actions shows failures due to missing AWS credentials to avoid costs).`
      },
      {
        heading: "What I Learned",
        content: `**Microservices Architecture:**
• Service boundaries matter—each service should own its domain completely
• Health checks and graceful shutdown are non-negotiable
• Service discovery with Kubernetes is simpler than custom solutions

**Kubernetes in Practice:**
• Readiness probes prevent traffic to unhealthy pods
• ConfigMaps and Secrets keep configuration separate from code

**DevOps & Infrastructure:**
• Infrastructure as Code (Terraform) makes environments reproducible
• Docker multi-stage builds significantly reduce image sizes
• CI/CD pipelines catch integration issues early

**Language Choice:**
• Spring Boot excels for complex business logic with database interactions
• Go is perfect for high-throughput, stateless services like search`
      }
    ],
    longDescription: `Cloud-native e-commerce platform built with microservices architecture. Features Spring Boot services (User, Order) and Go services (Product Catalog, Search) orchestrated with Kubernetes.

Includes AWS integration (S3 for images, EKS for production), automated CI/CD with GitHub Actions, Infrastructure as Code with Terraform, and comprehensive monitoring with Prometheus and Grafana. Designed for small-to-medium merchants needing a scalable, production-grade solution. All infrastructure is containerized with Docker and deployable to both local Minikube and AWS EKS.`,
    tech: [
      "Spring Boot",
      "Go",
      "Java 17",
      "Kubernetes",
      "Docker",
      "PostgreSQL",
      "AWS S3",
      "AWS EKS",
      "Terraform",
      "GitHub Actions",
      "Prometheus",
      "Grafana",
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
    title: "Configuration File Management & Validation System",
    subtitle: "YAML validation service with FastAPI and PostgreSQL",
    year: 2024,
    tags: ["Full-Stack", "API", "Database"],
    metrics: ["YAML validation", "RESTful API", "Cloud deployed"],
    coreStack: ["FastAPI", "React", "PostgreSQL"],
    description: "FastAPI service that validates YAML configuration files against predefined schemas, stores configurations in PostgreSQL, and provides a REST API interface with React frontend.",
    overview: `Building reliable configuration management systems requires robust validation. This project tackles the challenge of ensuring YAML configuration files adhere to predefined schemas while providing an intuitive interface for managing configurations.

I wanted to create a production-ready validation service that could handle real-world scenarios—from file uploads and schema validation to database persistence and cloud deployment. The result is a containerized FastAPI backend with a React frontend, deployed on Vercel and Google Cloud Run.`,
    diagram: "/System_Diagram_schema_validator.png",
    sections: [
      {
        heading: "The Challenge",
        content: `Configuration management is a common pain point in software engineering. Teams struggle with:
• Validating complex YAML structures against evolving schemas
• Maintaining configuration history and versioning
• Providing user-friendly interfaces for non-technical stakeholders
• Ensuring consistency across development, staging, and production environments

The core problem: how do you build a system that validates configurations reliably while remaining flexible enough to adapt to changing requirements?`
      },
      {
        heading: "System Architecture",
        content: `The system follows a modern three-tier architecture as shown in the system diagram below:

**Frontend (React.js)**
• File upload interface with drag-and-drop support
• Form validation using Formik and Yup
• Real-time validation feedback
• CRUD operations for managing configurations
• Deployed on Vercel for global CDN distribution

**Backend (FastAPI)**
• RESTful API endpoints for validation and database operations
• YAML parsing with PyYAML
• Schema validation using jsonschema
• Poetry for dependency management
• Dockerized for consistent deployment
• Hosted on Google Cloud Run for auto-scaling

**Database (PostgreSQL)**
• Stores validated configurations and metadata
• Configuration versioning and history tracking
• Efficient querying with indexed fields
• Containerized with docker-compose for local development`
      },
      {
        heading: "Backend API & Validation",
        content: `The FastAPI backend provides several core endpoints:

**Validation Endpoints:**
• \`POST /api/validate\` — Validate YAML against predefined schemas
• \`GET /api/schemas\` — Retrieve available validation schemas
• \`POST /api/schemas\` — Register new validation schemas

**Configuration Management:**
• \`POST /api/configs\` — Store validated configurations
• \`GET /api/configs\` — List all configurations
• \`GET /api/configs/{id}\` — Retrieve specific configuration
• \`PUT /api/configs/{id}\` — Update existing configuration
• \`DELETE /api/configs/{id}\` — Delete configuration

**Validation Flow:**
1. User uploads YAML file through React frontend
2. Backend parses YAML with PyYAML
3. Schema validation via jsonschema library
4. Detailed error reporting with line numbers and field paths
5. On success, configuration stored in PostgreSQL with metadata`
      },
      {
        heading: "Frontend Implementation",
        content: `The React frontend provides an intuitive user experience:

**Key Features:**
• File upload with drag-and-drop using react-dropzone
• Form management with Formik for complex validation flows
• Client-side validation with Yup schemas
• Real-time validation feedback with error highlighting
• Configuration history viewer
• Dark mode support for better UX

**Form Validation:**
The frontend validates user input before submission:
• Required fields checking
• Format validation (email, URLs, etc.)
• Custom validation rules matching backend schemas
• Progressive disclosure of validation errors

This dual-layer validation (client + server) ensures better UX while maintaining security.`
      },
      {
        heading: "Deployment & DevOps",
        content: `**Containerization:**
The project uses Docker and docker-compose for local development:
• PostgreSQL container with persistent volumes
• FastAPI application container
• Automated dependency installation with Poetry
• Health checks for service readiness

**Cloud Deployment:**
• Frontend: Vercel (automatic deployments from Git)
• Backend: Google Cloud Run (containerized FastAPI)
• Database: Google Cloud SQL (managed PostgreSQL)

**CI/CD Pipeline:**
• Automated testing on pull requests
• Linting with ESLint (frontend) and flake8 (backend)
• Docker image building and pushing
• Zero-downtime deployments

**Monitoring:**
• Application logging with structured JSON
• Error tracking and alerting
• API performance metrics
• Database query optimization`
      },
      {
        heading: "What I Learned",
        content: `This project taught me valuable lessons about full-stack development:

**Schema Design:**
• jsonschema is powerful but has a steep learning curve
• Clear error messages are crucial for user adoption
• Schema versioning needs to be planned from day one

**API Design:**
• RESTful conventions matter for API discoverability
• Proper HTTP status codes improve client error handling
• API documentation (with FastAPI's auto-generated docs) is essential

**Deployment:**
• Docker makes development environments reproducible
• Cloud Run's auto-scaling handles traffic spikes gracefully
• Database connection pooling is critical for performance

**Frontend-Backend Integration:**
• TypeScript interfaces should mirror backend models
• Optimistic UI updates improve perceived performance
• Proper error handling on both layers prevents user confusion`
      },
      {
        heading: "Try It Out",
        content: `The live demo is available at https://schema-validator-lilac.vercel.app/

**To run locally:**
\`\`\`bash
# Clone the repository
git clone https://github.com/Yash-Swaminathan/Schema-Validator.git

# Install backend dependencies
poetry install
# or
pip install -r requirements.txt

# Start services with Docker
docker-compose up --build

# In another terminal, start the frontend
cd frontend
npm install
npm start
\`\`\`

**Test credentials and sample configurations are included in the repository.**`
      }
    ],
    longDescription: `Full-stack configuration validation system built with FastAPI and React. Validates YAML files against predefined schemas using jsonschema, stores configurations in PostgreSQL, and provides a comprehensive REST API.

The frontend features file upload with Formik/Yup validation, while the backend handles schema validation and database operations. Containerized with Docker for local development and deployed to Vercel (frontend) and Google Cloud Run (backend). Includes automated testing, CI/CD pipeline, and comprehensive API documentation.`,
    tech: [
      "FastAPI",
      "Python",
      "PostgreSQL",
      "React",
      "TypeScript",
      "Docker",
      "Docker Compose",
      "Poetry",
      "jsonschema",
      "PyYAML",
      "Formik",
      "Yup",
      "Vercel",
      "Google Cloud Run",
      "pg (PostgreSQL client)"
    ],
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
