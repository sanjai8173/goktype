'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  ArrowRight,
  Copy,
  Check,
  Trophy,
  Activity,
  Target,
  Sparkles,
} from 'lucide-react';
import { TestResult } from '@/types';

interface ResultScreenProps {
  result: TestResult;
  onNextTest: () => void;
  onRepeatTest: () => void;
  onPracticeErrors?: (words: string[]) => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  onNextTest,
  onRepeatTest,
}) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (result.isPb) {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f5b041', '#ffffff', '#2dd4bf', '#a78bfa'],
      });
    }
  }, [result.isPb]);

  const handleCopy = () => {
    const text = `goktype test completed!\nMode: ${result.mode} ${result.modeConfig}\nWPM: ${result.wpm}\nAccuracy: ${result.accuracy}%\nRaw: ${result.rawWpm}\nConsistency: ${result.consistency}%\nhttps://github.com/sanjai8173/goktype`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard shortcut listener for Tab / Tab+Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        onNextTest();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onNextTest();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNextTest]);

  // Generate SVG path for timeline graph
  const timeline = result.timeline || [];
  const maxWpm = Math.max(10, ...timeline.map((t) => Math.max(t.wpm, t.raw)));
  const graphWidth = 600;
  const graphHeight = 160;
  const padding = 20;

  const pointsWpm = timeline.map((pt, idx) => {
    const x = padding + (idx / Math.max(1, timeline.length - 1)) * (graphWidth - padding * 2);
    const y = graphHeight - padding - (pt.wpm / maxWpm) * (graphHeight - padding * 2);
    return `${x},${y}`;
  });

  const pointsRaw = timeline.map((pt, idx) => {
    const x = padding + (idx / Math.max(1, timeline.length - 1)) * (graphWidth - padding * 2);
    const y = graphHeight - padding - (pt.raw / maxWpm) * (graphHeight - padding * 2);
    return `${x},${y}`;
  });

  return (
    <div className="w-full max-w-4xl flex flex-col items-center animate-in fade-in zoom-in-95 duration-200 select-none py-4">
      {/* New PB Banner */}
      {result.isPb && (
        <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--main-color)] text-[var(--bg-color)] font-mono font-bold text-sm shadow-xl shadow-[var(--main-color)]/25 mb-6 animate-pulse">
          <Trophy className="w-4 h-4 fill-current stroke-current" />
          <span>New Personal Best!</span>
          <Sparkles className="w-4 h-4" />
        </div>
      )}

      {/* Top Banner Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full mb-8">
        {/* WPM */}
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wider font-mono text-[var(--sub-color)] font-semibold">
            wpm
          </span>
          <div className="text-5xl md:text-6xl font-black font-mono tracking-tight text-[var(--main-color)] leading-none mt-1">
            {result.wpm}
          </div>
        </div>

        {/* Accuracy */}
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wider font-mono text-[var(--sub-color)] font-semibold">
            acc
          </span>
          <div className="text-5xl md:text-6xl font-black font-mono tracking-tight text-[var(--main-color)] leading-none mt-1">
            {result.accuracy}%
          </div>
        </div>

        {/* Raw WPM */}
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wider font-mono text-[var(--sub-color)] font-semibold">
            raw
          </span>
          <div className="text-4xl md:text-5xl font-bold font-mono tracking-tight text-[var(--text-color)]/70 leading-none mt-1">
            {result.rawWpm}
          </div>
        </div>

        {/* Consistency */}
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wider font-mono text-[var(--sub-color)] font-semibold">
            consistency
          </span>
          <div className="text-4xl md:text-5xl font-bold font-mono tracking-tight text-[var(--text-color)]/70 leading-none mt-1">
            {result.consistency}%
          </div>
        </div>
      </div>

      {/* Graph Card */}
      {timeline.length > 1 && (
        <div className="w-full bg-[var(--sub-alt-color)]/60 border border-[var(--sub-color)]/20 rounded-2xl p-4 mb-8 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--sub-color)] mb-2 px-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded-full bg-[var(--main-color)] inline-block" />
                wpm
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded-full bg-[var(--sub-color)] inline-block" />
                raw
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--error-color)] inline-block" />
                errors
              </span>
            </div>
            <span>peak: {maxWpm} wpm</span>
          </div>

          <div className="w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${graphWidth} ${graphHeight}`}
              className="w-full h-44 drop-shadow"
            >
              {/* Grid lines */}
              <line
                x1={padding}
                y1={padding}
                x2={graphWidth - padding}
                y2={padding}
                stroke="var(--sub-color)"
                strokeOpacity="0.15"
                strokeDasharray="4 4"
              />
              <line
                x1={padding}
                y1={graphHeight / 2}
                x2={graphWidth - padding}
                y2={graphHeight / 2}
                stroke="var(--sub-color)"
                strokeOpacity="0.15"
                strokeDasharray="4 4"
              />
              <line
                x1={padding}
                y1={graphHeight - padding}
                x2={graphWidth - padding}
                y2={graphHeight - padding}
                stroke="var(--sub-color)"
                strokeOpacity="0.25"
              />

              {/* Raw line */}
              <polyline
                fill="none"
                stroke="var(--sub-color)"
                strokeWidth="2"
                strokeOpacity="0.6"
                points={pointsRaw.join(' ')}
              />

              {/* Main WPM line */}
              <polyline
                fill="none"
                stroke="var(--main-color)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsWpm.join(' ')}
              />

              {/* Error dots */}
              {timeline.map((pt, idx) => {
                if (pt.errors <= 0) return null;
                const x = padding + (idx / Math.max(1, timeline.length - 1)) * (graphWidth - padding * 2);
                const y = graphHeight - padding - (pt.wpm / maxWpm) * (graphHeight - padding * 2);
                return (
                  <circle
                    key={idx}
                    cx={x}
                    cy={y}
                    r="3.5"
                    fill="var(--error-color)"
                    stroke="var(--bg-color)"
                    strokeWidth="1.5"
                  />
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {/* Breakdown metadata table */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full p-4 rounded-2xl bg-[var(--sub-alt-color)]/30 border border-[var(--sub-color)]/10 font-mono text-xs mb-8">
        <div>
          <span className="text-[var(--sub-color)] block text-[11px] mb-0.5">test type</span>
          <span className="text-[var(--text-color)] font-semibold capitalize">
            {result.mode} {result.modeConfig}
            {result.punctuation && ', punct'}
            {result.numbers && ', num'}
          </span>
        </div>
        <div>
          <span className="text-[var(--sub-color)] block text-[11px] mb-0.5">characters</span>
          <span className="text-[var(--text-color)] font-semibold">
            <span className="text-[var(--main-color)]">{result.characters.correct}</span> /{' '}
            <span className="text-[var(--error-color)]">{result.characters.incorrect}</span> /{' '}
            <span className="text-[var(--error-extra-color)]">{result.characters.extra}</span> /{' '}
            <span className="text-[var(--sub-color)]">{result.characters.missed}</span>
          </span>
        </div>
        <div>
          <span className="text-[var(--sub-color)] block text-[11px] mb-0.5">time</span>
          <span className="text-[var(--text-color)] font-semibold">
            {result.duration}s
          </span>
        </div>
        <div>
          <span className="text-[var(--sub-color)] block text-[11px] mb-0.5">branding</span>
          <span className="text-[var(--main-color)] font-semibold">
            goktype pro
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onNextTest}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--main-color)] text-[var(--bg-color)] font-mono font-bold text-sm shadow-lg shadow-[var(--main-color)]/25 hover:opacity-90 active:scale-95 transition-all"
          title="Next Test (Tab or Enter)"
        >
          <ArrowRight className="w-4 h-4" />
          <span>Next Test (Tab)</span>
        </button>

        <button
          onClick={onRepeatTest}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--sub-alt-color)] text-[var(--text-color)] hover:text-[var(--main-color)] border border-[var(--sub-color)]/20 font-mono font-medium text-sm hover:border-[var(--main-color)]/40 active:scale-95 transition-all"
          title="Repeat Test"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Repeat</span>
        </button>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--sub-alt-color)] text-[var(--text-color)] hover:text-[var(--main-color)] border border-[var(--sub-color)]/20 font-mono font-medium text-sm hover:border-[var(--main-color)]/40 active:scale-95 transition-all"
          title="Copy Result"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
};
