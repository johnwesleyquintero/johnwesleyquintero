'use client';

import { motion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useSpring(0, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(0, { stiffness: 500, damping: 28 });

  useEffect(() => {
    // Check if it's a touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest('a, button, [role="button"], .group, input, select, textarea'));
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleHover);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleHover);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-emerald-500 rounded-full pointer-events-none z-[100] mix-blend-difference hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          scale: isHovering ? 2.5 : 1,
          backgroundColor: isHovering ? "rgba(16, 185, 129, 0.1)" : "transparent",
        }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-1 h-1 bg-emerald-500 rounded-full pointer-events-none z-[101] hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </>
  );
};
