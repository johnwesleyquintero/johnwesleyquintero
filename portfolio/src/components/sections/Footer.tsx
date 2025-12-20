'use client';

import Link from "next/link";
import Image from "next/image";
import { CONFIG } from "@/lib/constants";

export const Footer = () => {
  return (
    <footer className="py-24 px-6 border-t border-zinc-900 bg-black relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-16 mb-24">
          <div className="space-y-8">
            <Link href="/">
              <Image src="/logo.svg" alt="Logo" width={48} height={48} className="opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" />
            </Link>
            <p className="text-zinc-600 text-xl italic max-w-sm leading-relaxed">
              &quot;{CONFIG.footerQuote}&quot;
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
            <div className="space-y-6">
              <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.4em]">Social</span>
              <ul className="space-y-4">
                <li><Link href={CONFIG.socials.linkedin} target="_blank" className="text-zinc-400 hover:text-emerald-400 transition-colors font-bold tracking-tight">LinkedIn</Link></li>
                <li><Link href={CONFIG.socials.github} target="_blank" className="text-zinc-400 hover:text-emerald-400 transition-colors font-bold tracking-tight">GitHub</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.4em]">Contact</span>
              <ul className="space-y-4">
                <li><Link href={`mailto:${CONFIG.email}`} className="text-zinc-400 hover:text-emerald-400 transition-colors font-bold tracking-tight">Email</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-zinc-900">
          <p className="text-zinc-600 text-xs font-mono tracking-widest uppercase">
            © {new Date().getFullYear()} {CONFIG.name} | ALL_RIGHTS_RESERVED
          </p>
          <div className="flex gap-8 text-[10px] font-mono text-zinc-700">
            <span>LATENCY: 24ms</span>
            <span>STATUS: OPTIMAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
