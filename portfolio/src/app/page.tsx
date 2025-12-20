'use client';

import { motion, useScroll, useTransform, useSpring, useVelocity } from "framer-motion";
import { ExternalLink, Github, Linkedin, Mail, ArrowRight, Code2, Database, Layout, Cpu, Sparkles, MoveRight } from "lucide-react";
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

const RevealText = ({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) => {
  return (
    <div className="overflow-hidden">
      <motion.p
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
        className={className}
      >
        {text}
      </motion.p>
    </div>
  );
};

const ProjectCard = ({ project, index }: { project: GitHubRepo; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useSpring(0, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: mouseX, y: mouseY, rotateX: useTransform(mouseY, [-20, 20], [10, -10]), rotateY: useTransform(mouseX, [-20, 20], [-10, 10]) }}
      className="group relative h-[450px] w-[350px] md:w-[500px] overflow-hidden rounded-3xl bg-zinc-900/40 border border-zinc-800/50 flex-shrink-0 transition-all duration-500 hover:border-emerald-500/30 hover:shadow-[0_0_50px_rgba(16,185,129,0.1)] perspective-1000"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Floating Index Background */}
      <div className="absolute -bottom-12 -right-12 text-[20rem] font-black text-white/[0.02] select-none pointer-events-none transition-transform duration-700 group-hover:-translate-y-8 group-hover:-translate-x-8">
        {index + 1}
      </div>

      <div className="relative h-full p-8 md:p-12 flex flex-col justify-between">
        <motion.div style={{ x: useTransform(mouseX, (v) => v * 0.2), y: useTransform(mouseY, (v) => v * 0.2) }}>
          <div className="mb-8 p-4 w-fit rounded-2xl bg-zinc-900 border border-zinc-800 text-emerald-400 group-hover:text-emerald-300 group-hover:scale-110 transition-all duration-500">
            <ProjectIcon language={project.language} />
          </div>
          <h3 className="text-3xl font-bold mb-4 tracking-tight text-white group-hover:translate-x-2 transition-transform duration-500">{project.name}</h3>
          <p className="text-zinc-400 leading-relaxed text-lg font-medium line-clamp-3 group-hover:text-zinc-300 transition-colors duration-500">
            {project.description || "Deciphering complexity through code and operational excellence."}
          </p>
        </motion.div>
        
        <div className="space-y-8">
          <div className="flex flex-wrap gap-2">
            {project.language && (
              <span className="text-[10px] px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 font-mono border border-zinc-700/50">
                {project.language}
              </span>
            )}
            <span className="text-[10px] px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-mono border border-emerald-500/20 uppercase tracking-tighter">
              STARS_{project.stargazers_count}
            </span>
          </div>
          
          <div className="flex items-center gap-8">
            <Link
              href={project.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              SOURCE_CODE <ArrowRight className="w-4 h-4" />
            </Link>
            {project.homepage && (
              <Link
                href={project.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors"
              >
                LIVE_DEMO <ExternalLink className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const HorizontalProjects = ({ projects }: { projects: GitHubRepo[] }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-70%"]);
  const springX = useSpring(x, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  // Cinematic Velocity-based Skew
  const scrollVelocity = useVelocity(scrollYProgress);
  const skewXRaw = useTransform(scrollVelocity, [-0.5, 0.5], [-15, 15]);
  const skewX = useSpring(skewXRaw, { stiffness: 400, damping: 90 });
  
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const glowColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["rgba(16, 185, 129, 0.05)", "rgba(59, 130, 246, 0.05)", "rgba(16, 185, 129, 0.05)"]
  );

  return (
    <section ref={targetRef} className="relative h-[500vh] bg-black">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* Scanning Line Effect */}
        <motion.div 
          animate={{ 
            top: ["0%", "100%", "0%"],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute left-0 right-0 h-[2px] bg-emerald-500/30 z-30 pointer-events-none blur-[1px]"
        />

        {/* Background Decorative Element */}
        <motion.div 
          style={{ opacity }}
          className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
        >
          <motion.div 
            style={{ backgroundColor: glowColor }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] blur-[150px] rounded-full transition-colors duration-1000" 
          />
          
          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.1]" 
               style={{ backgroundImage: 'radial-gradient(#10b981 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }} 
          />
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
        </motion.div>

        <motion.div
          style={{ opacity }}
          className="flex flex-col px-6 md:px-24 w-full absolute top-12 md:top-24 z-10"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 mb-4"
          >
            <span className="h-px w-12 bg-emerald-500" />
            <span className="text-emerald-500 font-mono text-xs tracking-[0.3em] uppercase">Cinematic Archive</span>
          </motion.div>
          <h2 className="text-5xl md:text-[12rem] font-black tracking-tighter text-white opacity-[0.03] leading-none absolute -top-8 left-12 select-none pointer-events-none whitespace-nowrap">
            {CONFIG.labels.projectsTitle}
          </h2>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white relative z-10">
            {CONFIG.labels.projectsTitle}
          </h2>
        </motion.div>

        {/* Project Counter / Progress */}
        <motion.div 
          style={{ opacity }}
          className="absolute bottom-12 right-12 md:right-24 z-10 flex items-center gap-6"
        >
          <div className="flex flex-col items-end">
            <span className="text-emerald-500 font-mono text-xs tracking-widest uppercase">Archive_Status</span>
            <span className="text-white font-bold text-xl tracking-tighter">0{projects.length} PROJECTS_LOADED</span>
          </div>
          <div className="h-12 w-px bg-zinc-800" />
          <div className="w-16 h-16 rounded-full border border-zinc-800 flex items-center justify-center relative">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="30"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-zinc-800"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="30"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="188.5"
                style={{ strokeDashoffset: useTransform(scrollYProgress, [0, 1], [188.5, 0]) }}
                className="text-emerald-500"
              />
            </svg>
            <span className="absolute text-[10px] font-mono text-emerald-500">
              {projects.length}
            </span>
          </div>
        </motion.div>

        <motion.div style={{ x: springX, skewX, opacity }} className="flex gap-12 px-6 md:px-24 relative z-20">
          {projects.map((project, idx) => (
            <ProjectCard key={project.name} project={project} index={idx} />
          ))}
          {/* End Card */}
          <div className="h-[450px] w-[350px] md:w-[500px] flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-800 flex-shrink-0 group hover:border-emerald-500/30 transition-colors">
            <Link 
              href={CONFIG.socials.github} 
              target="_blank"
              className="flex flex-col items-center gap-6 group"
            >
              <div className="p-6 rounded-full bg-zinc-900 border border-zinc-800 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/50 transition-all">
                <Github className="w-8 h-8 text-zinc-500 group-hover:text-emerald-400" />
              </div>
              <span className="text-sm font-mono text-zinc-500 group-hover:text-white transition-colors tracking-widest uppercase">Explore all repos</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
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

  // Background parallax elements
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

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
    <main className="relative min-h-screen selection:bg-emerald-500/30 bg-black text-zinc-200 overflow-x-hidden">
      {/* Cinematic Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div 
          style={{ y: y1, rotate }}
          className="absolute -top-[10%] -right-[10%] w-[80vw] h-[80vw] bg-emerald-500/5 blur-[120px] rounded-full"
        />
        <motion.div 
          style={{ y: y2, rotate: -rotate }}
          className="absolute top-[20%] -left-[10%] w-[60vw] h-[60vw] bg-blue-500/5 blur-[120px] rounded-full"
        />
        <svg className="absolute inset-0 w-full h-full opacity-[0.15] mix-blend-overlay">
          <filter id="noiseFilter">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.6" 
              numOctaves="3" 
              stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 origin-left z-50 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div 
              className="mb-16 flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-emerald-500/20 rounded-2xl blur group-hover:bg-emerald-500/40 transition-all duration-500" />
                <Image 
                  src="/logo.svg" 
                  alt="Wesley Quintero Logo" 
                  width={64} 
                  height={64} 
                  className="relative rounded-xl border border-zinc-800 p-2 bg-zinc-900"
                />
              </div>
              <div className="h-px w-12 bg-zinc-800" />
              <span className="text-zinc-500 font-mono text-xs tracking-[0.4em] uppercase">System_Active</span>
            </motion.div>

            <div className="space-y-4 mb-12">
              <div className="overflow-hidden">
                <motion.h1 
                  className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] bg-gradient-to-b from-white via-white to-zinc-500 bg-clip-text text-transparent"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                  {CONFIG.name.split(' ')[0]}
                </motion.h1>
              </div>
              <div className="overflow-hidden">
                <motion.h1 
                  className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] text-white flex items-center gap-8"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                  {CONFIG.name.split(' ')[1]}
                  <motion.span 
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
                    className="hidden md:block"
                  >
                    <Sparkles className="w-16 h-16 text-emerald-500" />
                  </motion.span>
                </motion.h1>
              </div>
            </div>

            <div className="max-w-2xl space-y-8 mb-16">
              <RevealText 
                text={`${CONFIG.role}.`}
                className="text-2xl md:text-3xl text-zinc-400 font-medium tracking-tight"
                delay={0.5}
              />
              <RevealText 
                text={`"${CONFIG.quote}"`}
                className="text-lg md:text-xl text-zinc-500 italic font-normal border-l-2 border-emerald-500/30 pl-6"
                delay={0.6}
              />
            </div>

            <motion.div 
              className="flex flex-wrap gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link
                href={CONFIG.socials.linkedin}
                target="_blank"
                className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black hover:bg-emerald-500 transition-all duration-500"
              >
                <Linkedin className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-wider">Connect</span>
                <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href={CONFIG.socials.github}
                target="_blank"
                className="group flex items-center gap-3 px-8 py-4 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all duration-500"
              >
                <Github className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                <span className="text-sm font-bold uppercase tracking-wider text-zinc-400 group-hover:text-white">Builds</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Cinematic Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-zinc-600">Scroll to explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-emerald-500 to-transparent" />
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 md:py-64 px-6 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex items-center gap-4"
              >
                <span className="h-px w-12 bg-emerald-500" />
                <span className="text-emerald-500 font-mono text-xs tracking-[0.3em] uppercase">Our Ethos</span>
              </motion.div>
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-tight">
                Engineering <br />
                <span className="text-emerald-500/50">Independence.</span>
              </h2>
              <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed max-w-xl font-medium">
                We don&apos;t just build apps. We architect resilient digital infrastructures that empower scale and operational excellence.
              </p>
            </div>
            <div className="grid gap-8">
              {PHILOSOPHY.map((item, idx) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="group p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 hover:border-emerald-500/30 transition-all duration-500"
                >
                  <div className="flex gap-8 items-start">
                    <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-emerald-500 group-hover:scale-110 transition-transform duration-500">
                      {item.icon}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-white tracking-tight">{item.title}</h3>
                      <p className="text-zinc-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Projects Section */}
      {loading ? (
        <section className="h-screen flex items-center justify-center bg-zinc-950">
          <div className="flex flex-col items-center gap-6">
            <div className="w-12 h-12 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            <span className="text-zinc-600 font-mono text-xs tracking-widest uppercase">Initializing_Projects...</span>
          </div>
        </section>
      ) : (
        <HorizontalProjects projects={displayProjects} />
      )}

      {/* Tech Stack - Vertical Scroll Cinematic */}
      <section className="py-32 md:py-64 px-6 bg-black relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32 md:mb-48">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="inline-flex items-center gap-4 mb-8"
            >
              <span className="h-px w-8 bg-emerald-500" />
              <span className="text-emerald-500 font-mono text-xs tracking-[0.3em] uppercase">Core Mastery</span>
              <span className="h-px w-8 bg-emerald-500" />
            </motion.div>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter text-white">
              {CONFIG.labels.techStackTitle}
            </h2>
          </div>

          <div className="space-y-40">
            {TECH_STACK.map((stack, idx) => (
              <div key={stack.category} className="relative">
                <div className="flex flex-col md:flex-row gap-12 md:gap-32 items-start md:items-center">
                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full md:w-1/3"
                  >
                    <span className="text-emerald-500 font-mono text-sm tracking-[0.5em] uppercase mb-4 block">0{idx + 1}</span>
                    <h3 className="text-4xl font-bold text-white tracking-tighter mb-4">{stack.category}</h3>
                    <div className="h-1 w-24 bg-emerald-500" />
                  </motion.div>
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    {stack.items.map((item, itemIdx) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: itemIdx * 0.1 }}
                        className="group p-8 rounded-2xl bg-zinc-900/20 border border-zinc-800/50 hover:bg-zinc-900/50 hover:border-emerald-500/20 transition-all duration-500"
                      >
                        <span className="text-3xl md:text-5xl font-black text-zinc-700 group-hover:text-white transition-colors duration-500 tracking-tighter">
                          {item}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Final Section */}
      <section className="py-64 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-500/5 z-0" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="space-y-12"
          >
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-none">
              Let&apos;s Build <br />
              <span className="text-emerald-500">The Future.</span>
            </h2>
            <p className="text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Ready to transform your operational challenges into sovereign digital advantages?
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <Link
                href={`mailto:${CONFIG.email}`}
                className="group flex items-center gap-4 px-12 py-6 rounded-full bg-emerald-500 text-black hover:bg-emerald-400 transition-all duration-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
              >
                <Mail className="w-6 h-6" />
                <span className="text-lg font-bold uppercase tracking-widest">Start Project</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-zinc-900 bg-black relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-16 mb-24">
            <div className="space-y-8">
              <Image src="/logo.svg" alt="Logo" width={48} height={48} className="opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" />
              <p className="text-zinc-600 text-xl italic max-w-sm leading-relaxed">
                &quot;{CONFIG.footerQuote}&quot;
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
              <div className="space-y-6">
                <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.4em]">Social</span>
                <ul className="space-y-4">
                  <li><Link href={CONFIG.socials.linkedin} target="_blank" className="text-zinc-400 hover:text-emerald-400 transition-colors font-bold tracking-tight">LinkedIn</Link></li>
                  <li><Link href={CONFIG.socials.github} target="_blank" className="text-zinc-400 hover:text-emerald-400 transition-colors font-bold tracking-tight">GitHub</Link></li>
                </ul>
              </div>
              <div className="space-y-6">
                <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.4em]">Contact</span>
                <ul className="space-y-4">
                  <li><Link href={`mailto:${CONFIG.email}`} className="text-zinc-400 hover:text-emerald-400 transition-colors font-bold tracking-tight">Email</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-zinc-900">
            <p className="text-zinc-600 text-xs font-mono tracking-widest uppercase">
              © {new Date().getFullYear()} {CONFIG.name} | ALL_RIGHTS_RESERVED
            </p>
            <div className="flex gap-8 text-[10px] font-mono text-zinc-700">
              <span>LATENCY: 24ms</span>
              <span>STATUS: OPTIMAL</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
