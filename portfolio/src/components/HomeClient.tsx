'use client';

import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useState, useSyncExternalStore } from "react";
import { type GitHubRepo } from "@/lib/github";
import dynamic from "next/dynamic";

// UI Components
import { CustomCursor } from "@/components/ui/CustomCursor";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

// Sections
import { Hero } from "@/components/sections/Hero";

const Philosophy = dynamic(() => import("@/components/sections/Philosophy").then(mod => mod.Philosophy), { 
  ssr: false,
  loading: () => <div className="h-screen bg-black" /> 
});
const HorizontalProjects = dynamic(() => import("@/components/sections/Projects").then(mod => mod.HorizontalProjects), { 
  ssr: false,
  loading: () => <div className="h-screen bg-black" /> 
});
const TechStack = dynamic(() => import("@/components/sections/TechStack").then(mod => mod.TechStack), { 
  ssr: false,
  loading: () => <div className="h-screen bg-black" /> 
});
const CTA = dynamic(() => import("@/components/sections/CTA").then(mod => mod.CTA), { 
  ssr: false,
  loading: () => <div className="h-20 bg-black" /> 
});
const Footer = dynamic(() => import("@/components/sections/Footer").then(mod => mod.Footer), { 
  ssr: false,
  loading: () => <div className="h-20 bg-black" /> 
});

interface HomeClientProps {
  initialProjects: GitHubRepo[];
}

// Helper stores for React 18/19 hydration-safe client-only values
const subscribeResize = (callback: () => void) => {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
};

const getIsMobileSnapshot = () => window.innerWidth < 768;
const getServerIsMobileSnapshot = () => false;

const emptySubscribe = () => () => {};
const getMountedSnapshot = () => true;
const getServerMountedSnapshot = () => false;

export function HomeClient({ initialProjects }: HomeClientProps) {
  const mounted = useSyncExternalStore(emptySubscribe, getMountedSnapshot, getServerMountedSnapshot);
  const isMobile = useSyncExternalStore(subscribeResize, getIsMobileSnapshot, getServerIsMobileSnapshot);
  const [isBooted, setIsBooted] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Background parallax elements - reduced for mobile
  const y1 = useTransform(scrollYProgress, [0, 1], [0, isMobile ? -100 : -300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, isMobile ? -200 : -600]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 45 : 90]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, isMobile ? -20 : -45]);
  const letterboxScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.5]);

  if (!mounted) {
    return null;
  }

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
      
      <main className={`relative min-h-screen selection:bg-emerald-500/30 bg-black text-zinc-200 transition-opacity duration-1000 ${isBooted ? 'opacity-100' : 'opacity-0'}`}>
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
          style={{ scaleY: letterboxScale }}
        />
        <motion.div 
          className="fixed inset-x-0 bottom-0 h-8 md:h-12 bg-black z-[90] pointer-events-none origin-bottom"
          style={{ scaleY: letterboxScale }}
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
        <HorizontalProjects projects={initialProjects} />

        <TechStack />
        <CTA />
        <Footer />
      </main>
    </div>
  );
}
