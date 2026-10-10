export const profile = {
  name: "Fahad Bin Mansoor",
  initials: "FM",
  role: "Software Engineer at ImagineTask Limited",
  headline: "I build web apps and AI agents that handle real business work.",
  intro: "I'm a Software Engineering student at CUST, Islamabad. I ship full-stack products with React, TypeScript and Node.js, and connect them to AI agents and automations built in n8n.",
  email: "fahadmansoor396@gmail.com",
  linkedin: "https://www.linkedin.com/in/fahad-bin-mansoor-63b4b1373/",
  github: "https://github.com/Fahad42800",
  location: "Rawalpindi / Islamabad, Pakistan",
  stats: [
    { value: "5", label: "featured projects" },
    { value: "10+", label: "specialised agents in one multi-agent system" },
    { value: "7th sem", label: "BS Software Engineering, CUST" },
  ],
  services: [
    { title: "Web development", text: "Responsive, fast interfaces backed by clean APIs and databases.", points: ["React and TypeScript front ends", "Node.js and REST APIs", "PostgreSQL data models"] },
    { title: "AI agents", text: "Agents that answer customers, write proposals and route requests.", points: ["Customer support agents", "Multi-agent orchestration", "Prompting with live data context"] },
    { title: "Automation", text: "Workflows that replace copy-pasting between your tools.", points: ["n8n workflows and webhooks", "API and database integrations", "Document and report generation"] },
  ],
  experience: [
    { title: "Software Engineer", where: "ImagineTask Limited", when: "July 2026 to present", points: [
      "Design, build and maintain full-stack web applications with React, TypeScript and Node.js, turning business requirements into clear, fast interfaces.",
      "Build REST API integrations and data flows across databases and third-party services, including production AI agents in n8n.",
      "Share ownership of the full lifecycle, from concept to testing, deployment and iteration, balancing quick delivery with long-term maintainability."] },
    { title: "BS Software Engineering", where: "Capital University of Science and Technology", when: "2023 to 2027", points: [
      "Currently in the 7th semester.",
      "Coursework: Software Construction, Software Quality Engineering, Automated Software Testing, Web Engineering, Data Structures and Algorithms, OOP, Artificial Intelligence, Database Systems."] },
  ],
  stack: [
    { group: "AI and automation", items: ["n8n", "AI agents", "REST API integration", "Python for AI", "Machine learning basics"] },
    { group: "Languages", items: ["Python", "TypeScript", "JavaScript", "Java", "C++", "SQL"] },
    { group: "Web", items: ["React.js", "Node.js", "PostgreSQL", "HTML5", "CSS3"] },
    { group: "Tools", items: ["Git", "GitHub", "VS Code"] },
  ],
};

export const projects = [
  { title: "AI Opportunity Funnel", kind: "Full-stack web app", tags: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    problem: "Teams have many AI ideas and no consistent way to decide which ones to pursue.",
    built: "A five-stage funnel from discovery to a ranked shortlist. A weighted engine scores ROI, feasibility, complexity, risk and strategic alignment into one live score, and a 2x2 matrix sorts ideas into Quick Wins, Strategic Bets, Fill-ins and Avoid. Includes role-based access, an audit trail, and CSV/PDF export." },
  { title: "PakSafar", kind: "Full-stack web app", tags: ["React", "JavaScript", "REST APIs"],
    problem: "Travellers in Pakistan have no single place to plan a trip.",
    built: "A travel web app with destination browsing, itinerary planning and booking workflows, built with reusable React components, dynamic routing and API-driven state." },
  { title: "AI Customer Support Agent", kind: "AI agent, production", tags: ["n8n", "AI agents", "APIs"],
    problem: "Support teams answer the same questions by hand.",
    built: "A production-level agent in n8n that handles customer queries end to end, using multiple APIs and knowledge sources to give accurate, context-aware replies." },
  { title: "SEO and Ads Proposal Generator", kind: "AI agent", tags: ["n8n", "AI agents", "Automation"],
    problem: "Writing a client proposal means hours of research and formatting.",
    built: "An n8n agent that researches, analyses and generates SEO and ads proposals automatically, cutting turnaround compared to doing it manually." },
  { title: "Multi-Agent Business Operating System", kind: "Multi-agent system", tags: ["n8n", "LLM orchestration", "SQL"],
    problem: "Businesses run HR, sales, support and finance in separate tools with no single entry point.",
    built: "A supervisor agent reads each request and routes it to one of 10+ specialised agents: HR, Sales, Support, Marketing, Finance, Analytics, Notifications, Tasks, Email, Knowledge Base, Calendar and Inventory. SQL queries, webhooks and chat memory give each agent live context." },
];
