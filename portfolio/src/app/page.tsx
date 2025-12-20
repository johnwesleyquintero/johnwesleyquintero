'use client';

import { motion } from "framer-motion";
import { ExternalLink, Github, Linkedin, Mail, ArrowRight, Code2, Database, Layout, Cpu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getGitHubProjects, type GitHubRepo } from "@/lib/github";
import { CONFIG, TECH_STACK, PHILOSOPHY } from "@/lib/constants";

const ProjectIcon = ({ language }: { language: string | null }) => {
  switch (language?.toLowerCase()) {
    case 'typescript':
    case 'javascript':
      return <Code2 className="w-6 h-6" />;
    case 'python':
      return <Cpu className="w-6 h-6" />;
    case 'css':
    case 'html':
      return <Layout className="w-6 h-6" />;
    default:
      return <Database className="w-6 h-6" />;
  }
};

export default function Home() {
  const [displayProjects, setDisplayProjects] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const allProjects = await getGitHubProjects(CONFIG.githubUsername);
      const filtered = allProjects
        .filter(repo => !repo.fork && repo.stargazers_count >= 1)
        .slice(0, 6);
      setDisplayProjects(filtered);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  return (
    <main className="min-h-screen selection:bg-emerald-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-12">
              <Image 
                src="/logo.svg" 
                alt="Wesley Quintero Logo" 
                width={80} 
                height={80} 
                className="rounded-xl border border-zinc-800 p-2 bg-zinc-900/50"
              />
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {CONFIG.name.split(' ')[0]} <br /> {CONFIG.name.split(' ')[1]}
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 font-medium max-w-2xl mb-8 leading-tight">
              {CONFIG.role}. <br />
              <span className="text-zinc-500 italic font-normal text-lg md:text-xl">&quot;{CONFIG.quote}&quot;</span>
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={CONFIG.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 transition-all text-zinc-400 hover:text-white"
              >
                <Linkedin className="w-5 h-5" />
                <span className="text-sm font-medium">LinkedIn</span>
              </Link>
              <Link
                href={CONFIG.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 transition-all text-zinc-400 hover:text-white"
              >
                <Github className="w-5 h-5" />
                <span className="text-sm font-medium">GitHub</span>
              </Link>
              <Link
                href={`mailto:${CONFIG.email}`}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/50 transition-all text-emerald-400"
              >
                <Mail className="w-5 h-5" />
                <span className="text-sm font-medium">Connect</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 -z-10 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full" />
      </section>

      {/* Philosophy Section */}
      <section className="py-24 px-6 border-y border-zinc-900 bg-zinc-950/50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {PHILOSOPHY.map((item, idx) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-4"
            >
              <div className="text-emerald-500">{item.icon}</div>
              <h3 className="text-lg font-bold text-zinc-200">{item.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-4">
                <span className="h-px w-12 bg-emerald-500" />
                {CONFIG.labels.projectsTitle}
              </h2>
              <p className="text-zinc-500 max-w-xl">
                {CONFIG.labels.projectsDesc}
              </p>
            </div>
            <Link 
              href={CONFIG.socials.github} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-mono text-zinc-600 hover:text-emerald-400 transition-colors"
            >
              VIEW_ALL_REPOS _&gt;
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              // Skeleton loading state
              Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 animate-pulse">
                  <div className="mb-6 p-3 w-12 h-12 rounded-lg bg-zinc-800" />
                  <div className="h-6 w-32 bg-zinc-800 rounded mb-4" />
                  <div className="h-4 w-full bg-zinc-800 rounded mb-2" />
                  <div className="h-4 w-2/3 bg-zinc-800 rounded mb-8" />
                  <div className="h-4 w-24 bg-zinc-800 rounded" />
                </div>
              ))
            ) : displayProjects.length > 0 ? (
              displayProjects.map((project, idx) => (
                <motion.div
                  key={project.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/50 transition-all flex flex-col"
                >
                  <div className="mb-6 p-3 w-fit rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400 group-hover:text-emerald-300 transition-colors">
                    <ProjectIcon language={project.language} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{project.name}</h3>
                  <p className="text-zinc-400 mb-6 leading-relaxed text-sm flex-grow">
                    {project.description || "Deciphering complexity through code and operational excellence."}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.language && (
                      <span className="text-[10px] px-2 py-1 rounded bg-zinc-800 text-zinc-500 font-mono border border-zinc-700/50">
                        {project.language}
                      </span>
                    )}
                    {project.stargazers_count > 0 && (
                      <span className="text-[10px] px-2 py-1 rounded bg-emerald-500/5 text-emerald-500/60 font-mono border border-emerald-500/10">
                        STARS_{project.stargazers_count}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-6 mt-auto">
                    <Link
                      href={project.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      Inspect System <ArrowRight className="w-4 h-4" />
                    </Link>
                    {project.homepage && (
                      <Link
                        href={project.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                      >
                        Launch <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 border border-dashed border-zinc-800 rounded-2xl">
                <p className="text-zinc-500 font-mono text-sm">NO_STARRED_REPOS_FOUND_IN_SYSTEM</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 px-6 bg-zinc-950/50 border-y border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-20 text-center">{CONFIG.labels.techStackTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {TECH_STACK.map((stack) => (
              <div key={stack.category} className="text-center group">
                <h3 className="text-zinc-500 text-xs font-mono uppercase tracking-[0.3em] mb-8 group-hover:text-emerald-500 transition-colors">
                  {stack.category}
                </h3>
                <ul className="space-y-6">
                  {stack.items.map((item) => (
                    <li key={item} className="text-2xl md:text-3xl font-black text-zinc-300 hover:text-white transition-colors cursor-default">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-zinc-900 bg-black">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="space-y-4 text-center md:text-left">
            <p className="text-zinc-500 text-sm font-medium tracking-wide">
              © {new Date().getFullYear()} {CONFIG.name}. Built for the long term.
            </p>
            <p className="text-zinc-600 text-xs italic">
              &quot;{CONFIG.footerQuote}&quot;
            </p>
          </div>
          <div className="flex gap-12">
            <Link href={CONFIG.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors font-mono text-xs tracking-tighter">LINKEDIN</Link>
            <Link href={CONFIG.socials.github} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors font-mono text-xs tracking-tighter">GITHUB</Link>
            <Link href={`mailto:${CONFIG.email}`} className="text-zinc-500 hover:text-white transition-colors font-mono text-xs tracking-tighter">EMAIL</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
