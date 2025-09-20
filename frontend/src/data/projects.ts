export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  year: number;
  tags: string[];
  metrics: string[];
  cover: string;
  description: string;
  longDescription?: string;
  tech: string[];
  demoUrl?: string;
  repoUrl?: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    slug: "portfolio-database-system",
    title: "Portfolio Database System",
    subtitle: "Full-stack tracking & analytics",
    year: 2025,
    tags: ["Full-Stack", "Database", "Analytics"],
    metrics: ["PostgreSQL + Docker", "Real-time tracking", "99.9% uptime"],
    cover: "/images/projects/portfolio-db.png",
    description: "Built a comprehensive portfolio management system with PostgreSQL, Docker, and real-time button click tracking.",
    longDescription: `A sophisticated portfolio management system featuring a PostgreSQL database with Docker orchestration, real-time button click tracking, and comprehensive analytics. The system includes pgAdmin for database management, automated health checks, and persistent data storage.

Key features include automatic timestamps, performance optimizations with indexes, JSONB support for flexible data storage, and helper functions for safe data manipulation.`,
    tech: ["PostgreSQL", "Docker", "Node.js", "React", "TypeScript", "pgAdmin"],
    demoUrl: "http://localhost:3000",
    repoUrl: "https://github.com/yash/portfolio",
    featured: true
  },
  {
    slug: "interactive-web-applications",
    title: "Interactive Web Apps",
    subtitle: "Modern responsive interfaces",
    year: 2024,
    tags: ["Frontend", "React", "UX"],
    metrics: ["Mobile-first design", "Component library", "Theme system"],
    cover: "/images/projects/web-apps.png",
    description: "Developed dynamic, responsive web applications with modern frameworks and smooth user experiences.",
    longDescription: `A collection of interactive web applications built with modern frameworks featuring responsive design, smooth animations, and intuitive user interfaces. These applications showcase advanced React patterns, state management, and performance optimization techniques.

Includes theme switching, interactive maps with Leaflet, real-time data visualization, and mobile-first responsive design principles.`,
    tech: ["React", "JavaScript", "HTML5", "CSS3", "Leaflet", "Framer Motion"],
    demoUrl: "http://localhost:3000",
    featured: true
  },
  {
    slug: "full-stack-development",
    title: "Full-Stack Solutions",
    subtitle: "End-to-end development",
    year: 2024,
    tags: ["Backend", "API", "Database"],
    metrics: ["RESTful APIs", "Authentication", "Scalable architecture"],
    cover: "/images/projects/fullstack.png",
    description: "Created end-to-end solutions connecting frontend interfaces with robust backend systems and databases.",
    longDescription: `Comprehensive full-stack development projects featuring robust backend architectures, RESTful API design, and seamless frontend-backend integration. Built with Express.js, featuring JWT authentication, database design, and scalable system architecture.

Includes rate limiting, security middleware with Helmet, CORS configuration, and comprehensive error handling for production-ready applications.`,
    tech: ["Express.js", "REST APIs", "Database Design", "Authentication", "JWT", "Node.js"],
    repoUrl: "https://github.com/yash/fullstack-apps",
    featured: true
  },
  {
    slug: "city-mapping-system",
    title: "City Mapping System",
    subtitle: "Interactive location services",
    year: 2024,
    tags: ["Maps", "Geolocation", "Interactive"],
    metrics: ["Drag & drop maps", "Location detection", "Theme support"],
    cover: "/images/projects/city-maps.png",
    description: "Interactive mapping system with geolocation detection, draggable mini-maps, and theme support.",
    longDescription: `An advanced mapping system built with Leaflet featuring interactive city location display with drag-and-drop functionality, automatic geolocation detection, and comprehensive theme support.

The system includes context-based state management, responsive design, and seamless integration with the portfolio's theme system for consistent user experience.`,
    tech: ["Leaflet", "React", "TypeScript", "Geolocation API", "Context API"],
    demoUrl: "http://localhost:3000",
    featured: false
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