// Work Experience and Professional History
export const experiences = [
  {
    id: 1,
    company: "Tenext Technologies",
    role: "Software Developer",
    type: "Full-time",
    location: "Coimbatore, India",
    client: "Friendbuy (USA) & Nearle",
    startDate: "2025-07",
    endDate: null,
    current: true,
    duration: "Jul 2025 - Present",
    description: "Architecting and maintaining high-throughput SaaS platforms and real-time delivery tracking consoles serving enterprise clients.",
    clients: [
      {
        name: "Friendbuy (USA)",
        type: "Referral and Loyalty SaaS Platform",
        summary: "High-scale referral & loyalty platform serving 500K+ daily API requests at 99.9% uptime on AWS ECS.",
        highlights: [
          "Architected the end-to-end announcement and notification system serving 10K+ merchant campaigns, pairing a React authoring dashboard with a Node.js dispatch engine that reaches millions of recipients within seconds.",
          "Instrumented impression, click, and click-through rate analytics, lifting user engagement by 25% and conversion by 20%.",
          "Designed Node.js and Express.js services for 500K+ daily API requests and reduced response times by 30%.",
          "Engineered a bulk rewards pipeline validating and processing 1M+ CSV records per run using asynchronous jobs and batched DynamoDB writes, improving throughput by 40%.",
          "Deployed containerized microservices on AWS ECS with auto-scaling policies absorbing 3x traffic surges at 99.9% uptime and enforced role-based access control (RBAC) across 3 user roles.",
          "Integrated CloudWatch, S3, Elasticsearch, and Kibana for metrics and log aggregation, cutting mean incident resolution time by 35%."
        ]
      },
      {
        name: "Nearle",
        type: "Hyperlocal Commerce Dispatch and Live Tracking Console",
        summary: "Real-time rider dispatch console and sub-100ms routing engine powered by Go and WebSockets.",
        highlights: [
          "Built a React dispatch console for live rider GPS, streaming updates over WebSockets through a Go backend, using goroutines to concurrently apply a Kalman filter across hundreds of live rider streams and resolve 5–15 m of signal noise into stable positions.",
          "Self-hosted OSRM on OpenStreetMap data behind a Go service to compute the fastest routes in under 100 ms, leveraging Go's low-latency concurrency model to replace Google Directions API at zero per-request cost and 2–5x lower latency.",
          "Delivered zone-based geofencing with polygon map overlays and automated rider assignment ranked on 3 signals (proximity, current load, and zone), surfacing live ETAs to dispatchers."
        ]
      }
    ],
    responsibilities: [
      "Architected the announcement and notification system serving 10K+ merchant campaigns across millions of recipients within seconds",
      "Engineered a bulk rewards pipeline processing 1M+ CSV records per run with asynchronous background jobs and batched DynamoDB writes",
      "Deployed containerized microservices on AWS ECS with auto-scaling policies absorbing 3x traffic surges at 99.9% uptime",
      "Built a real-time React dispatch console for live rider GPS streaming over WebSockets via Go goroutines and Kalman filters",
      "Self-hosted OSRM routing engine on OpenStreetMap data in Go, computing routes in under 100ms at zero per-request cost",
      "Integrated CloudWatch, S3, Elasticsearch, and Kibana for metrics, cutting incident resolution time by 35%"
    ],
    achievements: [
      "500K+ daily API requests served at 99.9% uptime",
      "1M+ CSV bulk records processed per run with 40% throughput gain",
      "25% lift in engagement and 20% conversion increase on notification campaigns",
      "Replaced Google Directions API with self-hosted Go OSRM (zero per-request cost, 2-5x lower latency)",
      "3x traffic surge absorption with AWS ECS auto-scaling"
    ],
    technologies: [
      "React.js",
      "Node.js",
      "Express.js",
      "Go",
      "WebSockets",
      "AWS ECS",
      "AWS EC2",
      "AWS S3",
      "AWS CloudWatch",
      "DynamoDB",
      "MongoDB",
      "Elasticsearch",
      "Kibana",
      "Docker",
      "Kubernetes",
      "GitHub Actions",
      "Jenkins",
      "CircleCI"
    ],
    projects: [
      {
        name: "Friendbuy — Referral & Loyalty SaaS Platform",
        description: "Enterprise SaaS platform serving 500K+ daily requests and 10K+ merchant campaigns",
        impact: "Sub-second response times, 1M+ record CSV batch processing, 99.9% uptime"
      },
      {
        name: "Nearle — Hyperlocal Dispatch Console",
        description: "Live rider GPS tracking console with Kalman noise filtering and self-hosted OSRM routing",
        impact: "Zero per-request routing costs and sub-100ms routing latency"
      }
    ]
  },
  {
    id: 2,
    company: "Dotworld Technologies",
    role: "Full-Stack Developer Intern",
    type: "Internship",
    location: "Coimbatore, India",
    client: null,
    startDate: "2024-04",
    endDate: "2024-10",
    current: false,
    duration: "Apr 2024 - Oct 2024",
    description: "Developed animated high-performance web applications and hardened backend endpoints for 10K+ concurrent users.",
    responsibilities: [
      "Developed animated, responsive landing pages in React.js, Next.js, and GSAP, achieving 30% faster page loads",
      "Tuned Node.js and Express.js endpoints serving 10K+ concurrent users, trimming response times by 25%",
      "Modeled and indexed MongoDB schemas behind 5+ critical features, raising query efficiency by 30%",
      "Implemented JWT and OAuth workflows that protect 10+ access points, closing 40% of flagged vulnerabilities"
    ],
    achievements: [
      "30% faster page loads via React.js, Next.js & GSAP animation optimizations",
      "25% response time reduction on endpoints serving 10K+ concurrent users",
      "30% query efficiency improvement through MongoDB schema indexing",
      "Closed 40% of flagged vulnerabilities with robust JWT & OAuth implementations"
    ],
    technologies: [
      "React.js",
      "Next.js",
      "GSAP",
      "Node.js",
      "Express.js",
      "MongoDB",
      "JWT",
      "OAuth",
      "REST APIs",
      "TailwindCSS"
    ],
    projects: []
  }
];

export const calculateDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (years === 0) return `${months} mos`;
  if (remainingMonths === 0) return `${years} yr${years > 1 ? "s" : ""}`;
  return `${years}.${Math.round((remainingMonths / 12) * 10)} yrs`;
};

export default experiences;
