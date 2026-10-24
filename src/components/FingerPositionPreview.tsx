'use client';

import React from 'react';
import { FINGER_DETAILS, KEYBOARD_LAYOUT, getKeyForChar } from '@/lib/constants/fingerMap';
import { FingerName } from '@/types';

interface FingerPositionPreviewProps {
  currentChar: string;
  isFocused: boolean;
  showHands: boolean;
  showKeyboard: boolean;
}

export const FingerPositionPreview: React.FC<FingerPositionPreviewProps> = ({
  currentChar,
  isFocused,
  showHands,
  showKeyboard,
}) => {
  const currentKey = getKeyForChar(currentChar);
  const activeFingerName: FingerName | null = currentKey ? currentKey.finger : null;
  const activeFingerInfo = activeFingerName ? FINGER_DETAILS[activeFingerName] : null;

  const displayChar = currentChar === ' ' ? 'Space' : currentChar || '—';

  return (
    <div className="w-full flex flex-col items-center justify-center my-4 transition-all duration-300">
      {/* Target Key & Finger Hint Banner */}
      <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-[var(--sub-alt-color)] border border-[var(--sub-color)]/20 shadow-sm mb-4">
        <span className="text-xs uppercase tracking-wider font-semibold text-[var(--sub-color)]">
          Target Key:
        </span>
        <span className="px-2.5 py-0.5 rounded bg-[var(--bg-color)] border border-[var(--main-color)] font-mono text-sm font-bold text-[var(--main-color)] shadow">
          {displayChar}
        </span>
        {activeFingerInfo && (
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block shadow-sm animate-pulse"
              style={{ backgroundColor: activeFingerInfo.color }}
            />
            <span style={{ color: activeFingerInfo.color }}>
              {activeFingerInfo.label}
            </span>
          </div>
        )}
      </div>

      {/* Virtual Keyboard */}
      {showKeyboard && (
        <div className="p-3 rounded-2xl bg-[var(--sub-alt-color)]/60 border border-[var(--sub-color)]/20 shadow-xl backdrop-blur-sm flex flex-col gap-1.5 max-w-3xl w-full">
          {KEYBOARD_LAYOUT.map((row, rowIdx) => (
            <div key={rowIdx} className="flex justify-center gap-1.5 w-full">
              {row.map((k) => {
                const isTarget = currentKey?.code === k.code;
                const finger = FINGER_DETAILS[k.finger];
                const widthStyle = k.width ? { flexGrow: k.width * 10, flexBasis: `${k.width * 2.5}rem` } : { flexGrow: 10, flexBasis: '2.5rem' };

                return (
                  <div
                    key={k.code}
                    style={{
                      ...widthStyle,
                      borderBottomColor: finger.color,
                    }}
                    className={`h-9 md:h-10 rounded-lg flex flex-col items-center justify-center relative font-mono select-none transition-all duration-150 border-b-2 text-xs md:text-sm font-medium ${
                      isTarget
                        ? 'bg-[var(--main-color)] text-[var(--bg-color)] shadow-lg shadow-[var(--main-color)]/30 scale-105 z-10 font-bold border-b-transparent ring-2 ring-[var(--main-color)] ring-offset-2 ring-offset-[var(--bg-color)] animate-bounce'
                        : 'bg-[var(--bg-color)]/90 text-[var(--text-color)]/80 hover:bg-[var(--sub-alt-color)] hover:text-[var(--text-color)]'
                    }`}
                  >
                    {/* Shift character if available */}
                    {k.shiftChar && (
                      <span className={`text-[9px] leading-tight opacity-60 ${isTarget ? 'text-[var(--bg-color)]' : ''}`}>
                        {k.shiftChar}
                      </span>
                    )}
                    <span className="leading-tight">{k.char}</span>

                    {/* Tactile bumps for F and J home row */}
                    {k.isHomeRowGuide && (
                      <span
                        className={`w-2.5 h-0.5 rounded-full absolute bottom-1.5 ${
                          isTarget ? 'bg-[var(--bg-color)]' : 'bg-[var(--sub-color)]'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* EdClub Style Interactive Hands */}
      {showHands && (
        <div className="flex items-center justify-center gap-8 md:gap-16 mt-4 w-full max-w-2xl">
          {/* Left Hand */}
          <div className="flex flex-col items-center">
            <div className="relative w-44 h-36">
              <svg viewBox="0 0 180 150" className="w-full h-full drop-shadow-md">
                {/* Palm Base */}
                <path
                  d="M 30,110 C 30,140 80,145 105,140 C 130,135 145,100 135,75 L 115,65 L 45,70 Z"
                  fill="var(--sub-alt-color)"
                  stroke="var(--sub-color)"
                  strokeWidth="2"
                  opacity="0.8"
                />

                {/* Left Pinky */}
                <g className={activeFingerName === 'left-pinky' ? 'animate-pulse' : ''}>
                  <rect
                    x="24"
                    y={activeFingerName === 'left-pinky' ? "26" : "32"}
                    width="14"
                    height="50"
                    rx="7"
                    fill={activeFingerName === 'left-pinky' ? FINGER_DETAILS['left-pinky'].color : 'var(--bg-color)'}
                    stroke={FINGER_DETAILS['left-pinky'].color}
                    strokeWidth={activeFingerName === 'left-pinky' ? "3" : "1.5"}
                    className="transition-all duration-150"
                  />
                  <circle
                    cx="31"
                    cy={activeFingerName === 'left-pinky' ? "33" : "39"}
                    r="4"
                    fill={FINGER_DETAILS['left-pinky'].color}
                  />
                </g>

                {/* Left Ring */}
                <g className={activeFingerName === 'left-ring' ? 'animate-pulse' : ''}>
                  <rect
                    x="44"
                    y={activeFingerName === 'left-ring' ? "14" : "20"}
                    width="15"
                    height="60"
                    rx="7.5"
                    fill={activeFingerName === 'left-ring' ? FINGER_DETAILS['left-ring'].color : 'var(--bg-color)'}
                    stroke={FINGER_DETAILS['left-ring'].color}
                    strokeWidth={activeFingerName === 'left-ring' ? "3" : "1.5"}
                    className="transition-all duration-150"
                  />
                  <circle
                    cx="51.5"
                    cy={activeFingerName === 'left-ring' ? "21" : "27"}
                    r="4"
                    fill={FINGER_DETAILS['left-ring'].color}
                  />
                </g>

                {/* Left Middle */}
                <g className={activeFingerName === 'left-middle' ? 'animate-pulse' : ''}>
                  <rect
                    x="65"
                    y={activeFingerName === 'left-middle' ? "8" : "14"}
                    width="16"
                    height="68"
                    rx="8"
                    fill={activeFingerName === 'left-middle' ? FINGER_DETAILS['left-middle'].color : 'var(--bg-color)'}
                    stroke={FINGER_DETAILS['left-middle'].color}
                    strokeWidth={activeFingerName === 'left-middle' ? "3" : "1.5"}
                    className="transition-all duration-150"
                  />
                  <circle
                    cx="73"
                    cy={activeFingerName === 'left-middle' ? "15" : "21"}
                    r="4"
                    fill={FINGER_DETAILS['left-middle'].color}
                  />
                </g>

                {/* Left Index */}
                <g className={activeFingerName === 'left-index' ? 'animate-pulse' : ''}>
                  <rect
                    x="87"
                    y={activeFingerName === 'left-index' ? "16" : "22"}
                    width="16"
                    height="62"
                    rx="8"
                    fill={activeFingerName === 'left-index' ? FINGER_DETAILS['left-index'].color : 'var(--bg-color)'}
                    stroke={FINGER_DETAILS['left-index'].color}
                    strokeWidth={activeFingerName === 'left-index' ? "3" : "1.5"}
                    className="transition-all duration-150"
                  />
                  <circle
                    cx="95"
                    cy={activeFingerName === 'left-index' ? "23" : "29"}
                    r="4"
                    fill={FINGER_DETAILS['left-index'].color}
                  />
                </g>

                {/* Left Thumb */}
                <g className={activeFingerName === 'left-thumb' ? 'animate-pulse' : ''}>
                  <rect
                    x="115"
                    y="55"
                    width="16"
                    height="45"
                    rx="8"
                    transform="rotate(32 123 77)"
                    fill={activeFingerName === 'left-thumb' ? FINGER_DETAILS['left-thumb'].color : 'var(--bg-color)'}
                    stroke={FINGER_DETAILS['left-thumb'].color}
                    strokeWidth={activeFingerName === 'left-thumb' ? "3" : "1.5"}
                    className="transition-all duration-150"
                  />
                  <circle
                    cx="140"
                    cy="65"
                    r="4"
                    fill={FINGER_DETAILS['left-thumb'].color}
                  />
                </g>
              </svg>
            </div>
            <span className="text-[11px] font-mono tracking-wider uppercase font-semibold text-[var(--sub-color)] mt-1">
              Left Hand
            </span>
          </div>

          {/* Right Hand */}
          <div className="flex flex-col items-center">
            <div className="relative w-44 h-36">
              <svg viewBox="0 0 180 150" className="w-full h-full drop-shadow-md">
                {/* Palm Base */}
                <path
                  d="M 150,110 C 150,140 100,145 75,140 C 50,135 35,100 45,75 L 65,65 L 135,70 Z"
                  fill="var(--sub-alt-color)"
                  stroke="var(--sub-color)"
                  strokeWidth="2"
                  opacity="0.8"
                />

                {/* Right Thumb */}
                <g className={activeFingerName === 'right-thumb' ? 'animate-pulse' : ''}>
                  <rect
                    x="49"
                    y="55"
                    width="16"
                    height="45"
                    rx="8"
                    transform="rotate(-32 57 77)"
                    fill={activeFingerName === 'right-thumb' ? FINGER_DETAILS['right-thumb'].color : 'var(--bg-color)'}
                    stroke={FINGER_DETAILS['right-thumb'].color}
                    strokeWidth={activeFingerName === 'right-thumb' ? "3" : "1.5"}
                    className="transition-all duration-150"
                  />
                  <circle
                    cx="40"
                    cy="65"
                    r="4"
                    fill={FINGER_DETAILS['right-thumb'].color}
                  />
                </g>

                {/* Right Index */}
                <g className={activeFingerName === 'right-index' ? 'animate-pulse' : ''}>
                  <rect
                    x="77"
                    y={activeFingerName === 'right-index' ? "16" : "22"}
                    width="16"
                    height="62"
                    rx="8"
                    fill={activeFingerName === 'right-index' ? FINGER_DETAILS['right-index'].color : 'var(--bg-color)'}
                    stroke={FINGER_DETAILS['right-index'].color}
                    strokeWidth={activeFingerName === 'right-index' ? "3" : "1.5"}
                    className="transition-all duration-150"
                  />
                  <circle
                    cx="85"
                    cy={activeFingerName === 'right-index' ? "23" : "29"}
                    r="4"
                    fill={FINGER_DETAILS['right-index'].color}
                  />
                </g>

                {/* Right Middle */}
                <g className={activeFingerName === 'right-middle' ? 'animate-pulse' : ''}>
                  <rect
                    x="99"
                    y={activeFingerName === 'right-middle' ? "8" : "14"}
                    width="16"
                    height="68"
                    rx="8"
                    fill={activeFingerName === 'right-middle' ? FINGER_DETAILS['right-middle'].color : 'var(--bg-color)'}
                    stroke={FINGER_DETAILS['right-middle'].color}
                    strokeWidth={activeFingerName === 'right-middle' ? "3" : "1.5"}
                    className="transition-all duration-150"
                  />
                  <circle
                    cx="107"
                    cy={activeFingerName === 'right-middle' ? "15" : "21"}
                    r="4"
                    fill={FINGER_DETAILS['right-middle'].color}
                  />
                </g>

                {/* Right Ring */}
                <g className={activeFingerName === 'right-ring' ? 'animate-pulse' : ''}>
                  <rect
                    x="121"
                    y={activeFingerName === 'right-ring' ? "14" : "20"}
                    width="15"
                    height="60"
                    rx="7.5"
                    fill={activeFingerName === 'right-ring' ? FINGER_DETAILS['right-ring'].color : 'var(--bg-color)'}
                    stroke={FINGER_DETAILS['right-ring'].color}
                    strokeWidth={activeFingerName === 'right-ring' ? "3" : "1.5"}
                    className="transition-all duration-150"
                  />
                  <circle
                    cx="128.5"
                    cy={activeFingerName === 'right-ring' ? "21" : "27"}
                    r="4"
                    fill={FINGER_DETAILS['right-ring'].color}
                  />
                </g>

                {/* Right Pinky */}
                <g className={activeFingerName === 'right-pinky' ? 'animate-pulse' : ''}>
                  <rect
                    x="142"
                    y={activeFingerName === 'right-pinky' ? "26" : "32"}
                    width="14"
                    height="50"
                    rx="7"
                    fill={activeFingerName === 'right-pinky' ? FINGER_DETAILS['right-pinky'].color : 'var(--bg-color)'}
                    stroke={FINGER_DETAILS['right-pinky'].color}
                    strokeWidth={activeFingerName === 'right-pinky' ? "3" : "1.5"}
                    className="transition-all duration-150"
                  />
                  <circle
                    cx="149"
                    cy={activeFingerName === 'right-pinky' ? "33" : "39"}
                    r="4"
                    fill={FINGER_DETAILS['right-pinky'].color}
                  />
                </g>
              </svg>
            </div>
            <span className="text-[11px] font-mono tracking-wider uppercase font-semibold text-[var(--sub-color)] mt-1">
              Right Hand
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
