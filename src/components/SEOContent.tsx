'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Keyboard, BookOpen, Award, Sparkles, HelpCircle } from 'lucide-react';

export const SEOContent: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section
      aria-label="About GokType Touch Typing Practice and SEO Guide"
      className="w-full max-w-4xl mt-12 mb-8 px-4 font-mono select-none"
    >
      {/* Toggle button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--sub-alt-color)]/50 border border-[var(--sub-color)]/20 text-xs text-[var(--sub-color)] hover:text-[var(--text-color)] hover:border-[var(--main-color)]/30 transition-all"
          aria-expanded={isExpanded}
        >
          <BookOpen className="w-3.5 h-3.5 text-[var(--main-color)]" />
          <span>{isExpanded ? 'Hide Touch Typing Guide & FAQs' : 'Touch Typing Guide, WPM Formula & FAQs'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Crawlable content */}
      <div
        className={`transition-all duration-500 overflow-hidden text-xs leading-relaxed text-[var(--sub-color)] ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="p-6 rounded-3xl bg-[var(--sub-alt-color)]/30 border border-[var(--sub-color)]/15 space-y-6">
          {/* Main H1 & Intro */}
          <div>
            <h1 className="text-base font-bold text-[var(--text-color)] mb-2 flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-[var(--main-color)]" />
              GokType — The Minimalist Online Speed Typing Test & Touch Typing Trainer
            </h1>
            <p>
              Welcome to <strong className="text-[var(--text-color)]">GokType</strong> (hosted at{' '}
              <a href="https://typing.gokgok.in" className="text-[var(--main-color)] underline">
                typing.gokgok.in
              </a>
              ), an open-source, client-side typing tutor inspired by Monkeytype and EdClub. Designed
              for programmers, writers, students, and competitive typists, GokType helps you reach 100+
              WPM through tactile audio feedback and real-time finger position guidance.
            </p>
          </div>

          {/* Grid of Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[var(--bg-color)]/60 border border-[var(--sub-color)]/10">
              <h2 className="text-sm font-bold text-[var(--text-color)] mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[var(--main-color)]" />
                Minimalist Distraction-Free Flow
              </h2>
              <p className="text-[11px]">
                Focus purely on your rhythm and muscle memory. GokType features a sleek black and white
                interface with smooth caret transitions, instantaneous live WPM pacing, and automatic 
                line scrolling designed for maximum concentration.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-color)]/60 border border-[var(--sub-color)]/10">
              <h2 className="text-sm font-bold text-[var(--text-color)] mb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[var(--main-color)]" />
                Authentic Mechanical Switch Audio
              </h2>
              <p className="text-[11px]">
                Enjoy zero-latency procedural Web Audio synthesis modeled after Cherry MX Blue, Cherry
                MX Brown, Holy Panda (Thock), vintage typewriters, bubble pops, and retro 8-bit beeps.
                Real physical bottom-out spacebar acoustics and error feedback make every session
                satisfying.
              </p>
            </div>
          </div>

          {/* How WPM is Calculated */}
          <div>
            <h2 className="text-sm font-bold text-[var(--text-color)] mb-1">
              How is WPM (Words Per Minute) Calculated?
            </h2>
            <p className="text-[11px]">
              Standard typing tests define a single &quot;word&quot; as 5 keystrokes (including spaces
              and punctuation). The official mathematical formula used by GokType is:
            </p>
            <div className="my-2 p-3 rounded-xl bg-[var(--bg-color)] border border-[var(--sub-color)]/20 font-mono text-[11px] text-[var(--main-color)]">
              WPM = (All Correct Characters ÷ 5) ÷ (Time Elapsed in Seconds ÷ 60)
            </div>
            <p className="text-[11px]">
              <strong>Raw WPM</strong> includes all keystrokes typed (both correct and errors), while
              <strong> Net WPM</strong> only counts validated correct characters.
            </p>
          </div>

          {/* Touch Typing FAQs */}
          <div>
            <h2 className="text-sm font-bold text-[var(--text-color)] mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[var(--main-color)]" />
              Frequently Asked Questions (FAQs)
            </h2>
            <div className="space-y-3 text-[11px]">
              <div>
                <strong className="text-[var(--text-color)] block">What is the average typing speed?</strong>
                <span>The average typist types at 40 WPM. Professional typists, coders, and gamers typically average between 70 to 120+ WPM with 95%+ accuracy.</span>
              </div>
              <div>
                <strong className="text-[var(--text-color)] block">Is GokType 100% private and offline?</strong>
                <span>Yes! All user data, test history, personal bests, and custom settings are stored strictly in your browser via HTML5 LocalStorage. No user data ever leaves your device.</span>
              </div>
              <div>
                <strong className="text-[var(--text-color)] block">What are the home row keys?</strong>
                <span>Place your left hand fingers on A, S, D, F and your right hand fingers on J, K, L, ;. The physical tactile bumps on F and J help position your index fingers without looking.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
