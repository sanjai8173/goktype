import { TestResult, UserProfile, UserSettings } from '@/types';

const SETTINGS_KEY = 'goktype_settings_v1';
const RESULTS_KEY = 'goktype_results_v1';
const PBS_KEY = 'goktype_pbs_v1';
const PROFILE_KEY = 'goktype_profile_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'gok',
  soundPack: 'typewriter',
  soundVolume: 0.7,
  caretStyle: 'line',
  showHandsPreview: false,
  showKeyboard: false,
  punctuation: false,
  numbers: false,
  quickRestart: 'tab',
  confidenceMode: 'off',
  fontFamily: 'JetBrains Mono',
};

export const DEFAULT_PROFILE: UserProfile = {
  username: 'Typist',
  bio: 'Vintage mechanical typewriter typist.',
  keyboard: 'Underwood No. 5 · Cherry MX Blue',
  avatar: 'crown',
  joinedDate: Date.now(),
  targetWpm: 100,
  targetAccuracy: 98,
  layout: 'QWERTY',
};

export function loadUserProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) {
      saveUserProfile(DEFAULT_PROFILE);
      return DEFAULT_PROFILE;
    }
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving profile to localStorage', e);
  }
}

export function loadSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      showHandsPreview: false,
      showKeyboard: false,
    };
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

export function deleteTestResult(id: string): TestResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const results = loadTestResults();
    const updated = results.filter((r) => r.id !== id);
    localStorage.setItem(RESULTS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error deleting test result', e);
    return [];
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
