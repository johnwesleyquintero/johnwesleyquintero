'use client';

import { motion } from "framer-motion";
import { useState } from "react";

export const GlitchText = ({ text, className }: { text: string; className?: string }) => {
  const [delays] = useState(() => ({
    main: Math.random() * 8 + 4, // Slower, less frequent main glitches
    red: Math.random() * 6 + 3,
    blue: Math.random() * 7 + 3
  }));

  return (
    <div className={`relative inline-block group ${className}`}>
      {/* Base Anchor Layer - Always visible, solid, low opacity to maintain legibility during glitch */}
      <span className="absolute inset-0 z-0 block text-zinc-500/20 pointer-events-none select-none">
        {text}
      </span>

      {/* Main Stable Text - Ensuring visibility */}
      <span className="relative z-10 block opacity-100">
        {text}
      </span>

      {/* Decorative Glitch Layers */}
      <motion.span
        animate={{
          opacity: [0, 0.4, 0, 0.2, 0],
          x: [0, -4, 4, -2, 0],
          skewX: [0, 5, -5, 2, 0],
        }}
        transition={{
          duration: 0.4, // Increased duration for a slower movement
          repeat: Infinity,
          repeatDelay: delays.main,
        }}
        className="absolute inset-0 z-0 text-emerald-500/20 pointer-events-none mix-blend-screen"
      >
        {text}
      </motion.span>

      <motion.span
        animate={{
          opacity: [0, 0.3, 0],
          x: [-3, 3, -3],
          scaleY: [1, 1.2, 1],
        }}
        transition={{
          duration: 0.3, // Slower red shift
          repeat: Infinity,
          repeatDelay: delays.red,
        }}
        className="absolute inset-0 z-0 text-red-500/30 pointer-events-none mix-blend-screen"
      >
        {text}
      </motion.span>

      <motion.span
        animate={{
          opacity: [0, 0.3, 0],
          x: [3, -3, 3],
          scaleY: [1, 0.8, 1],
        }}
        transition={{
          duration: 0.3, // Slower blue shift
          repeat: Infinity,
          repeatDelay: delays.blue,
        }}
        className="absolute inset-0 z-0 text-blue-500/30 pointer-events-none mix-blend-screen"
      >
        {text}
      </motion.span>
    </div>
  );
};
