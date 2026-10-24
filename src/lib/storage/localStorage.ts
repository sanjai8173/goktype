import { TestResult, UserSettings } from '@/types';

const SETTINGS_KEY = 'goktype_settings_v1';
const RESULTS_KEY = 'goktype_results_v1';
const PBS_KEY = 'goktype_pbs_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'gok',
  soundPack: 'thock',
  soundVolume: 0.6,
  caretStyle: 'line',
  showHandsPreview: true,
  showKeyboard: true,
  punctuation: false,
  numbers: false,
  quickRestart: 'tab',
  confidenceMode: 'off',
  fontFamily: 'JetBrains Mono',
};

export function loadSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings to localStorage', e);
  }
}

export function loadTestResults(): TestResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RESULTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveTestResult(result: TestResult): { isPb: boolean; previousPb: number | null } {
  if (typeof window === 'undefined') return { isPb: false, previousPb: null };
  try {
    const results = loadTestResults();
    const pbs = loadPersonalBests();
    const pbKey = `${result.mode}_${result.modeConfig}_${result.punctuation ? 'punct' : 'norm'}_${result.numbers ? 'num' : 'norm'}`;

    const prevPb = pbs[pbKey] || null;
    const isPb = !prevPb || result.wpm > prevPb.wpm;

    result.isPb = isPb;
    results.unshift(result);

    // Keep last 100 results to avoid quota overflow
    if (results.length > 100) {
      results.length = 100;
    }

    if (isPb) {
      pbs[pbKey] = result;
      localStorage.setItem(PBS_KEY, JSON.stringify(pbs));
    }

    localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
    return { isPb, previousPb: prevPb ? prevPb.wpm : null };
  } catch (e) {
    console.error('Error saving test result to localStorage', e);
    return { isPb: false, previousPb: null };
  }
}

export function loadPersonalBests(): Record<string, TestResult> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(PBS_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(RESULTS_KEY);
    localStorage.removeItem(PBS_KEY);
  } catch (e) {
    console.error('Error clearing history', e);
  }
}
