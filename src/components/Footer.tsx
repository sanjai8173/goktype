'use client';

import React from 'react';
import { Heart } from 'lucide-react';

const GithubIcon = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <footer className="w-full max-w-5xl py-6 px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--sub-color)] border-t border-[var(--sub-color)]/10 select-none mt-auto">
      {/* Shortcuts hint */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <kbd className="px-2 py-0.5 rounded bg-[var(--sub-alt-color)] border border-[var(--sub-color)]/30 text-[var(--text-color)] text-[10px] font-bold">
            tab
          </kbd>
          <span>restart test</span>
        </div>
        <div className="flex items-center gap-1.5">
          <kbd className="px-2 py-0.5 rounded bg-[var(--sub-alt-color)] border border-[var(--sub-color)]/30 text-[var(--text-color)] text-[10px] font-bold">
            esc
          </kbd>
          <span>reset / finish zen</span>
        </div>
      </div>

      {/* Personal Branding */}
      <div className="flex items-center gap-2">
        <span>crafted with</span>
        <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
        <span>by</span>
        <a
          href="https://github.com/sanjai8173"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--main-color)] font-semibold hover:underline"
        >
          sanjai8173
        </a>
        <span>•</span>
        <a
          href="https://github.com/sanjai8173/goktype"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--text-color)] flex items-center gap-1 transition-colors"
        >
          <GithubIcon className="w-3.5 h-3.5" />
          <span>goktype</span>
        </a>
      </div>
    </footer>
  );
};
