'use client';

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import Link from "next/link";
import { CONFIG } from "@/lib/constants";

export const CTA = () => {
  return (
    <section className="py-64 px-6 relative overflow-hidden border-t border-zinc-900/50">
      <div className="absolute inset-0 bg-emerald-500/5 z-0" />
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="space-y-12"
        >
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-none">
            Let&apos;s Build <br />
            <span className="text-emerald-500">The Future.</span>
          </h2>
          <p className="text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Ready to transform your operational challenges into sovereign digital advantages?
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <Link
              href={`mailto:${CONFIG.email}`}
              className="group flex items-center gap-4 px-12 py-6 rounded-full bg-emerald-500 text-black hover:bg-emerald-400 transition-all duration-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
            >
              <Mail className="w-6 h-6" />
              <span className="text-lg font-bold uppercase tracking-widest">Start Project</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
