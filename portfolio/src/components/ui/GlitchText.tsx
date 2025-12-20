'use client';

import { motion } from "framer-motion";
import { useState } from "react";

export const GlitchText = ({ text, className }: { text: string; className?: string }) => {
  const [delays] = useState(() => ({
    main: Math.random() * 5 + 2,
    red: Math.random() * 3 + 1,
    blue: Math.random() * 4 + 1
  }));

  return (
    <div className={`relative inline-block ${className}`}>
      <motion.span
        initial={{ opacity: 1 }}
        animate={{
          opacity: [1, 0.8, 1, 0.9, 1],
          x: [0, -1, 1, -1, 0],
          skewX: [0, 2, -2, 1, 0],
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          repeatDelay: delays.main,
        }}
        className="relative z-10 block"
      >
        {text}
      </motion.span>
      <motion.span
        animate={{
          opacity: [0, 0.2, 0],
          x: [-2, 2, -2],
          scaleY: [1, 1.1, 1],
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          repeatDelay: delays.red,
        }}
        className="absolute inset-0 z-0 text-red-500/30 translate-x-[2px] pointer-events-none"
      >
        {text}
      </motion.span>
      <motion.span
        animate={{
          opacity: [0, 0.2, 0],
          x: [2, -2, 2],
          scaleY: [1, 0.9, 1],
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          repeatDelay: delays.blue,
        }}
        className="absolute inset-0 z-0 text-blue-500/30 -translate-x-[2px] pointer-events-none"
      >
        {text}
      </motion.span>
    </div>
  );
};
