export type TestMode = 'time' | 'words' | 'quote' | 'zen';

export type TimeOption = 15 | 30 | 60 | 120;
export type WordOption = 10 | 25 | 50 | 100;
export type QuoteLength = 'short' | 'medium' | 'long';

export type CaretStyle = 'line' | 'block' | 'underline' | 'box' | 'off';

export type SoundPack = 'off' | 'mechanical' | 'tactile' | 'thock' | 'typewriter' | 'pop' | 'beep';

export type ThemeId =
  | 'gok'
  | 'serika_dark'
  | 'matrix'
  | 'dracula'
  | 'nord'
  | 'carbon'
  | 'cyberpunk'
  | 'chalk'
  | '8008'
  | 'botanical';

export interface Theme {
  id: ThemeId;
  name: string;
  bg: string;
  mainColor: string;
  caretColor: string;
  subColor: string;
  subAltColor: string;
  textColor: string;
  errorColor: string;
  errorExtraColor: string;
}

export type FingerName =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'left-thumb'
  | 'right-thumb'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky';

export interface FingerInfo {
  name: FingerName;
  label: string;
  hand: 'left' | 'right';
  color: string;
}

export interface LetterState {
  char: string;
  status: 'pending' | 'correct' | 'incorrect' | 'extra';
}

export interface WordState {
  original: string;
  letters: LetterState[];
  isCompleted: boolean;
}

export interface SecondSnapshot {
  second: number;
  wpm: number;
  raw: number;
  errors: number;
}

export interface TestResult {
  id: string;
  timestamp: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  characters: {
    correct: number;
    incorrect: number;
    extra: number;
    missed: number;
  };
  mode: TestMode;
  modeConfig: string;
  punctuation: boolean;
  numbers: boolean;
  duration: number;
  timeline: SecondSnapshot[];
  isPb?: boolean;
}

export interface UserSettings {
  theme: ThemeId;
  soundPack: SoundPack;
  soundVolume: number;
  caretStyle: CaretStyle;
  showHandsPreview: boolean;
  showKeyboard: boolean;
  punctuation: boolean;
  numbers: boolean;
  quickRestart: 'tab' | 'esc' | 'off';
  confidenceMode: 'off' | 'on' | 'max';
  fontFamily: 'JetBrains Mono' | 'Roboto Mono' | 'Fira Code' | 'Geist Mono';
}

export interface UserProfile {
  username: string;
  bio: string;
  keyboard: string;
  avatar: 'crown' | 'terminal' | 'feather' | 'sparkle' | 'ghost' | 'zap' | 'keyboard' | 'award';
  joinedDate: number;
  targetWpm: number;
  targetAccuracy: number;
  layout: string;
}

export interface QuoteItem {
  id: number;
  text: string;
  source: string;
  length: QuoteLength;
}
