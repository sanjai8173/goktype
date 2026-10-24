'use client';

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  ArrowRight,
  Copy,
  Check,
  Trophy,
  Sparkles,
} from 'lucide-react';
import { TestResult } from '@/types';

interface ResultScreenProps {
  result: TestResult;
  onNextTest: () => void;
  onRepeatTest: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  onNextTest,
  onRepeatTest,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (result.isPb) {
      const duration = 2000;
      const end = Date.now() + duration;
      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ['#f5b041', '#ffffff', '#2dd4bf'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ['#f5b041', '#a78bfa', '#f472b6'],
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [result.isPb]);

  const handleCopy = () => {
    const text = `goktype | ${result.mode} ${result.modeConfig}\nWPM: ${result.wpm} | Acc: ${result.accuracy}% | Raw: ${result.rawWpm}\nhttps://github.com/sanjai8173/goktype`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        onNextTest();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNextTest]);

  // Graph
  const timeline = result.timeline || [];
  const maxWpm = Math.max(10, ...timeline.map((t) => Math.max(t.wpm, t.raw)));
  const gW = 600;
  const gH = 140;
  const pad = 24;

  const toX = (idx: number) => pad + (idx / Math.max(1, timeline.length - 1)) * (gW - pad * 2);
  const toY = (val: number) => gH - pad - (val / maxWpm) * (gH - pad * 2);

  const wpmPath = timeline.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)},${toY(pt.wpm)}`).join(' ');
  const rawPath = timeline.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)},${toY(pt.raw)}`).join(' ');
  const areaPath = wpmPath + ` L ${toX(timeline.length - 1)},${gH - pad} L ${pad},${gH - pad} Z`;

  return (
    <div className="w-full max-w-3xl flex flex-col items-center select-none py-4 page-enter">
      {/* PB Banner */}
      {result.isPb && (
        <div className="anim-slide-up anim-delay-1 flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--main-color)] text-[var(--bg-color)] font-mono font-bold text-xs shadow-lg shadow-[var(--main-color)]/20 mb-8">
          <Trophy className="w-3.5 h-3.5" />
          New Personal Best!
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      )}

      {/* Big stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-6 w-full mb-10">
        {[
          { label: 'wpm', value: result.wpm, big: true },
          { label: 'acc', value: `${result.accuracy}%`, big: true },
          { label: 'raw', value: result.rawWpm, big: false },
          { label: 'consistency', value: `${result.consistency}%`, big: false },
        ].map((stat, idx) => (
          <div key={stat.label} className={`anim-slide-up anim-delay-${idx + 1} flex flex-col`}>
            <span className="text-[11px] uppercase tracking-widest font-mono text-[var(--sub-color)] font-semibold mb-1">
              {stat.label}
            </span>
            <span
              className={`font-mono font-black tracking-tight leading-none ${
                stat.big
                  ? 'text-5xl md:text-6xl text-[var(--main-color)]'
                  : 'text-4xl md:text-5xl text-[var(--text-color)]/70'
              }`}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Graph */}
      {timeline.length > 1 && (
        <div className="anim-slide-up anim-delay-4 w-full bg-[var(--sub-alt-color)]/40 border border-[var(--sub-color)]/10 rounded-2xl p-4 mb-8">
          <div className="flex items-center justify-between text-[10px] font-mono text-[var(--sub-color)] mb-2 px-1">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="w-3 h-[2px] rounded-full bg-[var(--main-color)] inline-block" />
                wpm
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-[2px] rounded-full bg-[var(--sub-color)] inline-block" />
                raw
              </span>
            </div>
          </div>

          <svg viewBox={`0 0 ${gW} ${gH}`} className="w-full h-36">
            {/* Grid */}
            {[0.25, 0.5, 0.75].map((frac) => (
              <line
                key={frac}
                x1={pad} y1={pad + frac * (gH - pad * 2)}
                x2={gW - pad} y2={pad + frac * (gH - pad * 2)}
                stroke="var(--sub-color)" strokeOpacity="0.08" strokeDasharray="4 6"
              />
            ))}
            <line x1={pad} y1={gH - pad} x2={gW - pad} y2={gH - pad} stroke="var(--sub-color)" strokeOpacity="0.15" />

            {/* Area fill */}
            <path d={areaPath} fill="var(--main-color)" fillOpacity="0.06" />

            {/* Raw line */}
            <path d={rawPath} fill="none" stroke="var(--sub-color)" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" strokeLinejoin="round" />

            {/* WPM line */}
            <path d={wpmPath} fill="none" stroke="var(--main-color)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Error dots */}
            {timeline.map((pt, idx) => {
              if (pt.errors <= 0) return null;
              return (
                <circle key={idx} cx={toX(idx)} cy={toY(pt.wpm)} r="3" fill="var(--error-color)" stroke="var(--bg-color)" strokeWidth="1.5" />
              );
            })}
          </svg>
        </div>
      )}

      {/* Metadata */}
      <div className="anim-slide-up anim-delay-5 grid grid-cols-2 md:grid-cols-4 gap-3 w-full p-3 rounded-xl bg-[var(--sub-alt-color)]/20 border border-[var(--sub-color)]/8 font-mono text-[11px] mb-8">
        <div>
          <span className="text-[var(--sub-color)] block text-[10px] mb-0.5">test type</span>
          <span className="text-[var(--text-color)] font-semibold capitalize">
            {result.mode} {result.modeConfig}
            {result.punctuation && ' · punct'}
            {result.numbers && ' · num'}
          </span>
        </div>
        <div>
          <span className="text-[var(--sub-color)] block text-[10px] mb-0.5">characters</span>
          <span className="text-[var(--text-color)] font-semibold">
            <span className="text-[var(--main-color)]">{result.characters.correct}</span>
            {' / '}
            <span className="text-[var(--error-color)]">{result.characters.incorrect}</span>
            {' / '}
            <span className="text-[var(--sub-color)]">{result.characters.extra}</span>
            {' / '}
            <span className="text-[var(--sub-color)]">{result.characters.missed}</span>
          </span>
        </div>
        <div>
          <span className="text-[var(--sub-color)] block text-[10px] mb-0.5">time</span>
          <span className="text-[var(--text-color)] font-semibold">{result.duration}s</span>
        </div>
        <div>
          <span className="text-[var(--sub-color)] block text-[10px] mb-0.5">branding</span>
          <span className="text-[var(--main-color)] font-semibold">goktype</span>
        </div>
      </div>

      {/* Actions */}
      <div className="anim-slide-up anim-delay-6 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={onNextTest}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--main-color)] text-[var(--bg-color)] font-mono font-bold text-sm shadow-md shadow-[var(--main-color)]/15 hover:shadow-lg hover:shadow-[var(--main-color)]/25 active:scale-95 transition-all duration-150"
        >
          <ArrowRight className="w-4 h-4" />
          Next Test
        </button>

        <button
          onClick={onRepeatTest}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--sub-alt-color)] text-[var(--text-color)] border border-[var(--sub-color)]/15 font-mono font-medium text-sm hover:border-[var(--main-color)]/30 hover:text-[var(--main-color)] active:scale-95 transition-all duration-150"
        >
          <RotateCcw className="w-4 h-4" />
          Repeat
        </button>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--sub-alt-color)] text-[var(--text-color)] border border-[var(--sub-color)]/15 font-mono font-medium text-sm hover:border-[var(--main-color)]/30 hover:text-[var(--main-color)] active:scale-95 transition-all duration-150"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <p className="text-[10px] font-mono text-[var(--sub-color)]/50 mt-4">
        press <kbd className="px-1 py-0.5 rounded bg-[var(--sub-alt-color)] text-[var(--text-color)]/50 text-[9px]">tab</kbd> or <kbd className="px-1 py-0.5 rounded bg-[var(--sub-alt-color)] text-[var(--text-color)]/50 text-[9px]">enter</kbd> for next test
      </p>
    </div>
  );
};
