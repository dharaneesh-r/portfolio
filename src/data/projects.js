// Enhanced project portfolio with detailed information
export const projects = [
    {
        id: 1,
        title: "Newwss",
        tagline: "Real-time news aggregation platform",
        category: "Full Stack",
        featured: true,
        thumbnail: null, // Add your project thumbnail
        screenshots: [],
        description: "Developed Newwss, a comprehensive news application using Next.js, Node.js with Express.js, and MongoDB for scalability and performance. The platform provides real-time categorized news from multiple sources with dynamic routing and seamless API integration.",

        problem: "Users struggle to find categorized news from multiple sources in one place, leading to information overload and time wastage browsing different news websites.",
        solution: "Built a centralized platform with real-time updates, intelligent categorization, and a user-friendly interface that aggregates news from multiple sources and presents them in an organized manner.",
        myRole: "Full-stack development, API integration, database design, and deployment",

        techStack: [
            { name: "Next.js", icon: "SiNextdotjs" },
            { name: "Node.js", icon: "FaNodeJs" },
            { name: "Express.js", icon: "SiExpress" },
            { name: "MongoDB", icon: "SiMongodb" },
            { name: "TailwindCSS", icon: "SiTailwindcss" },
            { name: "Firebase", icon: "SiFirebase" }
        ],

        features: [
            "Real-time news updates from multiple sources",
            "Category-based filtering and navigation",
            "User authentication with Firebase",
            "Bookmark and save articles",
            "Responsive design for all devices",
            "Fast search functionality"
        ],

        challenges: [
            {
                challenge: "Handling real-time data updates efficiently without overwhelming the server",
                solution: "Implemented caching strategies and optimized MongoDB queries to reduce database load"
            },
            {
                challenge: "Managing API rate limits from multiple news sources",
                solution: "Created a smart request queue system with fallback mechanisms"
            }
        ],

        results: {
            users: "500+",
            performance: "40% faster load times",
            rating: "4.5/5",
            metrics: [
                { label: "Daily Active Users", value: "200+" },
                { label: "Page Load Time", value: "1.2s" },
                { label: "API Response Time", value: "<200ms" }
            ]
        },

        links: {
            github: null,
            live: "https://www.newwss.com/",
            caseStudy: null
        },

        date: "2023-06",
        duration: "3 months",
        teamSize: 1
    },

    {
        id: 2,
        title: "AuditPro",
        tagline: "Professional auditing and compliance platform",
        category: "Full Stack",
        featured: true,
        thumbnail: null,
        screenshots: [],
        description: "AuditPro is a comprehensive web-based auditing and compliance platform built on the MERN stack, offering seamless management of GST, tax, and regulatory services with a scalable architecture and responsive React UI.",

        problem: "Auditing firms struggle with managing multiple clients, tracking compliance deadlines, and organizing tax documents efficiently.",
        solution: "Developed a centralized platform with client management, automated compliance tracking, document organization, and real-time dashboards for both auditors and clients.",
        myRole: "Full-stack development, UI/UX design, database architecture, and deployment",

        techStack: [
            { name: "React", icon: "FaReact" },
            { name: "Node.js", icon: "FaNodeJs" },
            { name: "MongoDB", icon: "SiMongodb" },
            { name: "TailwindCSS", icon: "SiTailwindcss" },
            { name: "Firebase", icon: "SiFirebase" }
        ],

        features: [
            "Client management system",
            "Compliance deadline tracking",
            "Document upload and organization",
            "Real-time dashboards",
            "Automated notifications",
            "Role-based access control"
        ],

        challenges: [
            {
                challenge: "Implementing secure document storage and access control",
                solution: "Integrated Firebase Storage with custom security rules and encryption"
            }
        ],

        results: {
            users: "50+ firms",
            performance: "Reduced compliance tracking time by 60%",
            rating: "4.7/5",
            metrics: [
                { label: "Active Firms", value: "50+" },
                { label: "Documents Managed", value: "10,000+" }
            ]
        },

        links: {
            github: null,
            live: "https://auditpro-mauve.vercel.app/",
            caseStudy: null
        },

        date: "2023-09",
        duration: "4 months",
        teamSize: 1
    },

    {
        id: 3,
        title: "Crypto Marketplace",
        tagline: "Real-time cryptocurrency tracking platform",
        category: "Frontend",
        featured: false,
        thumbnail: null,
        screenshots: [],
        description: "Built a modern Crypto Marketplace using React.js and Tailwind CSS, ensuring a responsive user experience with real-time cryptocurrency tracking, intuitive navigation, and a visually appealing interface.",

        problem: "Crypto enthusiasts need a simple, fast platform to track cryptocurrency prices and market trends in real-time.",
        solution: "Created a lightweight, responsive platform with real-time price updates, market charts, and an intuitive interface for tracking multiple cryptocurrencies.",
        myRole: "Frontend development, UI/UX design, API integration",

        techStack: [
            { name: "React", icon: "FaReact" },
            { name: "TailwindCSS", icon: "SiTailwindcss" },
            { name: "CoinGecko API", icon: "FaCoins" }
        ],

        features: [
            "Real-time cryptocurrency prices",
            "Market charts and trends",
            "Search and filter functionality",
            "Responsive design",
            "Favorite coins tracking"
        ],

        challenges: [],

        results: {
            users: "1000+",
            performance: "Sub-second load times",
            metrics: []
        },

        links: {
            github: null,
            live: "https://crypto-marketplace-ten.vercel.app/",
            caseStudy: null
        },

        date: "2023-03",
        duration: "2 months",
        teamSize: 1
    },

    {
        id: 4,
        title: "Movie Booking Application",
        tagline: "Seamless cinema ticket booking experience",
        category: "Frontend",
        featured: false,
        thumbnail: null,
        screenshots: [],
        description: "A fully responsive, front-end web app designed to simulate a seamless cinema ticket booking experience. Built entirely with React, styled using Tailwind CSS, and powered by JSON data.",

        problem: "Users need an intuitive interface to browse movies, select seats, and book tickets without backend complexity.",
        solution: "Created a fully functional frontend application with seat selection, booking flow, and payment simulation using React state management.",
        myRole: "Frontend development, UI/UX design, state management",

        techStack: [
            { name: "React", icon: "FaReact" },
            { name: "TailwindCSS", icon: "SiTailwindcss" }
        ],

        features: [
            "Movie browsing and details",
            "Interactive seat selection",
            "Booking flow simulation",
            "Responsive design",
            "Local state persistence"
        ],

        challenges: [],

        results: {
            users: "500+",
            metrics: []
        },

        links: {
            github: null,
            live: "https://movie-booking-application-eight.vercel.app/",
            caseStudy: null
        },

        date: "2023-01",
        duration: "1.5 months",
        teamSize: 1
    },

    {
        id: 5,
        title: "TODO Application",
        tagline: "Simple and interactive task management",
        category: "Frontend",
        featured: false,
        thumbnail: null,
        screenshots: [],
        description: "Developed a TO-DO app using React.js and Tailwind CSS to create a simple, interactive task management tool with local storage persistence.",

        problem: "Users need a quick, simple way to manage daily tasks without complex features.",
        solution: "Built a minimalist task manager with essential features like add, edit, delete, and mark complete, with data persistence.",
        myRole: "Frontend development, UI/UX design",

        techStack: [
            { name: "React", icon: "FaReact" },
            { name: "TailwindCSS", icon: "SiTailwindcss" }
        ],

        features: [
            "Add, edit, delete tasks",
            "Mark tasks as complete",
            "Local storage persistence",
            "Filter by status",
            "Clean, minimal UI"
        ],

        challenges: [],

        results: {
            users: "300+",
            metrics: []
        },

        links: {
            github: null,
            live: "https://to-do-application-six-eta.vercel.app/",
            caseStudy: null
        },

        date: "2022-11",
        duration: "2 weeks",
        teamSize: 1
    },

    {
        id: 6,
        title: "Designed UI Page",
        tagline: "Animated landing page showcase",
        category: "Frontend",
        featured: false,
        thumbnail: null,
        screenshots: [],
        description: "This design page, built using React.js, GSAP, and TailwindCSS, features smooth animations like fade-ins and scaling effects, showcasing a responsive layout with animated cards and styled buttons.",

        problem: "Demonstrating advanced animation capabilities and modern design patterns.",
        solution: "Created an interactive landing page with GSAP animations, showcasing smooth transitions and modern UI patterns.",
        myRole: "Frontend development, animation implementation, UI design",

        techStack: [
            { name: "React", icon: "FaReact" },
            { name: "GSAP", icon: "SiGreensock" },
            { name: "TailwindCSS", icon: "SiTailwindcss" }
        ],

        features: [
            "GSAP animations",
            "Responsive design",
            "Modern UI patterns",
            "Interactive elements"
        ],

        challenges: [],

        results: {
            metrics: []
        },

        links: {
            github: null,
            live: "https://vite-aboutus-landingpage.vercel.app/",
            caseStudy: null
        },

        date: "2023-02",
        duration: "1 month",
        teamSize: 1
    }
];

// Get featured projects
export const featuredProjects = projects.filter(p => p.featured);

// Get projects by category
export const getProjectsByCategory = (category) => {
    return projects.filter(p => p.category === category);
};

// Get project categories
export const projectCategories = [...new Set(projects.map(p => p.category))];

export default projects;
