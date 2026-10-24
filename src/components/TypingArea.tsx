'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RotateCcw, MousePointerClick } from 'lucide-react';
import {
  CaretStyle,
  QuoteItem,
  QuoteLength,
  SecondSnapshot,
  SoundPack,
  TestMode,
  TestResult,
  TimeOption,
  WordOption,
} from '@/types';
import { getRandomQuote, getRandomWords } from '@/lib/constants/words';
import { soundPlayer } from '@/lib/sound/soundPlayer';

interface TypingAreaProps {
  mode: TestMode;
  timeOption: TimeOption;
  wordOption: WordOption;
  quoteLength: QuoteLength;
  punctuation: boolean;
  numbers: boolean;
  soundPack: SoundPack;
  soundVolume: number;
  caretStyle: CaretStyle;
  onFinishTest: (result: TestResult) => void;
  onCurrentCharChange: (char: string) => void;
}

interface LetterInfo {
  char: string;
  status: 'pending' | 'correct' | 'incorrect' | 'extra';
}

interface WordInfo {
  original: string;
  letters: LetterInfo[];
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  mode,
  timeOption,
  wordOption,
  quoteLength,
  punctuation,
  numbers,
  soundPack,
  soundVolume,
  caretStyle,
  onFinishTest,
  onCurrentCharChange,
}) => {
  const [words, setWords] = useState<WordInfo[]>([]);
  const [quoteSource, setQuoteSource] = useState<string>('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);

  const [hasStarted, setHasStarted] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(timeOption);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Tracking keystrokes
  const keystrokeStats = useRef({
    correct: 0,
    incorrect: 0,
    extra: 0,
    missed: 0,
    totalKeystrokes: 0,
  });

  const timelineRef = useRef<SecondSnapshot[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeLetterRef = useRef<HTMLSpanElement | null>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Caret coordinates
  const [caretPos, setCaretPos] = useState<{ left: number; top: number; height: number }>({
    left: 0,
    top: 0,
    height: 32,
  });

  // Initialize word list based on mode
  const initTest = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    keystrokeStats.current = {
      correct: 0,
      incorrect: 0,
      extra: 0,
      missed: 0,
      totalKeystrokes: 0,
    };
    timelineRef.current = [];
    setHasStarted(false);
    setCurrentWordIndex(0);
    setCurrentLetterIndex(0);
    setElapsedSeconds(0);
    setTimeLeft(timeOption);

    let rawList: string[] = [];
    let source = '';

    if (mode === 'time') {
      // Generate 120 words for smooth continuous scrolling
      rawList = getRandomWords(120, punctuation, numbers);
    } else if (mode === 'words') {
      rawList = getRandomWords(wordOption, punctuation, numbers);
    } else if (mode === 'quote') {
      const q: QuoteItem = getRandomQuote(quoteLength);
      rawList = q.text.split(' ');
      source = q.source;
    } else if (mode === 'zen') {
      rawList = getRandomWords(200, punctuation, numbers);
    }

    setQuoteSource(source);

    const formatted: WordInfo[] = rawList.map((w) => ({
      original: w,
      letters: w.split('').map((c) => ({ char: c, status: 'pending' })),
    }));

    setWords(formatted);

    // Initial target character
    if (formatted.length > 0 && formatted[0].letters.length > 0) {
      onCurrentCharChange(formatted[0].letters[0].char);
    }

    setTimeout(() => {
      if (hiddenInputRef.current) {
        hiddenInputRef.current.focus();
      }
    }, 50);
  }, [mode, timeOption, wordOption, quoteLength, punctuation, numbers, onCurrentCharChange]);

  useEffect(() => {
    initTest();
  }, [initTest]);

  // Update target char when current word or letter changes
  useEffect(() => {
    if (words.length > 0 && currentWordIndex < words.length) {
      const curWord = words[currentWordIndex];
      if (currentLetterIndex < curWord.letters.length) {
        onCurrentCharChange(curWord.letters[currentLetterIndex].char);
      } else {
        // At the end of the word, expected key is spacebar
        onCurrentCharChange(' ');
      }
    }
  }, [words, currentWordIndex, currentLetterIndex, onCurrentCharChange]);

  // Update Caret Position
  const updateCaret = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();

    if (activeLetterRef.current) {
      const letterRect = activeLetterRef.current.getBoundingClientRect();
      setCaretPos({
        left: letterRect.left - containerRect.left,
        top: letterRect.top - containerRect.top,
        height: letterRect.height,
      });
    }
  }, []);

  useEffect(() => {
    updateCaret();
    window.addEventListener('resize', updateCaret);
    return () => window.removeEventListener('resize', updateCaret);
  }, [currentWordIndex, currentLetterIndex, words, updateCaret]);

  // Finish Test Calculation
  const finishTest = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    const duration = mode === 'time' ? timeOption : Math.max(1, elapsedSeconds);
    const stats = keystrokeStats.current;
    const totalChars = stats.correct + stats.incorrect + stats.extra;

    // Standard Monkeytype calculation: (all typed correct chars / 5) / (duration / 60)
    const minutes = Math.max(0.01, duration / 60);
    const wpm = Math.round((stats.correct / 5) / minutes);
    const rawWpm = Math.round((totalChars / 5) / minutes);
    const accuracy = totalChars > 0 ? Math.round((stats.correct / totalChars) * 100) : 0;

    // Consistency calculation based on timeline standard deviation
    let consistency = 80;
    if (timelineRef.current.length > 2) {
      const wpms = timelineRef.current.map((t) => t.wpm);
      const avg = wpms.reduce((a, b) => a + b, 0) / wpms.length;
      const variance = wpms.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / wpms.length;
      const stdDev = Math.sqrt(variance);
      consistency = Math.max(0, Math.min(100, Math.round(100 - (stdDev / Math.max(1, avg)) * 100)));
    }

    let modeConfig = '';
    if (mode === 'time') modeConfig = `${timeOption}s`;
    else if (mode === 'words') modeConfig = `${wordOption}w`;
    else if (mode === 'quote') modeConfig = quoteLength;
    else if (mode === 'zen') modeConfig = 'zen';

    const result: TestResult = {
      id: `test_${Date.now()}`,
      timestamp: Date.now(),
      wpm,
      rawWpm,
      accuracy,
      consistency,
      characters: {
        correct: stats.correct,
        incorrect: stats.incorrect,
        extra: stats.extra,
        missed: stats.missed,
      },
      mode,
      modeConfig,
      punctuation,
      numbers,
      duration,
      timeline: [...timelineRef.current],
    };

    onFinishTest(result);
  }, [mode, timeOption, wordOption, quoteLength, punctuation, numbers, elapsedSeconds, onFinishTest]);

  // Timer loop
  useEffect(() => {
    if (!hasStarted) return;

    timerIntervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => {
        const nextSec = prev + 1;

        // Take snapshot for timeline graph
        const stats = keystrokeStats.current;
        const minutes = Math.max(0.01, nextSec / 60);
        const curWpm = Math.round((stats.correct / 5) / minutes);
        const curRaw = Math.round(((stats.correct + stats.incorrect + stats.extra) / 5) / minutes);

        timelineRef.current.push({
          second: nextSec,
          wpm: curWpm,
          raw: curRaw,
          errors: stats.incorrect,
        });

        return nextSec;
      });

      if (mode === 'time') {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [hasStarted, mode, finishTest]);

  // Handle typing keydown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Quick restart on Tab
    if (e.key === 'Tab') {
      e.preventDefault();
      initTest();
      return;
    }

    // Escape to finish zen or restart
    if (e.key === 'Escape') {
      e.preventDefault();
      if (mode === 'zen' && hasStarted) {
        finishTest();
      } else {
        initTest();
      }
      return;
    }

    // Ignore modifier keys
    if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta' || e.key === 'CapsLock') {
      return;
    }

    // Start timer on first keypress
    if (!hasStarted) {
      setHasStarted(true);
    }

    const curWord = words[currentWordIndex];
    if (!curWord) return;

    // SPACE: Move to next word
    if (e.key === ' ') {
      e.preventDefault();
      soundPlayer.playKey(soundPack, soundVolume, true);

      // Any untyped letters in this word become missed
      let newWords = [...words];
      let missedCount = 0;
      for (let i = currentLetterIndex; i < curWord.letters.length; i++) {
        if (curWord.letters[i].status === 'pending') {
          curWord.letters[i].status = 'incorrect';
          missedCount++;
        }
      }
      keystrokeStats.current.missed += missedCount;
      keystrokeStats.current.incorrect += missedCount;

      // Check if finished in words / quote mode
      if (currentWordIndex >= words.length - 1) {
        finishTest();
        return;
      }

      // Automatically add more words in time / zen mode if running low
      if ((mode === 'time' || mode === 'zen') && currentWordIndex > words.length - 30) {
        const extraWords = getRandomWords(60, punctuation, numbers).map((w) => ({
          original: w,
          letters: w.split('').map((c) => ({ char: c, status: 'pending' as const })),
        }));
        newWords = [...newWords, ...extraWords];
      }

      setWords(newWords);
      setCurrentWordIndex((prev) => prev + 1);
      setCurrentLetterIndex(0);
      return;
    }

    // BACKSPACE
    if (e.key === 'Backspace') {
      e.preventDefault();
      soundPlayer.playKey(soundPack, soundVolume);

      if (currentLetterIndex > 0) {
        const nextLetters = [...curWord.letters];
        const lastLetter = nextLetters[currentLetterIndex - 1];

        // If extra character, remove it completely
        if (lastLetter.status === 'extra') {
          nextLetters.splice(currentLetterIndex - 1, 1);
          curWord.letters = nextLetters;
          setWords([...words]);
          setCurrentLetterIndex((prev) => prev - 1);
          return;
        }

        // Revert to pending
        lastLetter.status = 'pending';
        setWords([...words]);
        setCurrentLetterIndex((prev) => prev - 1);
      } else if (currentWordIndex > 0) {
        // Can jump back to previous word if it has errors
        const prevWord = words[currentWordIndex - 1];
        const hasErrors = prevWord.letters.some((l) => l.status === 'incorrect' || l.status === 'extra');
        if (hasErrors) {
          setCurrentWordIndex((prev) => prev - 1);
          setCurrentLetterIndex(prevWord.letters.length);
        }
      }
      return;
    }

    // REGULAR CHARACTER KEYPRESS
    if (e.key.length === 1) {
      e.preventDefault();
      keystrokeStats.current.totalKeystrokes++;

      const isMatch =
        currentLetterIndex < curWord.letters.length &&
        curWord.letters[currentLetterIndex].char === e.key;

      if (isMatch) {
        soundPlayer.playKey(soundPack, soundVolume, false, false);
        keystrokeStats.current.correct++;
        curWord.letters[currentLetterIndex].status = 'correct';
        setWords([...words]);
        setCurrentLetterIndex((prev) => prev + 1);

        // Check if finished on last letter of last word
        if (
          currentWordIndex === words.length - 1 &&
          currentLetterIndex + 1 >= curWord.letters.length &&
          (mode === 'words' || mode === 'quote')
        ) {
          finishTest();
        }
      } else {
        // Error keypress
        soundPlayer.playKey(soundPack, soundVolume, false, true);
        keystrokeStats.current.incorrect++;

        if (currentLetterIndex < curWord.letters.length) {
          curWord.letters[currentLetterIndex].status = 'incorrect';
          setWords([...words]);
          setCurrentLetterIndex((prev) => prev + 1);
        } else {
          // Extra characters typed past word length
          keystrokeStats.current.extra++;
          curWord.letters.push({
            char: e.key,
            status: 'extra',
          });
          setWords([...words]);
          setCurrentLetterIndex((prev) => prev + 1);
        }
      }
    }
  };

  // Focus container click handler
  const handleContainerClick = () => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
      setIsFocused(true);
    }
  };

  return (
    <div
      onClick={handleContainerClick}
      className="relative w-full max-w-4xl flex flex-col items-center justify-center my-6 cursor-text select-none min-h-[220px]"
    >
      {/* Hidden input to capture physical keyboard input */}
      <input
        ref={hiddenInputRef}
        type="text"
        className="opacity-0 absolute -top-96 left-0 pointer-events-none"
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoFocus
      />

      {/* Live Counter (Time Left or Word Counter) */}
      <div className="w-full flex items-center justify-between mb-3 px-2 font-mono text-2xl font-bold text-[var(--main-color)]">
        <div>
          {mode === 'time' && (
            <span>{timeLeft}</span>
          )}
          {mode === 'words' && (
            <span>
              {currentWordIndex}/{wordOption}
            </span>
          )}
          {mode === 'quote' && (
            <span className="text-xs uppercase text-[var(--sub-color)]">
              quote mode
            </span>
          )}
          {mode === 'zen' && (
            <span className="text-sm text-[var(--sub-color)]">
              zen: {keystrokeStats.current.correct} chars
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            initTest();
          }}
          className="p-1.5 rounded-lg hover:bg-[var(--sub-alt-color)] text-[var(--sub-color)] hover:text-[var(--main-color)] transition-colors"
          title="Restart Test (Tab)"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Words Container with Monkeytype-style 3-line viewing window */}
      <div
        ref={containerRef}
        className="relative w-full text-2xl md:text-3xl font-mono leading-relaxed tracking-wide h-[130px] overflow-hidden flex flex-wrap content-start gap-x-3 gap-y-2.5 transition-all duration-200"
      >
        {/* Animated Caret */}
        {isFocused && (
          <div
            style={{
              transform: `translate(${caretPos.left}px, ${caretPos.top}px)`,
              height: `${caretPos.height || 32}px`,
            }}
            className={`absolute pointer-events-none transition-transform duration-100 ease-out z-20 ${
              caretStyle === 'line'
                ? 'w-0.5 bg-[var(--caret-color)] rounded-full animate-pulse'
                : caretStyle === 'block'
                ? 'w-4 bg-[var(--caret-color)]/30 rounded -ml-0.5'
                : caretStyle === 'underline'
                ? 'w-4 border-b-2 border-[var(--caret-color)] -ml-0.5 mt-6'
                : caretStyle === 'box'
                ? 'w-4 border-2 border-[var(--caret-color)] rounded -ml-0.5'
                : 'hidden'
            }`}
          />
        )}

        {/* Word Display */}
        {words.map((word, wIdx) => {
          const isCurrentWord = wIdx === currentWordIndex;
          const isPastWord = wIdx < currentWordIndex;

          return (
            <div
              key={wIdx}
              className={`flex items-center relative whitespace-nowrap transition-colors duration-150 ${
                isCurrentWord ? 'text-[var(--text-color)]' : ''
              }`}
            >
              {word.letters.map((letter, lIdx) => {
                const isCurrentLetter = isCurrentWord && lIdx === currentLetterIndex;

                return (
                  <span
                    key={lIdx}
                    ref={isCurrentLetter ? activeLetterRef : null}
                    className={`transition-colors duration-75 relative ${
                      letter.status === 'correct'
                        ? 'text-[var(--text-color)]'
                        : letter.status === 'incorrect'
                        ? 'text-[var(--error-color)] font-semibold underline decoration-2'
                        : letter.status === 'extra'
                        ? 'text-[var(--error-extra-color)] opacity-90'
                        : isPastWord
                        ? 'text-[var(--sub-color)]/50'
                        : 'text-[var(--sub-color)]'
                    }`}
                  >
                    {letter.char}
                  </span>
                );
              })}

              {/* End of word space caret reference */}
              {isCurrentWord && currentLetterIndex >= word.letters.length && (
                <span ref={activeLetterRef} className="w-1 inline-block" />
              )}
            </div>
          );
        })}
      </div>

      {/* Quote Author attribution */}
      {mode === 'quote' && quoteSource && (
        <div className="w-full text-right text-xs font-mono text-[var(--sub-color)] italic mt-2">
          — {quoteSource}
        </div>
      )}

      {/* Blur Overlay: "Click or press any key to focus" */}
      {!isFocused && (
        <div className="absolute inset-0 bg-[var(--bg-color)]/80 backdrop-blur-[2px] flex items-center justify-center rounded-2xl z-30 transition-all duration-200">
          <div className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[var(--sub-alt-color)] border border-[var(--sub-color)]/30 text-[var(--text-color)] font-mono text-sm font-semibold shadow-xl">
            <MousePointerClick className="w-4 h-4 text-[var(--main-color)] animate-bounce" />
            <span>Click or press any key to focus</span>
          </div>
        </div>
      )}
    </div>
  );
};
