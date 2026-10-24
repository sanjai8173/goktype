'use client';

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
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
  onTypingStateChange?: (isTyping: boolean) => void;
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
  onTypingStateChange,
}) => {
  const [words, setWords] = useState<WordInfo[]>([]);
  const [quoteSource, setQuoteSource] = useState<string>('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);

  const [hasStarted, setHasStarted] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(timeOption);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [liveWpm, setLiveWpm] = useState(0);

  // Tracking keystrokes
  const keystrokeStats = useRef({
    correct: 0,
    incorrect: 0,
    extra: 0,
    missed: 0,
    totalKeystrokes: 0,
  });

  const timelineRef = useRef<SecondSnapshot[]>([]);
  const wordsWrapperRef = useRef<HTMLDivElement>(null);
  const wordsInnerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLDivElement>(null);
  const activeLetterRef = useRef<HTMLSpanElement | null>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scrollOffsetRef = useRef(0);

  // Caret coordinates (relative to wordsWrapper)
  const [caretX, setCaretX] = useState(0);
  const [caretY, setCaretY] = useState(0);
  const [caretH, setCaretH] = useState(36);
  const [isCaretMoving, setIsCaretMoving] = useState(false);
  const caretTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    scrollOffsetRef.current = 0;
    setHasStarted(false);
    setCurrentWordIndex(0);
    setCurrentLetterIndex(0);
    setElapsedSeconds(0);
    setTimeLeft(timeOption);
    setLiveWpm(0);
    onTypingStateChange?.(false);

    let rawList: string[] = [];
    let source = '';

    if (mode === 'time') {
      rawList = getRandomWords(200, punctuation, numbers);
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
      letters: w.split('').map((c) => ({ char: c, status: 'pending' as const })),
    }));

    setWords(formatted);

    if (formatted.length > 0 && formatted[0].letters.length > 0) {
      onCurrentCharChange(formatted[0].letters[0].char);
    }

    setTimeout(() => {
      hiddenInputRef.current?.focus();
    }, 50);
  }, [mode, timeOption, wordOption, quoteLength, punctuation, numbers, onCurrentCharChange, onTypingStateChange]);

  useEffect(() => {
    initTest();
  }, [initTest]);

  // Update target char
  useEffect(() => {
    if (words.length > 0 && currentWordIndex < words.length) {
      const curWord = words[currentWordIndex];
      if (currentLetterIndex < curWord.letters.length) {
        onCurrentCharChange(curWord.letters[currentLetterIndex].char);
      } else {
        onCurrentCharChange(' ');
      }
    }
  }, [words, currentWordIndex, currentLetterIndex, onCurrentCharChange]);

  // ── Caret positioning via DOM measurement ──
  const updateCaret = useCallback(() => {
    if (!wordsWrapperRef.current) return;
    const wrapperRect = wordsWrapperRef.current.getBoundingClientRect();

    const el = activeLetterRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      setCaretX(r.left - wrapperRect.left);
      setCaretY(r.top - wrapperRect.top);
      setCaretH(r.height);
    }
  }, []);

  // After every render that changes word/letter index, recompute caret
  useLayoutEffect(() => {
    updateCaret();
  }, [currentWordIndex, currentLetterIndex, words, updateCaret]);

  useEffect(() => {
    window.addEventListener('resize', updateCaret);
    return () => window.removeEventListener('resize', updateCaret);
  }, [updateCaret]);

  // ── Smooth line scrolling ──
  // Monkeytype keeps ~3 lines visible and scrolls when the active word
  // moves past the first visible line.
  useLayoutEffect(() => {
    if (!wordsWrapperRef.current || !activeWordRef.current || !wordsInnerRef.current) return;
    const wrapperRect = wordsWrapperRef.current.getBoundingClientRect();
    const wordRect = activeWordRef.current.getBoundingClientRect();

    // word's top relative to the inner (scrollable) container, accounting
    // for the current scroll offset
    const wordRelativeTop = wordRect.top - wrapperRect.top + scrollOffsetRef.current;

    // Each line is roughly the line-height. We want the active word to stay
    // within the first 1.5 lines (so we see context ahead).
    const lineHeight = caretH * 1.65; // approximate line + gap
    const targetTop = lineHeight * 0.05; // keep active on first line

    if (wordRelativeTop > lineHeight) {
      const newOffset = wordRelativeTop - targetTop;
      scrollOffsetRef.current = newOffset;
      wordsInnerRef.current.style.transform = `translateY(-${newOffset}px)`;
    }
  }, [currentWordIndex, caretH]);

  // ── Caret "moving" state for blink vs smooth ──
  const markCaretMoving = useCallback(() => {
    setIsCaretMoving(true);
    if (caretTimerRef.current) clearTimeout(caretTimerRef.current);
    caretTimerRef.current = setTimeout(() => setIsCaretMoving(false), 800);
  }, []);

  // ── Finish test ──
  const finishTest = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    onTypingStateChange?.(false);

    const duration = mode === 'time' ? timeOption : Math.max(1, elapsedSeconds);
    const stats = keystrokeStats.current;
    const totalChars = stats.correct + stats.incorrect + stats.extra;

    const minutes = Math.max(0.01, duration / 60);
    const wpm = Math.round((stats.correct / 5) / minutes);
    const rawWpm = Math.round((totalChars / 5) / minutes);
    const accuracy = totalChars > 0 ? Math.round((stats.correct / totalChars) * 100) : 0;

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
  }, [mode, timeOption, wordOption, quoteLength, punctuation, numbers, elapsedSeconds, onFinishTest, onTypingStateChange]);

  // ── Timer ──
  useEffect(() => {
    if (!hasStarted) return;

    timerIntervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => {
        const nextSec = prev + 1;

        const stats = keystrokeStats.current;
        const minutes = Math.max(0.01, nextSec / 60);
        const curWpm = Math.round((stats.correct / 5) / minutes);
        const curRaw = Math.round(((stats.correct + stats.incorrect + stats.extra) / 5) / minutes);

        setLiveWpm(curWpm);

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
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [hasStarted, mode, finishTest]);

  // ── Keyboard handler ──
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      initTest();
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      if (mode === 'zen' && hasStarted) {
        finishTest();
      } else {
        initTest();
      }
      return;
    }

    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) return;

    if (!hasStarted) {
      setHasStarted(true);
      onTypingStateChange?.(true);
    }

    markCaretMoving();

    const curWord = words[currentWordIndex];
    if (!curWord) return;

    // SPACE
    if (e.key === ' ') {
      e.preventDefault();
      soundPlayer.playKey(soundPack, soundVolume, true);

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

      if (currentWordIndex >= words.length - 1) {
        finishTest();
        return;
      }

      if ((mode === 'time' || mode === 'zen') && currentWordIndex > words.length - 40) {
        const extraWords = getRandomWords(80, punctuation, numbers).map((w) => ({
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

        if (lastLetter.status === 'extra') {
          nextLetters.splice(currentLetterIndex - 1, 1);
          curWord.letters = nextLetters;
          setWords([...words]);
          setCurrentLetterIndex((prev) => prev - 1);
          return;
        }

        lastLetter.status = 'pending';
        setWords([...words]);
        setCurrentLetterIndex((prev) => prev - 1);
      } else if (currentWordIndex > 0) {
        const prevWord = words[currentWordIndex - 1];
        const hasErrors = prevWord.letters.some(
          (l) => l.status === 'incorrect' || l.status === 'extra'
        );
        if (hasErrors) {
          setCurrentWordIndex((prev) => prev - 1);
          setCurrentLetterIndex(prevWord.letters.length);
        }
      }
      return;
    }

    // CHARACTER
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

        // Update live WPM instantly for responsive feel
        const elapsed = elapsedSeconds || 0.5;
        setLiveWpm(Math.round((keystrokeStats.current.correct / 5) / (elapsed / 60)));

        if (
          currentWordIndex === words.length - 1 &&
          currentLetterIndex + 1 >= curWord.letters.length &&
          (mode === 'words' || mode === 'quote')
        ) {
          finishTest();
        }
      } else {
        soundPlayer.playKey(soundPack, soundVolume, false, true);
        keystrokeStats.current.incorrect++;

        if (currentLetterIndex < curWord.letters.length) {
          curWord.letters[currentLetterIndex].status = 'incorrect';
          setWords([...words]);
          setCurrentLetterIndex((prev) => prev + 1);
        } else {
          keystrokeStats.current.extra++;
          curWord.letters.push({ char: e.key, status: 'extra' });
          setWords([...words]);
          setCurrentLetterIndex((prev) => prev + 1);
        }
      }
    }
  };

  const handleContainerClick = () => {
    hiddenInputRef.current?.focus();
    setIsFocused(true);
  };

  // ── Render ──
  return (
    <div
      onClick={handleContainerClick}
      className="relative w-full max-w-4xl flex flex-col items-center justify-center mt-8 mb-4 cursor-text select-none"
    >
      {/* Hidden input */}
      <input
        ref={hiddenInputRef}
        type="text"
        className="opacity-0 absolute w-0 h-0 pointer-events-none"
        style={{ top: -9999, left: -9999, position: 'fixed' }}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        tabIndex={0}
      />

      {/* ── Live counter row ── */}
      <div className="w-full flex items-center justify-between mb-4 px-1">
        <div className="font-mono text-3xl font-black text-[var(--main-color)] tabular-nums leading-none">
          {mode === 'time' && <span>{timeLeft}</span>}
          {mode === 'words' && (
            <span>
              {currentWordIndex}
              <span className="text-[var(--sub-color)] text-lg font-medium">/{wordOption}</span>
            </span>
          )}
          {mode === 'quote' && hasStarted && (
            <span className="text-xl">{liveWpm} <span className="text-sm text-[var(--sub-color)] font-medium">wpm</span></span>
          )}
          {mode === 'zen' && (
            <span className="text-xl text-[var(--sub-color)] font-medium">zen</span>
          )}
        </div>

        {/* Live WPM (shown during time/words mode while typing) */}
        {hasStarted && (mode === 'time' || mode === 'words') && (
          <div className="font-mono text-sm font-semibold text-[var(--sub-color)] tabular-nums">
            {liveWpm} wpm
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            initTest();
          }}
          className="p-2 rounded-lg hover:bg-[var(--sub-alt-color)] text-[var(--sub-color)] hover:text-[var(--main-color)] transition-all duration-150 active:scale-90"
          title="Restart (Tab)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* ── Words display with 3-line window ── */}
      <div
        ref={wordsWrapperRef}
        className="words-container relative w-full overflow-hidden"
        style={{ height: `${caretH * 3.6}px` }}
      >
        {/* Smooth caret */}
        {isFocused && caretStyle !== 'off' && (
          <div
            style={{
              transform: `translate(${caretX}px, ${caretY}px)`,
              height: `${caretH}px`,
              willChange: 'transform',
            }}
            className={`absolute pointer-events-none z-20 transition-transform duration-75 ease-out ${
              isCaretMoving ? '' : 'caret-blink'
            } ${
              caretStyle === 'line'
                ? 'w-[3px] rounded-full bg-[var(--caret-color)]'
                : caretStyle === 'block'
                ? 'w-[0.65em] bg-[var(--caret-color)]/25 rounded-sm'
                : caretStyle === 'underline'
                ? 'w-[0.65em] border-b-[3px] border-[var(--caret-color)]'
                : caretStyle === 'box'
                ? 'w-[0.65em] border-2 border-[var(--caret-color)] rounded-sm'
                : 'hidden'
            }`}
          />
        )}

        <div
          ref={wordsInnerRef}
          className="flex flex-wrap content-start gap-x-[0.65em] leading-relaxed transition-transform duration-200 ease-out"
          style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.75rem)' }}
        >
          {words.map((word, wIdx) => {
            const isCurrentWord = wIdx === currentWordIndex;
            const isPastWord = wIdx < currentWordIndex;
            // Mark whole past-word as error if it has any incorrect letters
            const wordHasError = isPastWord && word.letters.some(
              (l) => l.status === 'incorrect' || l.status === 'extra'
            );

            return (
              <div
                key={wIdx}
                ref={isCurrentWord ? activeWordRef : null}
                className={`relative whitespace-nowrap font-mono py-[0.15em] transition-opacity duration-200 ${
                  isPastWord ? 'opacity-70' : ''
                } ${wordHasError ? 'border-b-2 border-[var(--error-color)]/50' : ''}`}
              >
                {word.letters.map((letter, lIdx) => {
                  const isCurrentLetter = isCurrentWord && lIdx === currentLetterIndex;

                  return (
                    <span
                      key={lIdx}
                      ref={isCurrentLetter ? activeLetterRef : null}
                      className={`inline-block transition-colors duration-50 ${
                        letter.status === 'correct'
                          ? 'text-[var(--text-color)]'
                          : letter.status === 'incorrect'
                          ? 'text-[var(--error-color)]'
                          : letter.status === 'extra'
                          ? 'text-[var(--error-extra-color)] text-[0.85em]'
                          : isPastWord
                          ? 'text-[var(--sub-color)]'
                          : 'text-[var(--sub-color)]'
                      }`}
                    >
                      {letter.char}
                    </span>
                  );
                })}

                {/* Space caret ref at end of current word */}
                {isCurrentWord && currentLetterIndex >= word.letters.length && (
                  <span ref={activeLetterRef} className="inline-block w-[3px]" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quote source */}
      {mode === 'quote' && quoteSource && (
        <div className="w-full text-right text-xs font-mono text-[var(--sub-color)] italic mt-3 pr-1">
          — {quoteSource}
        </div>
      )}

      {/* ── Focus overlay ── */}
      {!isFocused && (
        <div className="absolute inset-0 bg-[var(--bg-color)]/85 flex items-center justify-center rounded-xl z-30 blur-enter">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[var(--sub-alt-color)] border border-[var(--sub-color)]/20 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-[var(--main-color)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59"
                />
              </svg>
            </div>
            <p className="font-mono text-sm text-[var(--sub-color)] font-medium">
              Click here to focus
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
