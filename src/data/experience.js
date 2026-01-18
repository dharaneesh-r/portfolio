// Work Experience and Professional History
export const experiences = [
  {
    id: 1,
    company: "Nearle Technologies",
    role: "Full Stack Developer",
    type: "Full-time",
    location: "Coimbatore, India",
    client: "Friendbuy, USA — Referral & Loyalty SaaS Platform",
    startDate: "2025-07",
    endDate: null,
    current: true,
    duration: "Jul 2025 - Present",
    description: "Developing scalable backend services for a US-based enterprise SaaS platform serving major clients with referral and loyalty programs",
    responsibilities: [
      "Planned and enhanced scalable backend services using Node.js and Express.js for a US-based SaaS platform analyzing user data",
      "Executed role-based access control (RBAC) to securely manage permissions across different merchant, user, and user groups",
      "Built a high-volume CSV bulk rewards processing system handling 1M+ records with validation, asynchronous processing, and DynamoDB updates",
      "Architected workloads for auto-scaling on AWS ECS, ensuring reliability during heavy reward-processing traffic",
      "Integrated AWS DynamoDB, S3, and CloudWatch for high-throughput data storage, file handling, and production monitoring",
      "Engineered an announcement and notification system with scheduling, activation, dismissal controls, and analytics tracking",
      "Leveraged event-driven analytics including impressions, clicks, CTR, and dismiss events",
      "Utilized Elasticsearch and Kibana for centralized logging, observability, and debugging",
      "Built modular, responsive UI components using React.js, Redux, and Grommet, delivering multiple projects with zero production bug fixes"
    ],
    achievements: [
      "Processed 1M+ CSV records with zero data loss",
      "Achieved zero production bugs in UI components",
      "Implemented enterprise-grade RBAC system",
      "Built auto-scaling infrastructure on AWS ECS",
      "Delivered multiple features ahead of schedule"
    ],
    technologies: [
      "Node.js",
      "Express.js",
      "React.js",
      "Redux",
      "MongoDB",
      "DynamoDB",
      "AWS EC2",
      "AWS S3",
      "AWS ECS",
      "CloudWatch",
      "Elasticsearch",
      "Kibana",
      "Grommet",
      "Docker",
      "Kubernetes",
      "GitHub Actions",
      "Jenkins",
      "CircleCI"
    ],
    projects: [
      {
        name: "FriendBuy - Referral & Loyalty SaaS Platform",
        description: "Enterprise-grade SaaS platform for referral and loyalty programs",
        impact: "Serving major US enterprise clients with scalable backend infrastructure"
      }
    ]
  },
  {
    id: 2,
    company: "DotWorld Technologies",
    role: "Full Stack Developer Intern",
    type: "Internship",
    location: "Coimbatore, India",
    client: null,
    startDate: "2024-04",
    endDate: "2024-10",
    current: false,
    duration: "Apr 2024 - Oct 2024",
    description: "Enhanced and optimized RESTful APIs and built responsive interfaces for production applications",
    responsibilities: [
      "Enhanced and optimized RESTful APIs using Node.js and Express.js, improving backend efficiency and scalability",
      "Created and maintained MongoDB schemas with a focus on data integrity and query efficiency",
      "Applied secure authentication and authorization workflows for protected application access",
      "Built responsive React.js interfaces and integrated APIs for seamless frontend-backend data flow"
    ],
    achievements: [
      "Improved API response times through optimization",
      "Successfully integrated secure authentication workflows",
      "Built production-ready responsive interfaces",
      "Gained hands-on experience with full-stack development"
    ],
    technologies: [
      "Node.js",
      "Express.js",
      "React.js",
      "MongoDB",
      "REST APIs",
      "Authentication & Authorization"
    ],
    projects: []
  }
];

// Helper function to calculate duration
export const calculateDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  const months = (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) {
    return `${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
  } else if (remainingMonths === 0) {
    return `${years} ${years === 1 ? 'year' : 'years'}`;
  } else {
    return `${years} ${years === 1 ? 'year' : 'years'} ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
  }
};

export default experiences;
