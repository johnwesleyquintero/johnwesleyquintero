'use client';

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Terminal } from "lucide-react";

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing systems...");
  const hasCompletedRef = useRef(false);

  useEffect(() => {
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
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-6 font-mono"
    >
      <div className="max-w-md w-full space-y-8">
        <div className="flex items-center gap-4 text-emerald-500">
          <Terminal className="w-6 h-6 animate-pulse" />
          <span className="text-xs tracking-[0.3em] uppercase">Wesley_OS v2.2</span>
        </div>
        
        <div className="space-y-4">
          <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500 uppercase tracking-widest">
            <span>{status}</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className="h-px bg-emerald-500/20 w-full"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
