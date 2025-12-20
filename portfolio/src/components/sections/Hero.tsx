'use client';

import { motion } from "framer-motion";
import { Linkedin, Github, Sparkles, MoveRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CONFIG } from "@/lib/constants";
import { GlitchText } from "../ui/GlitchText";
import { RevealText } from "../ui/RevealText";

export const Hero = () => {
  return (
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
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <GlitchText 
                  text={CONFIG.name.split(' ').slice(0, -1).join(' ') || CONFIG.name} 
                  className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] bg-gradient-to-b from-white via-white to-zinc-500 bg-clip-text text-transparent" 
                />
              </motion.div>
            </div>
            <div className="overflow-hidden">
              <motion.div 
                className="flex items-center gap-8"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <GlitchText 
                  text={CONFIG.name.split(' ').slice(-1)[0]} 
                  className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] text-white" 
                />
                <motion.span 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
                  className="hidden md:block"
                >
                  <Sparkles className="w-16 h-16 text-emerald-500" />
                </motion.span>
              </motion.div>
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
  );
};
