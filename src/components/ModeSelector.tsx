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
  disabled?: boolean;
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
  disabled = false,
}) => {
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-2 py-2 px-4 rounded-xl bg-[var(--sub-alt-color)]/70 border border-[var(--sub-color)]/20 shadow-md text-xs font-mono font-medium transition-opacity select-none ${
        disabled ? 'opacity-30 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Punctuation & Numbers */}
      <div className="flex items-center gap-1">
        <button
          onClick={onTogglePunctuation}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all ${
            punctuation
              ? 'bg-[var(--main-color)] text-[var(--bg-color)] font-bold shadow-sm'
              : 'text-[var(--sub-color)] hover:text-[var(--text-color)]'
          }`}
          title="Toggle punctuation"
        >
          <AtSign className="w-3.5 h-3.5" />
          <span>punctuation</span>
        </button>

        <button
          onClick={onToggleNumbers}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all ${
            numbers
              ? 'bg-[var(--main-color)] text-[var(--bg-color)] font-bold shadow-sm'
              : 'text-[var(--sub-color)] hover:text-[var(--text-color)]'
          }`}
          title="Toggle numbers"
        >
          <Hash className="w-3.5 h-3.5" />
          <span>numbers</span>
        </button>
      </div>

      <div className="w-px h-4 bg-[var(--sub-color)]/25 mx-1" />

      {/* Main Modes */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onSelectMode('time')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all ${
            mode === 'time'
              ? 'bg-[var(--main-color)] text-[var(--bg-color)] font-bold shadow-sm'
              : 'text-[var(--sub-color)] hover:text-[var(--text-color)]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>time</span>
        </button>

        <button
          onClick={() => onSelectMode('words')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all ${
            mode === 'words'
              ? 'bg-[var(--main-color)] text-[var(--bg-color)] font-bold shadow-sm'
              : 'text-[var(--sub-color)] hover:text-[var(--text-color)]'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>words</span>
        </button>

        <button
          onClick={() => onSelectMode('quote')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all ${
            mode === 'quote'
              ? 'bg-[var(--main-color)] text-[var(--bg-color)] font-bold shadow-sm'
              : 'text-[var(--sub-color)] hover:text-[var(--text-color)]'
          }`}
        >
          <Quote className="w-3.5 h-3.5" />
          <span>quote</span>
        </button>

        <button
          onClick={() => onSelectMode('zen')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all ${
            mode === 'zen'
              ? 'bg-[var(--main-color)] text-[var(--bg-color)] font-bold shadow-sm'
              : 'text-[var(--sub-color)] hover:text-[var(--text-color)]'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>zen</span>
        </button>
      </div>

      {/* Sub-options */}
      {mode === 'time' && (
        <>
          <div className="w-px h-4 bg-[var(--sub-color)]/25 mx-1" />
          <div className="flex items-center gap-1">
            {([15, 30, 60, 120] as TimeOption[]).map((t) => (
              <button
                key={t}
                onClick={() => onSelectTime(t)}
                className={`px-2 py-1 rounded-md transition-all ${
                  timeOption === t
                    ? 'text-[var(--main-color)] font-bold underline underline-offset-4 decoration-2'
                    : 'text-[var(--sub-color)] hover:text-[var(--text-color)]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </>
      )}

      {mode === 'words' && (
        <>
          <div className="w-px h-4 bg-[var(--sub-color)]/25 mx-1" />
          <div className="flex items-center gap-1">
            {([10, 25, 50, 100] as WordOption[]).map((w) => (
              <button
                key={w}
                onClick={() => onSelectWord(w)}
                className={`px-2 py-1 rounded-md transition-all ${
                  wordOption === w
                    ? 'text-[var(--main-color)] font-bold underline underline-offset-4 decoration-2'
                    : 'text-[var(--sub-color)] hover:text-[var(--text-color)]'
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </>
      )}

      {mode === 'quote' && (
        <>
          <div className="w-px h-4 bg-[var(--sub-color)]/25 mx-1" />
          <div className="flex items-center gap-1">
            {(['short', 'medium', 'long'] as QuoteLength[]).map((len) => (
              <button
                key={len}
                onClick={() => onSelectQuoteLength(len)}
                className={`px-2 py-1 rounded-md capitalize transition-all ${
                  quoteLength === len
                    ? 'text-[var(--main-color)] font-bold underline underline-offset-4 decoration-2'
                    : 'text-[var(--sub-color)] hover:text-[var(--text-color)]'
                }`}
              >
                {len}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
