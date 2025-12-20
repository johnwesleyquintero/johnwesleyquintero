'use client';

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

interface ScrollIndicatorProps {
  className?: string;
  text?: string;
  accentColor?: string;
  textColor?: string;
  hideOnDesktop?: boolean;
  opacityOverride?: MotionValue<number>;
}

export const ScrollIndicator = ({ 
  className = "", 
  text = "Scroll to explore",
  accentColor = "bg-emerald-500",
  textColor = "text-zinc-500",
  hideOnDesktop = false,
  opacityOverride
}: ScrollIndicatorProps) => {
  const { scrollY } = useScroll();
  const defaultOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const opacity = opacityOverride || defaultOpacity;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      className={`${hideOnDesktop ? 'md:hidden' : ''} ${className}`}
    >
      <motion.div 
        style={{ opacity }}
        className="flex flex-col items-center gap-4 pointer-events-none"
      >
        <span className={`text-[10px] font-mono uppercase tracking-[0.5em] ${textColor}`}>
          {text}
        </span>
        <div className="relative w-px h-12 bg-zinc-800/50 overflow-hidden">
          <motion.div 
            animate={{ 
              y: ["-100%", "100%"],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`absolute inset-0 ${accentColor}`}
          />
        </div>
        {/* Mobile-specific touch indicator */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ 
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`w-1.5 h-1.5 rounded-full ${accentColor} blur-[2px] mt-1`}
        />
      </motion.div>
    </motion.div>
  );
};
