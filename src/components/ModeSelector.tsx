'use client';

import React from 'react';
import { Clock, Type, Quote, Flame, AtSign, Hash } from 'lucide-react';
import { QuoteLength, TestMode, TimeOption, WordOption } from '@/types';

interface ModeSelectorProps {
  mode: TestMode;
  onSelectMode: (mode: TestMode) => void;
  timeOption: TimeOption;
  onSelectTime: (t: TimeOption) => void;
  wordOption: WordOption;
  onSelectWord: (w: WordOption) => void;
  quoteLength: QuoteLength;
  onSelectQuoteLength: (l: QuoteLength) => void;
  punctuation: boolean;
  onTogglePunctuation: () => void;
  numbers: boolean;
  onToggleNumbers: () => void;
  isTyping?: boolean;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  mode,
  onSelectMode,
  timeOption,
  onSelectTime,
  wordOption,
  onSelectWord,
  quoteLength,
  onSelectQuoteLength,
  punctuation,
  onTogglePunctuation,
  numbers,
  onToggleNumbers,
  isTyping = false,
}) => {
  const Pill = ({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 active:scale-95 ${
        active
          ? 'text-[var(--main-color)] bg-[var(--main-color)]/10'
          : 'text-[var(--sub-color)] hover:text-[var(--text-color)]'
      }`}
    >
      {children}
    </button>
  );

  const SubPill = ({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`px-2 py-1 rounded-md text-xs transition-all duration-150 active:scale-95 ${
        active
          ? 'text-[var(--main-color)] font-bold'
          : 'text-[var(--sub-color)] hover:text-[var(--text-color)]'
      }`}
    >
      {children}
    </button>
  );

  const Sep = () => <div className="w-px h-4 bg-[var(--sub-color)]/15 mx-0.5" />;

  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-1 py-2 px-3 rounded-xl bg-[var(--sub-alt-color)]/50 border border-[var(--sub-color)]/10 font-mono transition-all duration-500 select-none ${
        isTyping
          ? 'opacity-0 pointer-events-none scale-95 -translate-y-2'
          : 'opacity-100 scale-100 translate-y-0'
      }`}
    >
      {/* Punctuation & Numbers */}
      <Pill active={punctuation} onClick={onTogglePunctuation}>
        <AtSign className="w-3 h-3" />
        <span className="hidden sm:inline">punctuation</span>
      </Pill>

      <Pill active={numbers} onClick={onToggleNumbers}>
        <Hash className="w-3 h-3" />
        <span className="hidden sm:inline">numbers</span>
      </Pill>

      <Sep />

      {/* Modes */}
      <Pill active={mode === 'time'} onClick={() => onSelectMode('time')}>
        <Clock className="w-3 h-3" />
        time
      </Pill>

      <Pill active={mode === 'words'} onClick={() => onSelectMode('words')}>
        <Type className="w-3 h-3" />
        words
      </Pill>

      <Pill active={mode === 'quote'} onClick={() => onSelectMode('quote')}>
        <Quote className="w-3 h-3" />
        quote
      </Pill>

      <Pill active={mode === 'zen'} onClick={() => onSelectMode('zen')}>
        <Flame className="w-3 h-3" />
        zen
      </Pill>

      {/* Sub-options */}
      {mode === 'time' && (
        <>
          <Sep />
          {([15, 30, 60, 120] as TimeOption[]).map((t) => (
            <SubPill key={t} active={timeOption === t} onClick={() => onSelectTime(t)}>
              {t}
            </SubPill>
          ))}
        </>
      )}

      {mode === 'words' && (
        <>
          <Sep />
          {([10, 25, 50, 100] as WordOption[]).map((w) => (
            <SubPill key={w} active={wordOption === w} onClick={() => onSelectWord(w)}>
              {w}
            </SubPill>
          ))}
        </>
      )}

      {mode === 'quote' && (
        <>
          <Sep />
          {(['short', 'medium', 'long'] as QuoteLength[]).map((len) => (
            <SubPill key={len} active={quoteLength === len} onClick={() => onSelectQuoteLength(len)}>
              {len}
            </SubPill>
          ))}
        </>
      )}
    </div>
  );
};
