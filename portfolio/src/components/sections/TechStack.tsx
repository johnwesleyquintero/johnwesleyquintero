'use client';

import { motion } from "framer-motion";
import { CONFIG, TECH_STACK } from "@/lib/constants";

export const TechStack = () => {
  return (
    <section className="py-32 md:py-64 px-6 bg-black relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-32 md:mb-48">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="inline-flex items-center gap-4 mb-8"
          >
            <span className="h-px w-8 bg-emerald-500" />
            <span className="text-emerald-500 font-mono text-xs tracking-[0.3em] uppercase">Core Mastery</span>
            <span className="h-px w-8 bg-emerald-500" />
          </motion.div>
          <h2 className="text-6xl md:text-9xl font-black tracking-tighter text-white">
            {CONFIG.labels.techStackTitle}
          </h2>
        </div>

        <div className="space-y-40">
          {TECH_STACK.map((stack, idx) => (
            <div key={stack.category} className="relative">
              <div className="flex flex-col md:flex-row gap-12 md:gap-32 items-start md:items-center">
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="w-full md:w-1/3"
                >
                  <span className="text-emerald-500 font-mono text-sm tracking-[0.5em] uppercase mb-4 block">0{idx + 1}</span>
                  <h3 className="text-4xl font-bold text-white tracking-tighter mb-4">{stack.category}</h3>
                  <div className="h-1 w-24 bg-emerald-500" />
                </motion.div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                  {stack.items.map((item, itemIdx) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: itemIdx * 0.1 }}
                      className="group p-8 rounded-2xl bg-zinc-900/20 border border-zinc-800/50 hover:bg-zinc-900/50 hover:border-emerald-500/20 transition-all duration-500"
                    >
                      <span className="text-3xl md:text-5xl font-black text-zinc-700 group-hover:text-white transition-colors duration-500 tracking-tighter">
                        {item}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
