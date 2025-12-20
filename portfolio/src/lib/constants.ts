import { Shield, Globe, TrendingUp } from "lucide-react";
import React from "react";

export const CONFIG = {
  name: "WESLEY QUINTERO",
  title: "Wesley Quintero | Operations Architect",
  description: "Operations Architect & Full-Stack Developer building sovereign digital systems.",
  role: "Operations Architect & Full-Stack Developer",
  quote: "Building sovereign digital systems and decoding complex operational challenges.",
  footerQuote: "From helpless to helper – that’s where I started, and that’s where I’m going.",
  githubUsername: "johnwesleyquintero",
  email: "johnwesleyquintero@gmail.com",
  socials: {
    linkedin: "https://linkedin.com/in/wesleyquintero",
    github: "https://github.com/johnwesleyquintero",
  },
  revalidateTime: 3600, // 1 hour
  labels: {
    projectsTitle: "Featured Projects",
    projectsDesc: "A selection of high-stakes operational tools and sovereign systems built to solve real-world bottlenecks.",
    techStackTitle: "Conceptual Authority",
  },
};

export const TECH_STACK = [
  { category: "Architecture", items: ["Next.js", "TypeScript", "Python", "Supabase"] },
  { category: "Operations", items: ["Supply Chain", "Data Analysis", "Automation"] },
  { category: "Intelligence", items: ["AI System Design", "LLM Orchestration"] },
];

export const PHILOSOPHY = [
  {
    title: "Sovereign Systems",
    desc: "Building independent infrastructures that don't rely on fragile third-party shortcuts.",
    icon: React.createElement(Shield, { className: "w-5 h-5" }),
  },
  {
    title: "Global Operations",
    desc: "Managing complex telco and e-commerce systems across US and international markets.",
    icon: React.createElement(Globe, { className: "w-5 h-5" }),
  },
  {
    title: "Strategic Growth",
    desc: "Leveraging data and AI to transform operational bottlenecks into scalable advantages.",
    icon: React.createElement(TrendingUp, { className: "w-5 h-5" }),
  },
];
