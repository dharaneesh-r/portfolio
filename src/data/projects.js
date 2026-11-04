// Project portfolio with detailed information
export const projectCategories = [
    { id: "all", name: "All Projects" },
    { id: "featured", name: "Featured" },
    { id: "fullstack", name: "Full Stack & AI" },
    { id: "devtools", name: "DevTools & Open Source" }
];

export const projects = [
    {
        id: 1,
        title: "Scrolla.in",
        tagline: "AI Typography Video Ad Platform",
        category: "Full Stack & AI",
        categoryKey: "fullstack",
        featured: true,
        thumbnail: null,
        screenshots: [],
        description: "Event-driven AI video generation platform that choreographs kinetic typography ads synchronized with audio beats. Decouples compute-heavy rendering with NATS JetStream and headless Puppeteer workers.",
        problem: "Video ad creation requires expensive motion designers, complex rendering software, and hours of production turnaround.",
        solution: "Engineered an event-driven platform rendering Remotion React components into MP4s in seconds, orchestrating multiple LLMs with Redis rate limiting and crash-safe queuing.",
        myRole: "Founder & Full Stack Architect",
        techStack: [
            { name: "Next.js 14", icon: "SiNextdotjs" },
            { name: "React", icon: "FaReact" },
            { name: "Node.js", icon: "FaNodeJs" },
            { name: "NATS JetStream", icon: "SiNats" },
            { name: "Puppeteer", icon: "SiPuppeteer" },
            { name: "Redis", icon: "SiRedis" },
            { name: "Docker", icon: "FaDocker" },
            { name: "Prometheus", icon: "SiPrometheus" }
        ],
        features: [
            "Decoupled rendering engine using NATS JetStream sustaining 500+ req/s and 100+ daily renders",
            "Stateless Node.js workers rendering Remotion React components to MP4 via headless Puppeteer",
            "Multi-LLM router across OpenAI, Gemini, and Groq by latency and cost with Redis token-rate limiting",
            "Containerized Next.js 14 stack on Docker/Nginx with Prometheus and Grafana Loki observability",
            "CI/CD deployment automation with GitHub Actions cutting deployment time by 40%"
        ],
        challenges: [
            {
                challenge: "Server bottlenecks from CPU/GPU-intensive video rendering",
                solution: "Decoupled rendering queue with NATS JetStream crash-safe re-queuing and stateless worker pools"
            }
        ],
        results: {
            metrics: [
                { label: "Rendering Throughput", value: "500+ req/s" },
                { label: "Manual Effort Reduction", value: "60%" },
                { label: "Deployment Speed", value: "+40%" }
            ]
        },
        links: {
            github: "https://github.com/dharaneesh-r",
            live: "https://scrolla.in",
            caseStudy: null
        },
        date: "2024 - Present",
        duration: "Ongoing",
        teamSize: 1
    },
    {
        id: 2,
        title: "LifeHacksStore.in",
        tagline: "AI-Powered Conversational E-commerce Platform",
        category: "Full Stack & AI",
        categoryKey: "fullstack",
        featured: true,
        thumbnail: null,
        screenshots: [],
        description: "Full-stack MERN e-commerce platform with Next.js featuring voice and natural language AI discovery, Razorpay payment webhooks, and SEO-friendly SSR.",
        problem: "Traditional catalog searching causes friction and high bounce rates on mobile commerce.",
        solution: "Integrated Generative AI allowing users to converse in natural language and voice to discover products and initiate seamless checkout.",
        myRole: "Full-Stack Engineer",
        techStack: [
            { name: "Next.js", icon: "SiNextdotjs" },
            { name: "React", icon: "FaReact" },
            { name: "Redux", icon: "SiRedux" },
            { name: "Node.js", icon: "FaNodeJs" },
            { name: "Express.js", icon: "SiExpress" },
            { name: "MongoDB", icon: "SiMongodb" },
            { name: "Razorpay", icon: "FaCreditCard" },
            { name: "TailwindCSS", icon: "SiTailwindcss" }
        ],
        features: [
            "Voice and conversational natural-language product discovery powered by Generative AI",
            "AI-driven product retrieval and contextual recommendation workflows",
            "Full Razorpay checkout with webhook order confirmation and inventory synchronization",
            "Server-side rendering (SSR) for fast page loads and rich SEO indexation",
            "Responsive UI with Redux state management deployed on Vercel"
        ],
        challenges: [
            {
                challenge: "Translating ambiguous voice queries into structured database filters",
                solution: "Designed prompt templates with structured JSON extraction schemas validated on the backend"
            }
        ],
        results: {
            metrics: [
                { label: "Architecture", value: "Full Stack MERN" },
                { label: "Checkout", value: "Razorpay" },
                { label: "Discovery", value: "Voice AI" }
            ]
        },
        links: {
            github: "https://github.com/dharaneesh-r",
            live: "https://lifehacksstore.in",
            caseStudy: null
        },
        date: "2024",
        duration: "Completed",
        teamSize: 1
    },
    {
        id: 3,
        title: "TypeScript Env Validator",
        tagline: "Zero-dependency TypeScript environment variable validator",
        category: "DevTools & Open Source",
        categoryKey: "devtools",
        featured: true,
        thumbnail: null,
        screenshots: [],
        description: "Published open-source npm package that provides zero-dependency, type-safe environment variable validation with strict TypeScript inference.",
        problem: "Unvalidated environment variables lead to runtime production crashes without clear debugging stacks.",
        solution: "Built a featherweight, zero-runtime-dependency validator with complete TypeScript type deduction and custom error formatting.",
        myRole: "Author & Maintainer",
        techStack: [
            { name: "TypeScript", icon: "SiTypescript" },
            { name: "Vitest", icon: "SiVitest" },
            { name: "npm", icon: "SiNpm" }
        ],
        features: [
            "Zero runtime dependencies for maximum security and minimum install footprint",
            "Full compile-time type inference for validated variables",
            "100% test coverage across 22 unit tests using Vitest",
            "Published and maintained on the official npm registry"
        ],
        challenges: [],
        results: {
            metrics: [
                { label: "Dependencies", value: "0" },
                { label: "Unit Tests", value: "22 Passed" },
                { label: "Type Safety", value: "100%" }
            ]
        },
        links: {
            github: "https://github.com/dharaneesh-r",
            live: "https://www.npmjs.com/~dharaneesh-r",
            caseStudy: null
        },
        date: "2025",
        duration: "Maintained",
        teamSize: 1
    },
    {
        id: 4,
        title: "GitHub Repo Health Grader CLI",
        tagline: "CLI tool that grades GitHub repositories on a 0–100 scale",
        category: "DevTools & Open Source",
        categoryKey: "devtools",
        featured: true,
        thumbnail: null,
        screenshots: [],
        description: "Command-line developer tool published to npm that inspects GitHub repositories and generates an objective 0–100 health rating across 7 automated checks.",
        problem: "Open source contributors and maintainers lack quick ways to audit repository hygiene and release readiness.",
        solution: "Engineered a rapid CLI assessing licenses, CI/CD configs, test coverage, dependency health, and security postures.",
        myRole: "Author & Maintainer",
        techStack: [
            { name: "Node.js", icon: "FaNodeJs" },
            { name: "TypeScript", icon: "SiTypescript" },
            { name: "GitHub API", icon: "FaGithub" }
        ],
        features: [
            "Audits repos across 7 health dimensions: README, License, CI/CD, Tests, Security, Dependencies, Release hygiene",
            "Generates color-coded terminal reports with actionable remediation tips",
            "Integrates into GitHub Actions CI pipelines for automatic PR gating"
        ],
        challenges: [],
        results: {
            metrics: [
                { label: "Health Checks", value: "7 Dimensions" },
                { label: "Score Range", value: "0 - 100" },
                { label: "Platform", value: "npm CLI" }
            ]
        },
        links: {
            github: "https://github.com/dharaneesh-r",
            live: "https://www.npmjs.com/~dharaneesh-r",
            caseStudy: null
        },
        date: "2025",
        duration: "Maintained",
        teamSize: 1
    },
    {
        id: 5,
        title: "MongoDB Schema Visualizer",
        tagline: "Firefox DevTools Extension for MongoDB BSON schemas",
        category: "DevTools & Open Source",
        categoryKey: "devtools",
        featured: true,
        thumbnail: null,
        screenshots: [],
        description: "Verified Firefox DevTools extension published to addons.mozilla.org that visualizes and parses MongoDB document schemas across 7 BSON field types with zero runtime dependencies.",
        problem: "Inspecting deeply nested BSON structures in browser devtools requires manual JSON formatting and type guessing.",
        solution: "Built a native DevTools panel that directly hooks into network responses and parses BSON structures into an interactive tree diagram.",
        myRole: "Author & Publisher",
        techStack: [
            { name: "JavaScript", icon: "SiJavascript" },
            { name: "WebExtensions API", icon: "SiFirefoxbrowser" },
            { name: "MongoDB", icon: "SiMongodb" }
        ],
        features: [
            "Verified and published on addons.mozilla.org",
            "Zero runtime dependencies for lightning-fast inspection",
            "Visualizes 7 distinct BSON field types with syntax-aware badges",
            "Native Firefox DevTools panel integration"
        ],
        challenges: [],
        results: {
            metrics: [
                { label: "Platform", value: "addons.mozilla.org" },
                { label: "BSON Types", value: "7 Supported" },
                { label: "Dependencies", value: "0" }
            ]
        },
        links: {
            github: "https://github.com/dharaneesh-r",
            live: "https://addons.mozilla.org",
            caseStudy: null
        },
        date: "2024",
        duration: "Published",
        teamSize: 1
    },
    {
        id: 6,
        title: "Newwss",
        tagline: "Real-time news aggregation platform",
        category: "Full Stack & AI",
        categoryKey: "fullstack",
        featured: false,
        thumbnail: null,
        screenshots: [],
        description: "Comprehensive news application using Next.js, Node.js with Express.js, and MongoDB for scalability and performance. Aggregates categorized news with dynamic routing and caching.",
        problem: "Users struggle to find categorized news from multiple sources in one place without information overload.",
        solution: "Centralized real-time update engine with intelligent categorization, responsive UI, and optimized database queries.",
        myRole: "Full-Stack Developer",
        techStack: [
            { name: "Next.js", icon: "SiNextdotjs" },
            { name: "Node.js", icon: "FaNodeJs" },
            { name: "Express.js", icon: "SiExpress" },
            { name: "MongoDB", icon: "SiMongodb" },
            { name: "TailwindCSS", icon: "SiTailwindcss" },
            { name: "Firebase", icon: "SiFirebase" }
        ],
        features: [
            "Real-time news updates with category-based filtering",
            "User authentication and bookmarking system",
            "Smart request queue handling API rate limits",
            "Optimized MongoDB indexing for fast response times"
        ],
        challenges: [],
        results: {
            metrics: [
                { label: "Response Time", value: "<200ms" },
                { label: "Load Time", value: "1.2s" }
            ]
        },
        links: {
            github: "https://github.com/dharaneesh-r",
            live: "https://www.newwss.com/",
            caseStudy: null
        },
        date: "2023",
        duration: "Completed",
        teamSize: 1
    }
];

export default projects;
