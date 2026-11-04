// Personal Information and Social Links
export const personalInfo = {
    name: "DHARANEESH",
    fullName: "Dharaneesh R",
    role: "Full Stack Developer",
    tagline: "Full-stack developer with 1.6 years of production experience across React, Next.js, Node.js, and AWS",
    email: "dharaneeshr0803@gmail.com",
    phone: "+91 9566865145",
    location: "Coimbatore, Tamil Nadu, India",
    availability: "Open to SDE-1 / SDE-2 Roles",

    bio: {
        short: "Full-stack developer with 1.6 years of production experience across React, Next.js, Node.js, and AWS. Specializing in high-throughput SaaS platforms, real-time tracking consoles, and cloud infrastructure.",
        long: [
            "Architected and deployed scalable backend services at Tenext Technologies for US SaaS client Friendbuy, serving 500K+ daily API requests at 99.9% uptime on AWS ECS with 30% reduced response times.",
            "Engineered high-volume CSV bulk rewards pipeline validating and processing 1M+ records per run with asynchronous background jobs and batched DynamoDB writes, lifting throughput by 40%.",
            "Built a real-time React dispatch console for Nearle hyperlocal delivery streaming rider GPS over WebSockets through a Go backend, using goroutines and Kalman filtering to resolve 5–15m signal noise into stable tracks.",
            "Self-hosted OSRM on OpenStreetMap data behind Go microservices to calculate fastest routes in under 100ms at zero per-request cost, replacing Google Directions API with 2–5x lower latency.",
            "Founder of Scrolla.in (AI Typography Video Ad Platform) using NATS JetStream, Remotion React workers via headless Puppeteer, and intelligent prompt routing across OpenAI, Gemini, and Groq.",
            "Published 2 open-source npm packages, a verified Firefox DevTools extension on addons.mozilla.org, and hold a 1500+ LeetCode rating."
        ]
    },

    highlights: [
        "1.6 years of production development experience",
        "Software Developer at Tenext Technologies (Clients: Friendbuy, Nearle)",
        "500K+ daily API requests served at 99.9% uptime",
        "1M+ CSV bulk processing with batched DynamoDB & AWS ECS",
        "Founder of Scrolla.in (AI Typography Video Platform)",
        "Shipped 2 npm packages & verified Firefox DevTools extension",
        "1500+ LeetCode rating (Java Data Structures & Algorithms)"
    ],

    interests: ["Full Stack Development", "Cloud Architecture (AWS)", "Distributed Systems", "Real-Time Systems (WebSockets & Go)", "Developer Tooling", "System Design"],
    currentFocus: "Targeting SDE-1 and SDE-2 roles in developer tools, SaaS, or data infrastructure",

    socialLinks: [
        {
            platform: "GitHub",
            url: "https://github.com/dharaneesh-r",
            username: "dharaneesh-r",
            icon: "FaGithub"
        },
        {
            platform: "LinkedIn",
            url: "https://linkedin.com/in/dharaneeshr",
            username: "dharaneeshr",
            icon: "FaLinkedin"
        },
        {
            platform: "LeetCode",
            url: "https://leetcode.com/u/dharaneesh-r",
            username: "LeetCode 1500+",
            icon: "SiLeetcode"
        },
        {
            platform: "Email",
            url: "mailto:dharaneeshr0803@gmail.com",
            username: "dharaneeshr0803@gmail.com",
            icon: "FaEnvelope"
        },
        {
            platform: "Phone",
            url: "tel:+919566865145",
            username: "+91 9566865145",
            icon: "FaPhone"
        }
    ],

    resume: {
        url: "/Dharaneesh.pdf",
        filename: "Dharaneesh.pdf"
    }
};

export default personalInfo;
