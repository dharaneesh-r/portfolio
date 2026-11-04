// Skills organized by category with proficiency levels
export const skillCategories = {
    languages: {
        title: "Programming Languages",
        description: "Core languages for systems, backend, frontend, and algorithms",
        color: "#f7df1e",
        skills: [
            {
                name: "JavaScript",
                level: 95,
                yearsExp: 2,
                icon: "https://cdn.worldvectorlogo.com/logos/javascript-1.svg",
                projects: 15,
                description: "ES6+, asynchronous concurrency, event loop, and web architecture"
            },
            {
                name: "TypeScript",
                level: 90,
                yearsExp: 1.5,
                icon: "https://cdn.worldvectorlogo.com/logos/typescript.svg",
                projects: 8,
                description: "Strict typing, generics, utility types, and open-source packages"
            },
            {
                name: "Java",
                level: 85,
                yearsExp: 1.5,
                icon: "https://cdn.worldvectorlogo.com/logos/java-4.svg",
                projects: 6,
                description: "Data Structures & Algorithms, OOP, 1500+ LeetCode rating"
            },
            {
                name: "Go",
                level: 80,
                yearsExp: 1,
                icon: "https://cdn.worldvectorlogo.com/logos/golang-1.svg",
                projects: 3,
                description: "Goroutines, channels, sub-100ms OSRM routing, WebSocket pipelines"
            },
            {
                name: "SQL",
                level: 85,
                yearsExp: 1.5,
                icon: "https://cdn.worldvectorlogo.com/logos/mysql-6.svg",
                projects: 5,
                description: "Relational queries, indexing, transactions, and schema normalization"
            }
        ]
    },

    frontend: {
        title: "Frontend Development",
        description: "Building responsive, animated, and high-performance user interfaces",
        color: "#61dafb",
        skills: [
            {
                name: "React.js",
                level: 95,
                yearsExp: 2,
                icon: "https://cdn.worldvectorlogo.com/logos/react-2.svg",
                projects: 15,
                description: "Building production consoles, SPAs, custom hooks, and state systems"
            },
            {
                name: "Next.js",
                level: 90,
                yearsExp: 1.5,
                icon: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg",
                projects: 6,
                description: "App router, SSR, SSG, server actions, and SEO optimization"
            },
            {
                name: "Redux",
                level: 88,
                yearsExp: 1.5,
                icon: "https://cdn.worldvectorlogo.com/logos/redux.svg",
                projects: 5,
                description: "Redux Toolkit, slice management, and global client state"
            },
            {
                name: "TailwindCSS",
                level: 95,
                yearsExp: 2,
                icon: "https://cdn.worldvectorlogo.com/logos/tailwind-css-2.svg",
                projects: 12,
                description: "Responsive layouts, custom utilities, dark mode, and animations"
            },
            {
                name: "GSAP",
                level: 85,
                yearsExp: 1,
                icon: "https://cdn.worldvectorlogo.com/logos/gsap-greensock.svg",
                projects: 6,
                description: "ScrollTrigger, timeline orchestration, and creative web interactions"
            }
        ]
    },

    backend: {
        title: "Backend & Systems",
        description: "Creating resilient, event-driven microservices and APIs",
        color: "#68a063",
        skills: [
            {
                name: "Node.js",
                level: 92,
                yearsExp: 2,
                icon: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg",
                projects: 12,
                description: "High-throughput APIs serving 500K+ requests, background workers"
            },
            {
                name: "NestJS",
                level: 80,
                yearsExp: 1,
                icon: "https://cdn.worldvectorlogo.com/logos/nestjs.svg",
                projects: 3,
                description: "Modular enterprise architecture, dependency injection, and decorators"
            },
            {
                name: "Express.js",
                level: 90,
                yearsExp: 2,
                icon: "https://cdn.worldvectorlogo.com/logos/express-109.svg",
                projects: 12,
                description: "RESTful architecture, custom middleware, RBAC authorization"
            },
            {
                name: "WebSockets",
                level: 85,
                yearsExp: 1,
                icon: "https://cdn.worldvectorlogo.com/logos/websocket.svg",
                projects: 3,
                description: "Real-time bi-directional streaming, live rider GPS telemetry"
            },
            {
                name: "NATS JetStream",
                level: 80,
                yearsExp: 1,
                icon: "https://cdn.worldvectorlogo.com/logos/nats-1.svg",
                projects: 2,
                description: "Exactly-once messaging, crash-safe re-queuing, 500+ req/s sustained"
            }
        ]
    },

    databases: {
        title: "Databases & Storage",
        description: "Relational, NoSQL, memory caching, and high-throughput data stores",
        color: "#4db33d",
        skills: [
            {
                name: "MongoDB",
                level: 90,
                yearsExp: 2,
                icon: "https://cdn.worldvectorlogo.com/logos/mongodb-icon-1.svg",
                projects: 10,
                description: "Aggregation pipelines, index tuning, and schema modeling"
            },
            {
                name: "PostgreSQL",
                level: 82,
                yearsExp: 1.5,
                icon: "https://cdn.worldvectorlogo.com/logos/postgresql.svg",
                projects: 4,
                description: "Relational modeling, complex joins, and transactional consistency"
            },
            {
                name: "DynamoDB",
                level: 88,
                yearsExp: 1,
                icon: "https://cdn.worldvectorlogo.com/logos/aws-dynamodb.svg",
                projects: 3,
                description: "1M+ batch records, partition/sort keys, high-write workloads"
            },
            {
                name: "Redis",
                level: 85,
                yearsExp: 1.5,
                icon: "https://cdn.worldvectorlogo.com/logos/redis.svg",
                projects: 5,
                description: "In-memory caching, rate-limiting token buckets, pub/sub"
            }
        ]
    },

    devops: {
        title: "Cloud & DevOps",
        description: "Containerization, auto-scaling cloud infrastructure, and CI/CD",
        color: "#ff9900",
        skills: [
            {
                name: "AWS",
                level: 85,
                yearsExp: 1.5,
                icon: "https://cdn.worldvectorlogo.com/logos/aws-2.svg",
                projects: 6,
                description: "ECS auto-scaling, EC2, S3, CloudWatch, and IAM roles"
            },
            {
                name: "Docker",
                level: 88,
                yearsExp: 1.5,
                icon: "https://cdn.worldvectorlogo.com/logos/docker.svg",
                projects: 8,
                description: "Multi-stage builds, containerized microservices, Docker Compose"
            },
            {
                name: "Kubernetes",
                level: 75,
                yearsExp: 1,
                icon: "https://upload.wikimedia.org/wikipedia/commons/3/39/Kubernetes_logo_without_workmark.svg",
                projects: 3,
                description: "Pods, deployments, services, and cluster orchestration"
            },
            {
                name: "CI/CD & Actions",
                level: 88,
                yearsExp: 1.5,
                icon: "https://cdn.worldvectorlogo.com/logos/github-actions.svg",
                projects: 7,
                description: "GitHub Actions, Jenkins, CircleCI automated test and deployment pipelines"
            }
        ]
    },

    tools: {
        title: "Testing & Tools",
        description: "Unit testing, version control, and observability stacks",
        color: "#f34f29",
        skills: [
            {
                name: "Vitest",
                level: 85,
                yearsExp: 1,
                icon: "https://cdn.worldvectorlogo.com/logos/vitest.svg",
                projects: 4,
                description: "Fast unit testing, test suites covering 22+ unit tests on npm packages"
            },
            {
                name: "Git",
                level: 95,
                yearsExp: 2,
                icon: "https://cdn.worldvectorlogo.com/logos/git-icon.svg",
                projects: 20,
                description: "Branching strategies, rebase workflows, and collaborative PRs"
            },
            {
                name: "Observability",
                level: 82,
                yearsExp: 1,
                icon: "https://cdn.worldvectorlogo.com/logos/prometheus.svg",
                projects: 3,
                description: "Prometheus, Grafana Loki, CloudWatch, Elasticsearch, and Kibana"
            }
        ]
    }
};

// Flatten all skills for easy access
export const allSkills = Object.values(skillCategories).flatMap(category =>
    category.skills.map(skill => ({
        ...skill,
        category: category.title
    }))
);

export default skillCategories;
