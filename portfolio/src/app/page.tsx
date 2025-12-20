'use client';

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ExternalLink, Github, Linkedin, Mail, ArrowRight, Code2, Database, Layout, Cpu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
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

const AnimatedSection = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [50, 0, 0, -50]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity, scale, y }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

export default function Home() {
  const [displayProjects, setDisplayProjects] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

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
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              duration: 1,
              ease: [0.16, 1, 0.3, 1] // Custom cinematic cubic-bezier
            }}
          >
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Image 
                src="/logo.svg" 
                alt="Wesley Quintero Logo" 
                width={80} 
                height={80} 
                className="rounded-xl border border-zinc-800 p-2 bg-zinc-900/50"
              />
            </motion.div>
            <motion.h1 
              className="text-5xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {CONFIG.name.split(' ')[0]} <br /> {CONFIG.name.split(' ')[1]}
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-zinc-400 font-medium max-w-2xl mb-8 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {CONFIG.role}. <br />
              <span className="text-zinc-500 italic font-normal text-lg md:text-xl">&quot;{CONFIG.quote}&quot;</span>
            </motion.p>
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
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
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative background element with parallax-like feel */}
        <motion.div 
          className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </section>

      {/* Philosophy Section */}
      <AnimatedSection className="py-32 px-6 border-y border-zinc-900 bg-zinc-950/50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {PHILOSOPHY.map((item, idx) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="space-y-4"
            >
              <div className="text-emerald-500 scale-125 origin-left mb-6">{item.icon}</div>
              <h3 className="text-xl font-bold text-zinc-200">{item.title}</h3>
              <p className="text-zinc-500 text-base leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* Projects Grid */}
      <AnimatedSection className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-4">
            <div>
              <motion.h2 
                className="text-4xl font-bold mb-6 flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="h-px w-16 bg-emerald-500" />
                {CONFIG.labels.projectsTitle}
              </motion.h2>
              <p className="text-zinc-500 text-lg max-w-xl">
                {CONFIG.labels.projectsDesc}
              </p>
            </div>
            <Link 
              href={CONFIG.socials.github} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-mono text-zinc-600 hover:text-emerald-400 transition-colors group flex items-center gap-2"
            >
              VIEW_ALL_REPOS <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.5,
                    delay: idx * 0.1,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="group p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 hover:border-emerald-500/30 hover:bg-zinc-900/60 transition-all flex flex-col backdrop-blur-sm"
                >
                  <div className="mb-6 p-4 w-fit rounded-2xl bg-zinc-900 border border-zinc-800 text-emerald-400 group-hover:text-emerald-300 group-hover:scale-110 transition-all duration-500">
                    <ProjectIcon language={project.language} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 tracking-tight">{project.name}</h3>
                  <p className="text-zinc-400 mb-8 leading-relaxed text-base flex-grow font-medium">
                    {project.description || "Deciphering complexity through code and operational excellence."}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-10">
                    {project.language && (
                      <span className="text-[10px] px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 font-mono border border-zinc-700/50">
                        {project.language}
                      </span>
                    )}
                    {project.stargazers_count > 0 && (
                      <span className="text-[10px] px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-mono border border-emerald-500/20">
                        STARS_{project.stargazers_count}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-8 mt-auto">
                    <Link
                      href={project.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      Inspect <ArrowRight className="w-4 h-4" />
                    </Link>
                    {project.homepage && (
                      <Link
                        href={project.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors"
                      >
                        Launch <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 border border-dashed border-zinc-800 rounded-3xl">
                <p className="text-zinc-600 font-mono text-sm">NO_STARRED_REPOS_FOUND_IN_SYSTEM</p>
              </div>
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* Tech Stack */}
      <AnimatedSection className="py-32 px-6 bg-zinc-950/50 border-y border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold mb-24 text-center tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {CONFIG.labels.techStackTitle}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {TECH_STACK.map((stack, idx) => (
              <motion.div 
                key={stack.category} 
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
              >
                <h3 className="text-emerald-500 text-xs font-mono uppercase tracking-[0.4em] mb-12 group-hover:scale-110 transition-transform duration-500">
                  {stack.category}
                </h3>
                <ul className="space-y-8">
                  {stack.items.map((item) => (
                    <li key={item} className="text-3xl md:text-5xl font-black text-zinc-300 hover:text-white hover:scale-105 transition-all duration-300 cursor-default tracking-tighter">
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-zinc-900 bg-black">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16">
          <div className="space-y-6 text-center md:text-left">
            <p className="text-zinc-400 text-sm font-bold tracking-widest uppercase">
              © {new Date().getFullYear()} {CONFIG.name}
            </p>
            <p className="text-zinc-600 text-lg italic max-w-sm leading-relaxed">
              &quot;{CONFIG.footerQuote}&quot;
            </p>
          </div>
          <div className="flex gap-12">
            <Link href={CONFIG.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-emerald-400 transition-colors font-mono text-xs tracking-[0.2em] font-bold">LINKEDIN</Link>
            <Link href={CONFIG.socials.github} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-emerald-400 transition-colors font-mono text-xs tracking-[0.2em] font-bold">GITHUB</Link>
            <Link href={`mailto:${CONFIG.email}`} className="text-zinc-500 hover:text-emerald-400 transition-colors font-mono text-xs tracking-[0.2em] font-bold">EMAIL</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
