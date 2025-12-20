'use client';

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Terminal } from "lucide-react";

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing systems...");
  const [isMounted, setIsMounted] = useState(false);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    setIsMounted(true);
    const statuses = [
      "Initializing systems...",
      "Loading operational protocols...",
      "Decrypting sovereign archives...",
      "Establishing neural link...",
      "System ready."
    ];
    
    let currentStatus = 0;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          if (!hasCompletedRef.current) {
            hasCompletedRef.current = true;
            setTimeout(onComplete, 500);
          }
          return 100;
        }
        const next = prev + Math.random() * 15;
        if (next > (currentStatus + 1) * 20 && currentStatus < statuses.length - 1) {
          currentStatus++;
          setStatus(statuses[currentStatus]);
        }
        return Math.min(next, 100);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      exit={{ 
        opacity: 0,
        scale: 1.1,
        filter: "blur(20px)"
      }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-6 font-mono overflow-hidden"
    >
      {/* Cinematic Elements for Loader */}
      <div className="noise-overlay opacity-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)]" />
      
      <div className="max-w-md w-full space-y-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
            <Terminal className="w-12 h-12 text-emerald-500 relative" />
          </div>
          <span className="text-sm tracking-[0.8em] uppercase text-emerald-500/80">Wesley_OS v2.2</span>
        </motion.div>
        
        <div className="space-y-6">
          <div className="h-[2px] w-full bg-zinc-900 overflow-hidden relative">
            <motion.div 
              className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
            />
            {/* Scanning light effect on progress bar */}
            <motion.div 
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-zinc-500 uppercase tracking-[0.3em]">
            <motion.span
              key={status}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-bold"
            >
              {status}
            </motion.span>
            <span className="text-emerald-500/60">{Math.round(progress)}%</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
              className="h-8 bg-emerald-500/5 w-full rounded-sm"
            />
          ))}
        </div>
      </div>

      {/* Background Data Stream (Cinematic) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex flex-wrap gap-4 p-4 overflow-hidden">
        {isMounted && Array.from({ length: 100 }).map((_, i) => (
          <span key={i} className="text-[8px] text-emerald-500 whitespace-nowrap">
            {Math.random().toString(16).substring(2, 10)}
          </span>
        ))}
      </div>
    </motion.div>
  );
};
