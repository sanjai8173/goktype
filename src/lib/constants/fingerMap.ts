import { FingerInfo, FingerName } from '@/types';

export const FINGER_DETAILS: Record<FingerName, FingerInfo> = {
  'left-pinky': {
    name: 'left-pinky',
    label: 'Left Pinky',
    hand: 'left',
    color: '#f87171',
  },
  'left-ring': {
    name: 'left-ring',
    label: 'Left Ring',
    hand: 'left',
    color: '#fb923c',
  },
  'left-middle': {
    name: 'left-middle',
    label: 'Left Middle',
    hand: 'left',
    color: '#facc15',
  },
  'left-index': {
    name: 'left-index',
    label: 'Left Index',
    hand: 'left',
    color: '#4ade80',
  },
  'left-thumb': {
    name: 'left-thumb',
    label: 'Left Thumb',
    hand: 'left',
    color: '#38bdf8',
  },
  'right-thumb': {
    name: 'right-thumb',
    label: 'Right Thumb',
    hand: 'right',
    color: '#38bdf8',
  },
  'right-index': {
    name: 'right-index',
    label: 'Right Index',
    hand: 'right',
    color: '#2dd4bf',
  },
  'right-middle': {
    name: 'right-middle',
    label: 'Right Middle',
    hand: 'right',
    color: '#818cf8',
  },
  'right-ring': {
    name: 'right-ring',
    label: 'Right Ring',
    hand: 'right',
    color: '#c084fc',
  },
  'right-pinky': {
    name: 'right-pinky',
    label: 'Right Pinky',
    hand: 'right',
    color: '#f472b6',
  },
};

export interface KeyboardKey {
  code: string;
  char: string;
  shiftChar?: string;
  finger: FingerName;
  width?: number; // relative key width (1 = 1u, 1.5 = 1.5u, etc.)
  isHomeRowGuide?: boolean; // F and J bumps
}

export const KEYBOARD_LAYOUT: KeyboardKey[][] = [
  // Row 1 (Number row)
  [
    { code: 'Backquote', char: '`', shiftChar: '~', finger: 'left-pinky' },
    { code: 'Digit1', char: '1', shiftChar: '!', finger: 'left-pinky' },
    { code: 'Digit2', char: '2', shiftChar: '@', finger: 'left-ring' },
    { code: 'Digit3', char: '3', shiftChar: '#', finger: 'left-middle' },
    { code: 'Digit4', char: '4', shiftChar: '$', finger: 'left-index' },
    { code: 'Digit5', char: '5', shiftChar: '%', finger: 'left-index' },
    { code: 'Digit6', char: '6', shiftChar: '^', finger: 'right-index' },
    { code: 'Digit7', char: '7', shiftChar: '&', finger: 'right-index' },
    { code: 'Digit8', char: '8', shiftChar: '*', finger: 'right-middle' },
    { code: 'Digit9', char: '9', shiftChar: '(', finger: 'right-ring' },
    { code: 'Digit0', char: '0', shiftChar: ')', finger: 'right-pinky' },
    { code: 'Minus', char: '-', shiftChar: '_', finger: 'right-pinky' },
    { code: 'Equal', char: '=', shiftChar: '+', finger: 'right-pinky' },
    { code: 'Backspace', char: 'Backspace', finger: 'right-pinky', width: 2.0 },
  ],
  // Row 2 (Tab / QWERTY)
  [
    { code: 'Tab', char: 'Tab', finger: 'left-pinky', width: 1.5 },
    { code: 'KeyQ', char: 'q', shiftChar: 'Q', finger: 'left-pinky' },
    { code: 'KeyW', char: 'w', shiftChar: 'W', finger: 'left-ring' },
    { code: 'KeyE', char: 'e', shiftChar: 'E', finger: 'left-middle' },
    { code: 'KeyR', char: 'r', shiftChar: 'R', finger: 'left-index' },
    { code: 'KeyT', char: 't', shiftChar: 'T', finger: 'left-index' },
    { code: 'KeyY', char: 'y', shiftChar: 'Y', finger: 'right-index' },
    { code: 'KeyU', char: 'u', shiftChar: 'U', finger: 'right-index' },
    { code: 'KeyI', char: 'i', shiftChar: 'I', finger: 'right-middle' },
    { code: 'KeyO', char: 'o', shiftChar: 'O', finger: 'right-ring' },
    { code: 'KeyP', char: 'p', shiftChar: 'P', finger: 'right-pinky' },
    { code: 'BracketLeft', char: '[', shiftChar: '{', finger: 'right-pinky' },
    { code: 'BracketRight', char: ']', shiftChar: '}', finger: 'right-pinky' },
    { code: 'Backslash', char: '\\', shiftChar: '|', finger: 'right-pinky', width: 1.5 },
  ],
  // Row 3 (Home row ASDF)
  [
    { code: 'CapsLock', char: 'Caps', finger: 'left-pinky', width: 1.75 },
    { code: 'KeyA', char: 'a', shiftChar: 'A', finger: 'left-pinky' },
    { code: 'KeyS', char: 's', shiftChar: 'S', finger: 'left-ring' },
    { code: 'KeyD', char: 'd', shiftChar: 'D', finger: 'left-middle' },
    { code: 'KeyF', char: 'f', shiftChar: 'F', finger: 'left-index', isHomeRowGuide: true },
    { code: 'KeyG', char: 'g', shiftChar: 'G', finger: 'left-index' },
    { code: 'KeyH', char: 'h', shiftChar: 'H', finger: 'right-index' },
    { code: 'KeyJ', char: 'j', shiftChar: 'J', finger: 'right-index', isHomeRowGuide: true },
    { code: 'KeyK', char: 'k', shiftChar: 'K', finger: 'right-middle' },
    { code: 'KeyL', char: 'l', shiftChar: 'L', finger: 'right-ring' },
    { code: 'Semicolon', char: ';', shiftChar: ':', finger: 'right-pinky' },
    { code: 'Quote', char: "'", shiftChar: '"', finger: 'right-pinky' },
    { code: 'Enter', char: 'Enter', finger: 'right-pinky', width: 2.25 },
  ],
  // Row 4 (Bottom row ZXCV)
  [
    { code: 'ShiftLeft', char: 'Shift', finger: 'left-pinky', width: 2.25 },
    { code: 'KeyZ', char: 'z', shiftChar: 'Z', finger: 'left-pinky' },
    { code: 'KeyX', char: 'x', shiftChar: 'X', finger: 'left-ring' },
    { code: 'KeyC', char: 'c', shiftChar: 'C', finger: 'left-middle' },
    { code: 'KeyV', char: 'v', shiftChar: 'V', finger: 'left-index' },
    { code: 'KeyB', char: 'b', shiftChar: 'B', finger: 'left-index' },
    { code: 'KeyN', char: 'n', shiftChar: 'N', finger: 'right-index' },
    { code: 'KeyM', char: 'm', shiftChar: 'M', finger: 'right-index' },
    { code: 'Comma', char: ',', shiftChar: '<', finger: 'right-middle' },
    { code: 'Period', char: '.', shiftChar: '>', finger: 'right-ring' },
    { code: 'Slash', char: '/', shiftChar: '?', finger: 'right-pinky' },
    { code: 'ShiftRight', char: 'Shift', finger: 'right-pinky', width: 2.75 },
  ],
  // Row 5 (Space row)
  [
    { code: 'ControlLeft', char: 'Ctrl', finger: 'left-pinky', width: 1.5 },
    { code: 'AltLeft', char: 'Alt', finger: 'left-thumb', width: 1.25 },
    { code: 'Space', char: ' ', finger: 'right-thumb', width: 7.25 },
    { code: 'AltRight', char: 'Alt', finger: 'right-thumb', width: 1.25 },
    { code: 'ControlRight', char: 'Ctrl', finger: 'right-pinky', width: 1.5 },
  ],
];

// Helper to find finger and key info for any input character
export function getFingerForKey(char: string): FingerInfo | null {
  if (!char) return null;
  if (char === ' ') return FINGER_DETAILS['right-thumb'];

  for (const row of KEYBOARD_LAYOUT) {
    for (const key of row) {
      if (key.char.toLowerCase() === char.toLowerCase() || key.shiftChar === char) {
        return FINGER_DETAILS[key.finger];
      }
    }
  }
  return null;
}

export function getKeyForChar(char: string): KeyboardKey | null {
  if (!char) return null;
  if (char === ' ') {
    return KEYBOARD_LAYOUT[4].find((k) => k.code === 'Space') || null;
  }
  for (const row of KEYBOARD_LAYOUT) {
    for (const key of row) {
      if (key.char.toLowerCase() === char.toLowerCase() || key.shiftChar === char) {
        return key;
      }
    }
  }
  return null;
}
