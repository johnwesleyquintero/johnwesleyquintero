'use client';

import { motion } from "framer-motion";
import { PHILOSOPHY } from "@/lib/constants";

export const Philosophy = () => {
  return (
    <section className="py-32 md:py-64 px-6 bg-black relative overflow-hidden">
      {/* Cinematic Background for Philosophy */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,transparent_0%,#000_100%)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex items-center gap-4"
            >
              <span className="h-px w-12 bg-emerald-500 shadow-[0_0_10px_#10b981]" />
              <span className="text-emerald-500 font-mono text-xs tracking-[0.4em] uppercase">Core_Philosophy</span>
            </motion.div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.9]">
              Engineering <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-800">Independence.</span>
            </h2>
            <div className="relative">
              <div className="absolute -left-6 top-0 bottom-0 w-px bg-zinc-800" />
              <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed max-w-xl font-medium pl-6">
                We don&apos;t just build apps. We architect resilient digital infrastructures that empower scale and operational excellence.
              </p>
            </div>
          </div>
          <div className="grid gap-8">
            {PHILOSOPHY.map((item, idx) => (
              <motion.div 
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.8 }}
                className="group p-8 rounded-3xl bg-zinc-900/20 border border-zinc-800/30 hover:border-emerald-500/40 hover:bg-zinc-900/40 transition-all duration-700 backdrop-blur-sm"
              >
                <div className="flex gap-8 items-start">
                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-emerald-500 group-hover:text-emerald-400 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] group-hover:scale-110 transition-all duration-500">
                    {item.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-emerald-500 transition-colors duration-500">{item.title}</h3>
                    <p className="text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors duration-500">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
