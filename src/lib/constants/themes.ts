import { Theme, ThemeId } from '@/types';

export const THEMES: Theme[] = [
  {
    id: 'gok',
    name: 'Gok Gold (Signature)',
    bg: '#141419',
    mainColor: '#f5b041',
    caretColor: '#f5b041',
    subColor: '#636573',
    subAltColor: '#1d1e25',
    textColor: '#e8e8ea',
    errorColor: '#ef4444',
    errorExtraColor: '#991b1b',
  },
  {
    id: 'serika_dark',
    name: 'Serika Dark',
    bg: '#323437',
    mainColor: '#e2b714',
    caretColor: '#e2b714',
    subColor: '#646669',
    subAltColor: '#2c2e31',
    textColor: '#d1d0c5',
    errorColor: '#ca4754',
    errorExtraColor: '#7e2a33',
  },
  {
    id: 'matrix',
    name: 'Matrix',
    bg: '#080d08',
    mainColor: '#00ff41',
    caretColor: '#00ff41',
    subColor: '#1c4722',
    subAltColor: '#0f1a10',
    textColor: '#57c768',
    errorColor: '#ff2a2a',
    errorExtraColor: '#8a0000',
  },
  {
    id: 'dracula',
    name: 'Dracula',
    bg: '#282a36',
    mainColor: '#bd93f9',
    caretColor: '#ff79c6',
    subColor: '#6272a4',
    subAltColor: '#21222c',
    textColor: '#f8f8f2',
    errorColor: '#ff5555',
    errorExtraColor: '#9e2222',
  },
  {
    id: 'nord',
    name: 'Nord',
    bg: '#242933',
    mainColor: '#88c0d0',
    caretColor: '#88c0d0',
    subColor: '#4c566a',
    subAltColor: '#1e222b',
    textColor: '#d8dee9',
    errorColor: '#bf616a',
    errorExtraColor: '#73373d',
  },
  {
    id: 'carbon',
    name: 'Carbon',
    bg: '#181b1d',
    mainColor: '#f66e0d',
    caretColor: '#f66e0d',
    subColor: '#535b60',
    subAltColor: '#121415',
    textColor: '#e4e4e4',
    errorColor: '#e04040',
    errorExtraColor: '#8a1f1f',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    bg: '#100b22',
    mainColor: '#00f0ff',
    caretColor: '#ffe600',
    subColor: '#734b99',
    subAltColor: '#1b1433',
    textColor: '#ffe600',
    errorColor: '#ff0055',
    errorExtraColor: '#990033',
  },
  {
    id: 'chalk',
    name: 'Chalk',
    bg: '#1b1d24',
    mainColor: '#f4d06f',
    caretColor: '#f4d06f',
    subColor: '#585e72',
    subAltColor: '#14161b',
    textColor: '#f5f5f5',
    errorColor: '#ff6b6b',
    errorExtraColor: '#9c2424',
  },
  {
    id: '8008',
    name: '8008',
    bg: '#333a45',
    mainColor: '#f44c7f',
    caretColor: '#f44c7f',
    subColor: '#939eae',
    subAltColor: '#2b313b',
    textColor: '#e9ecf0',
    errorColor: '#ff2d55',
    errorExtraColor: '#800f24',
  },
  {
    id: 'botanical',
    name: 'Botanical',
    bg: '#131e18',
    mainColor: '#7ea988',
    caretColor: '#7ea988',
    subColor: '#45594b',
    subAltColor: '#0e1612',
    textColor: '#e1e9e3',
    errorColor: '#e06c75',
    errorExtraColor: '#7f3037',
  },
];

export const getThemeById = (id: ThemeId): Theme => {
  return THEMES.find((t) => t.id === id) || THEMES[0];
};

export const applyThemeToDom = (theme: Theme) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--bg-color', theme.bg);
  root.style.setProperty('--main-color', theme.mainColor);
  root.style.setProperty('--caret-color', theme.caretColor);
  root.style.setProperty('--sub-color', theme.subColor);
  root.style.setProperty('--sub-alt-color', theme.subAltColor);
  root.style.setProperty('--text-color', theme.textColor);
  root.style.setProperty('--error-color', theme.errorColor);
  root.style.setProperty('--error-extra-color', theme.errorExtraColor);
};
