const { initializeFirebase, db } = require("../config/firebase");

initializeFirebase();

const seedData = async () => {
  try {
    console.log("🌱 Starting database seed...");

    const careers = [
      {
        id: "frontend-developer",
        title: "Frontend Developer",
        overview:
          "Learn how to build modern web interfaces using HTML, CSS, JavaScript, and React",
        roadmapSteps: [
          "HTML Fundamentals",
          "CSS Basics & Flexbox/Grid",
          "JavaScript Fundamentals",
          "DOM Manipulation",
          "React Fundamentals",
          "State Management",
          "API Integration",
        ],
        quests: [
          "quest-html-1",
          "quest-html-2",
          "quest-css-1",
          "quest-css-2",
          "quest-js-1",
          "quest-js-2",
          "quest-react-1",
          "quest-react-2",
        ],
        projects: [
          "project-portfolio",
          "project-todo-app",
          "project-weather-app",
        ],
      },
      {
        id: "backend-developer",
        title: "Backend Developer",
        overview:
          "Master server-side development with Node.js, databases, and API design",
        roadmapSteps: [
          "Server Fundamentals",
          "Node.js Basics",
          "Express.js Framework",
          "Database Design",
          "RESTful APIs",
          "Authentication & Security",
          "Deployment & DevOps",
        ],
        quests: [
          "quest-node-1",
          "quest-node-2",
          "quest-express-1",
          "quest-express-2",
          "quest-db-1",
          "quest-db-2",
          "quest-api-1",
          "quest-api-2",
        ],
        projects: [
          "project-rest-api",
          "project-blog-backend",
          "project-ecommerce-api",
        ],
      },
      {
        id: "fullstack-developer",
        title: "Full Stack Developer",
        overview:
          "Combine frontend and backend skills to build complete web applications",
        roadmapSteps: [
          "Frontend Foundations",
          "Backend Foundations",
          "Database Integration",
          "Full Stack Architecture",
          "Authentication Systems",
          "Deployment & Hosting",
          "Performance Optimization",
        ],
        quests: [
          "quest-fullstack-1",
          "quest-fullstack-2",
          "quest-fullstack-3",
          "quest-fullstack-4",
        ],
        projects: [
          "project-social-app",
          "project-ecommerce-full",
          "project-dashboard",
        ],
      },
    ];

    const quests = [
      {
        id: "quest-html-1",
        careerId: "frontend-developer",
        title: "HTML Basics Challenge",
        description: "Create a semantic HTML structure for a personal webpage",
        type: "daily",
        xpReward: 10,
        xpPenalty: -5,
      },
      {
        id: "quest-html-2",
        careerId: "frontend-developer",
        title: "HTML Forms Mastery",
        description: "Build a contact form with proper validation attributes",
        type: "weekly",
        xpReward: 25,
        xpPenalty: -10,
      },
      {
        id: "quest-css-1",
        careerId: "frontend-developer",
        title: "CSS Flexbox Layout",
        description: "Create a responsive navigation bar using Flexbox",
        type: "daily",
        xpReward: 10,
        xpPenalty: -5,
      },
      {
        id: "quest-css-2",
        careerId: "frontend-developer",
        title: "CSS Grid Challenge",
        description: "Design a photo gallery layout using CSS Grid",
        type: "weekly",
        xpReward: 25,
        xpPenalty: -10,
      },
      {
        id: "quest-js-1",
        careerId: "frontend-developer",
        title: "JavaScript Fundamentals",
        description: "Solve 3 basic JavaScript problems on arrays and objects",
        type: "daily",
        xpReward: 15,
        xpPenalty: -5,
      },
      {
        id: "quest-js-2",
        careerId: "frontend-developer",
        title: "DOM Manipulation Practice",
        description: "Build an interactive calculator using vanilla JavaScript",
        type: "weekly",
        xpReward: 30,
        xpPenalty: -10,
      },
      {
        id: "quest-react-1",
        careerId: "frontend-developer",
        title: "React Components",
        description: "Create reusable React components for a card layout",
        type: "daily",
        xpReward: 20,
        xpPenalty: -8,
      },
      {
        id: "quest-react-2",
        careerId: "frontend-developer",
        title: "React State Management",
        description: "Build a counter app with useState and useEffect hooks",
        type: "weekly",
        xpReward: 35,
        xpPenalty: -15,
      },
      {
        id: "quest-node-1",
        careerId: "backend-developer",
        title: "Node.js Basics",
        description: "Create a simple HTTP server using Node.js core modules",
        type: "daily",
        xpReward: 10,
        xpPenalty: -5,
      },
      {
        id: "quest-node-2",
        careerId: "backend-developer",
        title: "File System Operations",
        description: "Build a file management system using Node.js fs module",
        type: "weekly",
        xpReward: 25,
        xpPenalty: -10,
      },
      {
        id: "quest-express-1",
        careerId: "backend-developer",
        title: "Express Routes",
        description: "Create RESTful routes for a basic CRUD application",
        type: "daily",
        xpReward: 15,
        xpPenalty: -5,
      },
      {
        id: "quest-express-2",
        careerId: "backend-developer",
        title: "Middleware Implementation",
        description:
          "Implement custom middleware for authentication and logging",
        type: "weekly",
        xpReward: 30,
        xpPenalty: -10,
      },
      {
        id: "quest-db-1",
        careerId: "backend-developer",
        title: "Database Design",
        description: "Design a database schema for a blog application",
        type: "daily",
        xpReward: 15,
        xpPenalty: -8,
      },
      {
        id: "quest-db-2",
        careerId: "backend-developer",
        title: "Database Operations",
        description: "Implement CRUD operations with MongoDB/Firebase",
        type: "weekly",
        xpReward: 30,
        xpPenalty: -15,
      },
      {
        id: "quest-api-1",
        careerId: "backend-developer",
        title: "API Documentation",
        description:
          "Create comprehensive API documentation using Swagger/OpenAPI",
        type: "daily",
        xpReward: 12,
        xpPenalty: -6,
      },
      {
        id: "quest-api-2",
        careerId: "backend-developer",
        title: "API Testing",
        description: "Write unit tests for your API endpoints",
        type: "weekly",
        xpReward: 25,
        xpPenalty: -12,
      },
      {
        id: "quest-fullstack-1",
        careerId: "fullstack-developer",
        title: "Frontend-Backend Integration",
        description: "Connect React frontend with Node.js backend API",
        type: "daily",
        xpReward: 20,
        xpPenalty: -10,
      },
      {
        id: "quest-fullstack-2",
        careerId: "fullstack-developer",
        title: "Authentication Flow",
        description: "Implement complete user authentication system",
        type: "weekly",
        xpReward: 40,
        xpPenalty: -20,
      },
      {
        id: "quest-fullstack-3",
        careerId: "fullstack-developer",
        title: "Deployment Pipeline",
        description: "Deploy full stack application to cloud platform",
        type: "weekly",
        xpReward: 35,
        xpPenalty: -15,
      },
      {
        id: "quest-fullstack-4",
        careerId: "fullstack-developer",
        title: "Performance Optimization",
        description: "Optimize application for better performance and SEO",
        type: "daily",
        xpReward: 25,
        xpPenalty: -12,
      },
    ];

    const projects = [
      {
        id: "project-portfolio",
        careerId: "frontend-developer",
        title: "Personal Portfolio Website",
        description:
          "Build a responsive portfolio website showcasing your projects and skills",
        unlockLevel: 3,
        resources: [
          "https://github.com/starter-templates/portfolio-template",
          "https://www.figma.com/portfolio-designs",
        ],
      },
      {
        id: "project-todo-app",
        careerId: "frontend-developer",
        title: "Interactive Todo Application",
        description:
          "Create a feature-rich todo app with local storage and drag-drop functionality",
        unlockLevel: 8,
        resources: [
          "https://github.com/starter-templates/todo-app-react",
          "https://docs.example.com/todo-app-guide",
        ],
      },
      {
        id: "project-weather-app",
        careerId: "frontend-developer",
        title: "Weather Forecast Application",
        description:
          "Build a weather app that fetches data from external APIs and displays forecasts",
        unlockLevel: 12,
        resources: [
          "https://github.com/starter-templates/weather-app",
          "https://openweathermap.org/api",
        ],
      },
      {
        id: "project-rest-api",
        careerId: "backend-developer",
        title: "RESTful API Server",
        description:
          "Build a complete REST API with authentication, validation, and documentation",
        unlockLevel: 5,
        resources: [
          "https://github.com/starter-templates/express-api-boilerplate",
          "https://swagger.io/docs/",
        ],
      },
      {
        id: "project-blog-backend",
        careerId: "backend-developer",
        title: "Blog Backend System",
        description:
          "Create a blog backend with user management, posts, comments, and moderation",
        unlockLevel: 10,
        resources: [
          "https://github.com/starter-templates/blog-backend",
          "https://docs.example.com/blog-architecture",
        ],
      },
      {
        id: "project-ecommerce-api",
        careerId: "backend-developer",
        title: "E-commerce API",
        description:
          "Develop a scalable e-commerce backend with payment integration and inventory management",
        unlockLevel: 18,
        resources: [
          "https://github.com/starter-templates/ecommerce-api",
          "https://stripe.com/docs/api",
        ],
      },
      {
        id: "project-social-app",
        careerId: "fullstack-developer",
        title: "Social Media Application",
        description:
          "Build a complete social media platform with real-time features",
        unlockLevel: 15,
        resources: [
          "https://github.com/starter-templates/social-app-fullstack",
          "https://socket.io/docs/",
        ],
      },
      {
        id: "project-ecommerce-full",
        careerId: "fullstack-developer",
        title: "Full Stack E-commerce Platform",
        description:
          "Create a complete e-commerce solution with admin panel and customer interface",
        unlockLevel: 22,
        resources: [
          "https://github.com/starter-templates/ecommerce-fullstack",
          "https://docs.example.com/ecommerce-guide",
        ],
      },
      {
        id: "project-dashboard",
        careerId: "fullstack-developer",
        title: "Analytics Dashboard",
        description:
          "Develop a data visualization dashboard with charts, graphs, and real-time updates",
        unlockLevel: 25,
        resources: [
          "https://github.com/starter-templates/dashboard-app",
          "https://recharts.org/en-US/",
          "https://d3js.org/getting-started",
        ],
      },
    ];

    console.log("📚 Seeding careers...");
    const careersBatch = db().batch();
    careers.forEach((career) => {
      const careerRef = db().collection("careers").doc(career.id);
      careersBatch.set(careerRef, career);
    });
    await careersBatch.commit();

    console.log("🎯 Seeding quests...");
    const questsBatch = db().batch();
    quests.forEach((quest) => {
      const questRef = db().collection("quests").doc(quest.id);
      questsBatch.set(questRef, quest);
    });
    await questsBatch.commit();

    console.log("🚀 Seeding projects...");
    const projectsBatch = db().batch();
    projects.forEach((project) => {
      const projectRef = db().collection("projects").doc(project.id);
      projectsBatch.set(projectRef, project);
    });
    await projectsBatch.commit();

    console.log("✅ Database seeding completed successfully!");
    console.log(
      `📊 Seeded: ${careers.length} careers, ${quests.length} quests, ${projects.length} projects`
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedData();
