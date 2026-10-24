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

// Helper to render a single finger
const Finger = ({
  x,
  y,
  width,
  height,
  rx,
  name,
  activeName,
  transform,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number;
  name: FingerName;
  activeName: FingerName | null;
  transform?: string;
}) => {
  const isActive = activeName === name;
  const info = FINGER_DETAILS[name];
  const activeY = isActive ? y - 5 : y;

  return (
    <g className={isActive ? 'finger-tap' : ''}>
      <rect
        x={x}
        y={activeY}
        width={width}
        height={height}
        rx={rx}
        transform={transform}
        fill={isActive ? info.color : 'var(--bg-color)'}
        stroke={info.color}
        strokeWidth={isActive ? 2.5 : 1.2}
        className="transition-all duration-100"
        style={isActive ? { filter: `drop-shadow(0 0 6px ${info.color}60)` } : {}}
      />
      {/* Fingertip dot */}
      <circle
        cx={x + width / 2}
        cy={activeY + rx + 2}
        r={3}
        fill={info.color}
        fillOpacity={isActive ? 1 : 0.6}
        className="transition-all duration-100"
        transform={transform}
      />
    </g>
  );
};

export const FingerPositionPreview: React.FC<FingerPositionPreviewProps> = ({
  currentChar,
  showHands,
  showKeyboard,
}) => {
  const currentKey = getKeyForChar(currentChar);
  const activeFingerName: FingerName | null = currentKey ? currentKey.finger : null;
  const activeFingerInfo = activeFingerName ? FINGER_DETAILS[activeFingerName] : null;

  const displayChar = currentChar === ' ' ? 'Space' : currentChar || '—';

  return (
    <div className="w-full flex flex-col items-center justify-center mt-2 mb-2 transition-all duration-300">
      {/* Target Key Badge — compact inline */}
      <div className="flex items-center gap-2 mb-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--sub-color)] font-semibold">
          Next:
        </span>
        <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-md bg-[var(--sub-alt-color)] border border-[var(--main-color)]/40 font-mono text-sm font-bold text-[var(--main-color)]">
          {displayChar}
        </span>
        {activeFingerInfo && (
          <span className="flex items-center gap-1 text-[10px] font-mono font-medium">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: activeFingerInfo.color }}
            />
            <span style={{ color: activeFingerInfo.color }}>
              {activeFingerInfo.label}
            </span>
          </span>
        )}
      </div>

      {/* Virtual Keyboard — compact */}
      {showKeyboard && (
        <div className="p-2 rounded-xl bg-[var(--sub-alt-color)]/30 border border-[var(--sub-color)]/10 flex flex-col gap-1 max-w-2xl w-full">
          {KEYBOARD_LAYOUT.map((row, rowIdx) => (
            <div key={rowIdx} className="flex justify-center gap-1 w-full">
              {row.map((k) => {
                const isTarget = currentKey?.code === k.code;
                const finger = FINGER_DETAILS[k.finger];
                const widthStyle = k.width
                  ? { flexGrow: k.width * 10, flexBasis: `${k.width * 2.2}rem` }
                  : { flexGrow: 10, flexBasis: '2.2rem' };

                return (
                  <div
                    key={k.code}
                    style={{
                      ...widthStyle,
                      borderBottomColor: isTarget ? 'transparent' : finger.color + '40',
                    }}
                    className={`h-7 md:h-8 rounded-md flex items-center justify-center relative font-mono select-none transition-all duration-100 border-b text-[10px] md:text-xs font-medium ${
                      isTarget
                        ? 'bg-[var(--main-color)] text-[var(--bg-color)] font-bold glow-active scale-[1.08] z-10'
                        : 'bg-[var(--bg-color)]/60 text-[var(--sub-color)]/60'
                    }`}
                  >
                    <span className="leading-none">{k.char.length <= 3 ? k.char : k.char[0]}</span>

                    {k.isHomeRowGuide && (
                      <span
                        className={`w-2 h-[2px] rounded-full absolute bottom-1 ${
                          isTarget ? 'bg-[var(--bg-color)]' : 'bg-[var(--sub-color)]/40'
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

      {/* Hands — compact SVG */}
      {showHands && (
        <div className="flex items-start justify-center gap-6 md:gap-10 mt-3 w-full max-w-lg">
          {/* Left Hand */}
          <div className="flex flex-col items-center">
            <svg viewBox="0 0 170 130" className="w-36 h-28">
              {/* Palm */}
              <path
                d="M 28,95 C 28,120 75,125 98,120 C 120,115 132,85 124,65 L 108,58 L 42,62 Z"
                fill="var(--sub-alt-color)"
                stroke="var(--sub-color)"
                strokeWidth="1.5"
                opacity="0.6"
              />
              <Finger x={22} y={30} width={13} height={42} rx={6.5} name="left-pinky" activeName={activeFingerName} />
              <Finger x={40} y={18} width={14} height={52} rx={7} name="left-ring" activeName={activeFingerName} />
              <Finger x={60} y={12} width={15} height={58} rx={7.5} name="left-middle" activeName={activeFingerName} />
              <Finger x={81} y={18} width={15} height={52} rx={7.5} name="left-index" activeName={activeFingerName} />
              <Finger x={108} y={48} width={14} height={38} rx={7} name="left-thumb" activeName={activeFingerName} transform="rotate(30 115 67)" />
            </svg>
            <span className="text-[9px] font-mono tracking-widest uppercase text-[var(--sub-color)] font-semibold">
              Left
            </span>
          </div>

          {/* Right Hand */}
          <div className="flex flex-col items-center">
            <svg viewBox="0 0 170 130" className="w-36 h-28">
              {/* Palm */}
              <path
                d="M 142,95 C 142,120 95,125 72,120 C 50,115 38,85 46,65 L 62,58 L 128,62 Z"
                fill="var(--sub-alt-color)"
                stroke="var(--sub-color)"
                strokeWidth="1.5"
                opacity="0.6"
              />
              <Finger x={48} y={48} width={14} height={38} rx={7} name="right-thumb" activeName={activeFingerName} transform="rotate(-30 55 67)" />
              <Finger x={74} y={18} width={15} height={52} rx={7.5} name="right-index" activeName={activeFingerName} />
              <Finger x={95} y={12} width={15} height={58} rx={7.5} name="right-middle" activeName={activeFingerName} />
              <Finger x={116} y={18} width={14} height={52} rx={7} name="right-ring" activeName={activeFingerName} />
              <Finger x={135} y={30} width={13} height={42} rx={6.5} name="right-pinky" activeName={activeFingerName} />
            </svg>
            <span className="text-[9px] font-mono tracking-widest uppercase text-[var(--sub-color)] font-semibold">
              Right
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
