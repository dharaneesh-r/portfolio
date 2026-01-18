// Skills organized by category with proficiency levels
export const skillCategories = {
    frontend: {
        title: "Frontend Development",
        description: "Building responsive and interactive user interfaces",
        color: "#61dafb",
        skills: [
            {
                name: "HTML",
                level: 95,
                yearsExp: 2,
                icon: "https://cdn.worldvectorlogo.com/logos/html-1.svg",
                projects: 15
            },
            {
                name: "CSS",
                level: 90,
                yearsExp: 2,
                icon: "https://cdn.worldvectorlogo.com/logos/css-3.svg",
                projects: 15
            },
            {
                name: "JavaScript",
                level: 90,
                yearsExp: 2,
                icon: "https://cdn.worldvectorlogo.com/logos/javascript-1.svg",
                projects: 15
            },
            {
                name: "React.js",
                level: 90,
                yearsExp: 2,
                icon: "https://cdn.worldvectorlogo.com/logos/react-2.svg",
                projects: 12,
                description: "Building SPAs with hooks, context, and modern patterns"
            },
            {
                name: "Next.js",
                level: 80,
                yearsExp: 1.5,
                icon: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg",
                projects: 3,
                description: "Server-side rendering and static site generation"
            },
            {
                name: "TailwindCSS",
                level: 95,
                yearsExp: 2,
                icon: "https://cdn.worldvectorlogo.com/logos/tailwind-css-2.svg",
                projects: 10,
                description: "Utility-first CSS framework for rapid UI development"
            }
        ]
    },

    backend: {
        title: "Backend Development",
        description: "Creating robust server-side applications and APIs",
        color: "#68a063",
        skills: [
            {
                name: "Node.js",
                level: 85,
                yearsExp: 2,
                icon: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg",
                projects: 10,
                description: "Building scalable server-side applications"
            },
            {
                name: "Express.js",
                level: 85,
                yearsExp: 2,
                icon: "https://cdn.worldvectorlogo.com/logos/express-109.svg",
                projects: 10,
                description: "RESTful API development and middleware"
            },
            {
                name: "MongoDB",
                level: 80,
                yearsExp: 2,
                icon: "https://cdn.worldvectorlogo.com/logos/mongodb-icon-1.svg",
                projects: 8,
                description: "NoSQL database design and optimization"
            },
            {
                name: "Firebase",
                level: 75,
                yearsExp: 1.5,
                icon: "https://cdn.worldvectorlogo.com/logos/firebase-1.svg",
                projects: 5,
                description: "Authentication, Firestore, and real-time features"
            }
        ]
    },

    devops: {
        title: "DevOps & Cloud",
        description: "Deployment, containerization, and cloud services",
        color: "#ff9900",
        skills: [
            {
                name: "AWS",
                level: 70,
                yearsExp: 1,
                icon: "https://cdn.worldvectorlogo.com/logos/aws-2.svg",
                projects: 3,
                description: "EC2, S3, Lambda, and cloud deployment"
            },
            {
                name: "Docker",
                level: 75,
                yearsExp: 1,
                icon: "https://cdn.worldvectorlogo.com/logos/docker.svg",
                projects: 4,
                description: "Containerization and multi-container applications"
            },
            {
                name: "Kubernetes",
                level: 65,
                yearsExp: 0.5,
                icon: "https://upload.wikimedia.org/wikipedia/commons/3/39/Kubernetes_logo_without_workmark.svg",
                projects: 2,
                description: "Container orchestration and deployment"
            }
        ]
    },

    tools: {
        title: "Tools & Others",
        description: "Development tools and version control",
        color: "#f34f29",
        skills: [
            {
                name: "Git/GitHub",
                level: 90,
                yearsExp: 2,
                icon: "https://cdn.worldvectorlogo.com/logos/github-icon-1.svg",
                projects: 15,
                description: "Version control and collaboration"
            },
            {
                name: "Postman",
                level: 85,
                yearsExp: 2,
                icon: "https://cdn.worldvectorlogo.com/logos/postman.svg",
                projects: 10,
                description: "API testing and documentation"
            },
            {
                name: "GSAP",
                level: 80,
                yearsExp: 1,
                icon: "https://cdn.worldvectorlogo.com/logos/gsap-greensock.svg",
                projects: 6,
                description: "Advanced web animations"
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
