'use client';

import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { getGitHubProjects, type GitHubRepo } from "@/lib/github";
import { CONFIG } from "@/lib/constants";

// UI Components
import { CustomCursor } from "@/components/ui/CustomCursor";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

// Sections
import { Hero } from "@/components/sections/Hero";
import { Philosophy } from "@/components/sections/Philosophy";
import { HorizontalProjects } from "@/components/sections/Projects";
import { TechStack } from "@/components/sections/TechStack";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  const [displayProjects, setDisplayProjects] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBooted, setIsBooted] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Background parallax elements
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -600]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -45]);

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
    <div className="bg-black">
      <AnimatePresence>
        {!isBooted && <LoadingScreen onComplete={() => setIsBooted(true)} />}
      </AnimatePresence>

      <CustomCursor />
      
      {/* Global Cinematic Elements */}
      <div className="noise-overlay" />
      <div className="scanline" />
      
      {/* Cinematic Color Grade */}
      <div className="fixed inset-0 pointer-events-none z-[100] bg-emerald-500/5 mix-blend-overlay" />
      
      <main className={`relative min-h-screen selection:bg-emerald-500/30 bg-black text-zinc-200 overflow-x-hidden transition-opacity duration-1000 ${isBooted ? 'opacity-100' : 'opacity-0'}`}>
        {/* Cinematic Background Elements */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <motion.div 
            style={{ y: y1, rotate: rotate1 }}
            className="absolute -top-[20%] -right-[10%] w-[100vw] h-[100vw] bg-emerald-500/5 blur-[150px] rounded-full"
          />
          <motion.div 
            style={{ y: y2, rotate: rotate2 }}
            className="absolute top-[10%] -left-[20%] w-[80vw] h-[80vw] bg-blue-500/5 blur-[150px] rounded-full"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
        </div>

        {/* Cinematic Framing (Letterbox) */}
        <motion.div 
          className="fixed inset-x-0 top-0 h-8 md:h-12 bg-black z-[90] pointer-events-none origin-top"
          style={{ scaleY: useTransform(scrollYProgress, [0, 0.1], [1, 0.5]) }}
        />
        <motion.div 
          className="fixed inset-x-0 bottom-0 h-8 md:h-12 bg-black z-[90] pointer-events-none origin-bottom"
          style={{ scaleY: useTransform(scrollYProgress, [0, 0.1], [1, 0.5]) }}
        />

        <div className="fixed inset-x-0 top-0 h-24 bg-gradient-to-b from-black to-transparent z-[60] pointer-events-none opacity-50" />
        <div className="fixed inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent z-[60] pointer-events-none opacity-50" />

        {/* Scroll Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 origin-left z-[70] shadow-[0_0_15px_rgba(16,185,129,0.5)]"
          style={{ scaleX }}
        />

        <Hero />
        <Philosophy />

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

        <TechStack />
        <CTA />
        <Footer />
      </main>
    </div>
  );
}
