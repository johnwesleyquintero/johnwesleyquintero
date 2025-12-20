'use client';

import { motion, useScroll, useTransform, useSpring, useVelocity } from "framer-motion";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { type GitHubRepo } from "@/lib/github";
import { CONFIG } from "@/lib/constants";
import { ProjectIcon } from "../ui/ProjectIcon";

const ProjectCard = ({ project, index }: { project: GitHubRepo; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useSpring(0, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 150, damping: 20 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isMobile) return;
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

  const spotlightX = useSpring(0);
  const spotlightY = useSpring(0);

  const rotateXTransform = useTransform(mouseY, [-20, 20], [10, -10]);
  const rotateYTransform = useTransform(mouseX, [-20, 20], [-10, 10]);

  const handleSpotlight = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    spotlightX.set(e.clientX - rect.left);
    spotlightY.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={(e) => {
        handleMouseMove(e);
        handleSpotlight(e);
      }}
      onMouseLeave={handleMouseLeave}
      style={{ 
        x: isMobile ? 0 : mouseX, 
        y: isMobile ? 0 : mouseY, 
        rotateX: isMobile ? 0 : rotateXTransform, 
        rotateY: isMobile ? 0 : rotateYTransform,
        transformStyle: "preserve-3d"
      }}
      className="group relative h-[500px] w-[320px] md:w-[600px] overflow-hidden rounded-[2.5rem] bg-zinc-900/20 border border-zinc-800/30 flex-shrink-0 hover:border-emerald-500/40 transition-all duration-700 backdrop-blur-md"
    >
      <motion.div 
        className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: useTransform(
            [spotlightX, spotlightY],
            ([x, y]) => `radial-gradient(800px circle at ${x}px ${y}px, rgba(16, 185, 129, 0.12), transparent 40%)`
          )
        }}
      />

      {/* Cinematic Vignette for Card */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] z-10 pointer-events-none" />
      
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div 
        className="absolute -bottom-16 -right-16 text-[25rem] font-black text-white/[0.015] select-none pointer-events-none transition-transform duration-1000 group-hover:-translate-y-12 group-hover:-translate-x-12"
        style={{ transform: "translateZ(10px)" }}
      >
        {index + 1}
      </div>

      <div className="relative h-full p-10 md:p-16 flex flex-col justify-between z-20" style={{ transform: "translateZ(50px)" }}>
        <motion.div style={{ x: useTransform(mouseX, (v) => v * 0.05), y: useTransform(mouseY, (v) => v * 0.05) }}>
          <motion.div 
            className="mb-10 p-5 w-fit rounded-2xl bg-zinc-950 border border-zinc-800 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
            whileHover={{ scale: 1.1, color: "#10b981", boxShadow: "0_0_30px_rgba(16,185,129,0.3)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <ProjectIcon language={project.language} />
          </motion.div>
          <motion.h3 
            className="text-4xl md:text-5xl font-black mb-6 tracking-tighter text-white leading-none"
            whileHover={{ x: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {project.name.replace(/-/g, ' ')}
          </motion.h3>
          <p className="text-zinc-400 leading-relaxed text-lg font-medium line-clamp-3 group-hover:text-zinc-300 transition-colors duration-500">
            {project.description || "Deciphering complexity through code and operational excellence."}
          </p>
        </motion.div>
        
        <div className="space-y-8">
          <div className="flex flex-wrap gap-2">
            {project.language && (
              <span className="text-[10px] px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 font-mono border border-zinc-700/50 uppercase tracking-widest">
                {project.language}
              </span>
            )}
            <span className="text-[10px] px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-mono border border-emerald-500/20 uppercase tracking-[0.2em]">
              STARS_{project.stargazers_count}
            </span>
          </div>
          
          <div className="flex items-center gap-8">
            <Link
              href={project.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-bold font-mono tracking-[0.3em] text-emerald-500 hover:text-emerald-400 transition-all group/link"
            >
              SOURCE_CODE <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
            </Link>
            {project.homepage && (
              <Link
                href={project.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-bold font-mono tracking-[0.3em] text-zinc-500 hover:text-white transition-all group/link"
              >
                LIVE_DEMO <ExternalLink className="w-4 h-4 group-hover/link:-translate-y-1 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const HorizontalProjects = ({ projects }: { projects: GitHubRepo[] }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState(0);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    const updateScrollRange = () => {
      if (scrollRef.current) {
        const padding = window.innerWidth < 768 ? 48 : 192;
        setScrollRange(scrollRef.current.scrollWidth - window.innerWidth + padding);
      }
    };

    updateScrollRange();
    window.addEventListener('resize', updateScrollRange);
    return () => window.removeEventListener('resize', updateScrollRange);
  }, [projects.length]);

  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);
  const springX = useSpring(x, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const scrollVelocity = useVelocity(scrollYProgress);
  const skewXRaw = useTransform(scrollVelocity, [-0.5, 0.5], [-10, 10]);
  const skewX = useSpring(skewXRaw, { stiffness: 400, damping: 90 });
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);
  const glowColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["rgba(16, 185, 129, 0.05)", "rgba(59, 130, 246, 0.05)", "rgba(16, 185, 129, 0.05)"]
  );

  const currentIndex = useTransform(scrollYProgress, [0, 1], [1, projects.length]);
  const [displayIndex, setDisplayIndex] = useState(1);
  
  useEffect(() => {
    return currentIndex.on("change", (latest) => {
      setDisplayIndex(Math.min(projects.length, Math.max(1, Math.round(latest))));
    });
  }, [currentIndex, projects.length]);

  return (
    <section ref={targetRef} className="relative bg-black" style={{ height: `${(projects.length + 2) * 100}vh` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black" />
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.5 }}
          className="absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 md:hidden z-30 pointer-events-none"
        >
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-500">Scroll to explore</span>
          <motion.div 
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-px h-8 bg-emerald-500/50"
          />
        </motion.div>

        <motion.div 
          animate={{ 
            top: ["-10%", "110%"],
            opacity: [0, 0.3, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[2px] bg-emerald-500/50 z-30 pointer-events-none blur-[1px] shadow-[0_0_15px_rgba(16,185,129,0.5)]"
        />

        <motion.div style={{ opacity }} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div 
            style={{ backgroundColor: glowColor }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] blur-[150px] rounded-full transition-colors duration-1000" 
          />
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#10b981 0.5px, transparent 0.5px)', backgroundSize: '60px 60px' }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
        </motion.div>

        <motion.div style={{ opacity }} className="flex flex-col px-6 md:px-24 w-full absolute top-12 md:top-24 z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 mb-4"
          >
            <span className="h-px w-12 bg-emerald-500" />
            <span className="text-emerald-500 font-mono text-[10px] tracking-[0.5em] uppercase">Sovereign_Records</span>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-mono text-emerald-500 uppercase tracking-widest">Live_Feed</span>
            </div>
          </motion.div>
          <h2 className="text-5xl md:text-[12rem] font-black tracking-tighter text-white opacity-[0.03] leading-none absolute -top-8 left-12 select-none pointer-events-none whitespace-nowrap">
            {CONFIG.labels.projectsTitle}
          </h2>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white relative z-10">
            {CONFIG.labels.projectsTitle}
          </h2>
        </motion.div>

        <motion.div style={{ opacity }} className="absolute bottom-12 right-12 md:right-24 z-10 flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-emerald-500 font-mono text-[10px] tracking-[0.4em] uppercase opacity-50 mb-1">Status_Online</span>
            <div className="flex items-baseline gap-2">
              <span className="text-white font-black text-4xl tracking-tighter">0{displayIndex}</span>
              <span className="text-zinc-600 font-mono text-xs">/ 0{projects.length}</span>
            </div>
          </div>
          <div className="h-12 w-px bg-zinc-800/50" />
          <div className="w-14 h-14 rounded-full border border-zinc-800/50 flex items-center justify-center relative bg-black/40 backdrop-blur-sm">
            <svg className="w-full h-full -rotate-90 p-1">
              <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="1" className="text-zinc-800" style={{ transform: "scale(1.15)", transformOrigin: "center" }} />
              <motion.circle
                cx="24"
                cy="24"
                r="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="138.2"
                style={{ 
                  strokeDashoffset: useTransform(scrollYProgress, [0, 1], [138.2, 0]),
                  transform: "scale(1.15)",
                  transformOrigin: "center"
                }}
                className="text-emerald-500"
              />
            </svg>
            <span className="absolute text-[10px] font-mono text-emerald-500 font-bold">
              {Math.round(displayIndex / projects.length * 100)}%
            </span>
          </div>
        </motion.div>

        <motion.div ref={scrollRef} style={{ x: springX, skewX, opacity }} className="flex gap-12 px-6 md:px-24 relative z-20 w-fit">
          {projects.map((project, idx) => (
            <ProjectCard key={project.name} project={project} index={idx} />
          ))}
          <div className="h-[450px] w-[350px] md:w-[500px] flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-800 flex-shrink-0 group hover:border-emerald-500/30 transition-colors">
            <Link href={CONFIG.socials.github} target="_blank" className="flex flex-col items-center gap-6 group">
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
