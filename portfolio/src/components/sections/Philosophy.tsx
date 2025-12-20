'use client';

import { motion } from "framer-motion";
import { PHILOSOPHY } from "@/lib/constants";

export const Philosophy = () => {
  return (
    <section className="py-32 md:py-64 px-6 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex items-center gap-4"
            >
              <span className="h-px w-12 bg-emerald-500" />
              <span className="text-emerald-500 font-mono text-xs tracking-[0.3em] uppercase">Our Ethos</span>
            </motion.div>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-tight">
              Engineering <br />
              <span className="text-emerald-500/50">Independence.</span>
            </h2>
            <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed max-w-xl font-medium">
              We don&apos;t just build apps. We architect resilient digital infrastructures that empower scale and operational excellence.
            </p>
          </div>
          <div className="grid gap-8">
            {PHILOSOPHY.map((item, idx) => (
              <motion.div 
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="group p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 hover:border-emerald-500/30 transition-all duration-500"
              >
                <div className="flex gap-8 items-start">
                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-emerald-500 group-hover:scale-110 transition-transform duration-500">
                    {item.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white tracking-tight">{item.title}</h3>
                    <p className="text-zinc-500 leading-relaxed">{item.desc}</p>
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
