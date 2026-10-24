'use client';

import React from 'react';
import {
  Keyboard,
  Trophy,
  BarChart3,
  Settings as SettingsIcon,
  Volume2,
  VolumeX,
  Hand,
  Crown,
} from 'lucide-react';
import { UserSettings } from '@/types';

const GithubIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface HeaderProps {
  settings: UserSettings;
  onUpdateSettings: (updater: (prev: UserSettings) => UserSettings) => void;
  onOpenSettings: () => void;
  onOpenStats: () => void;
  onOpenLeaderboard: () => void;
  onResetTest: () => void;
  isTyping?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  onOpenSettings,
  onOpenStats,
  onOpenLeaderboard,
  onResetTest,
  isTyping = false,
}) => {
  const toggleSound = () => {
    onUpdateSettings((prev) => ({
      ...prev,
      soundPack: prev.soundPack === 'off' ? 'thock' : 'off',
    }));
  };

  const toggleHands = () => {
    onUpdateSettings((prev) => ({
      ...prev,
      showHandsPreview: !prev.showHandsPreview,
    }));
  };

  return (
    <header
      className={`w-full max-w-5xl flex items-center justify-between py-4 px-4 select-none transition-all duration-500 ${
        isTyping ? 'opacity-0 pointer-events-none -translate-y-2' : 'opacity-100 translate-y-0'
      }`}
    >
      {/* Brand */}
      <button
        onClick={onResetTest}
        className="group flex items-center gap-2 transition-all duration-200 hover:scale-[1.02] text-left focus:outline-none"
        title="Home"
      >
        <div className="relative w-8 h-8 rounded-lg bg-[var(--main-color)] flex items-center justify-center text-[var(--bg-color)] shadow-md shadow-[var(--main-color)]/15">
          <Crown className="w-4 h-4 fill-current stroke-current" />
        </div>
        <div>
          <span className="font-mono text-xl font-black tracking-tight text-[var(--text-color)] group-hover:text-[var(--main-color)] transition-colors leading-none">
            gok<span className="text-[var(--main-color)]">type</span>
          </span>
        </div>
      </button>

      {/* Nav */}
      <nav className="flex items-center gap-0.5">
        {([
          { icon: Keyboard, action: onResetTest, tip: 'Typing Test', active: false },
          { icon: Trophy, action: onOpenLeaderboard, tip: 'Personal Bests', active: false },
          { icon: BarChart3, action: onOpenStats, tip: 'Statistics', active: false },
        ] as const).map((item, idx) => (
          <button
            key={idx}
            onClick={item.action}
            className="p-2 rounded-lg hover:bg-[var(--sub-alt-color)] text-[var(--sub-color)] hover:text-[var(--main-color)] transition-all duration-150 active:scale-90"
            title={item.tip}
          >
            <item.icon className="w-[18px] h-[18px]" />
          </button>
        ))}

        <div className="w-px h-4 bg-[var(--sub-color)]/15 mx-1" />

        <button
          onClick={toggleSound}
          className={`p-2 rounded-lg transition-all duration-150 active:scale-90 ${
            settings.soundPack !== 'off'
              ? 'text-[var(--main-color)] bg-[var(--main-color)]/10'
              : 'text-[var(--sub-color)] hover:text-[var(--text-color)] hover:bg-[var(--sub-alt-color)]'
          }`}
          title={`Sound: ${settings.soundPack !== 'off' ? settings.soundPack : 'Off'}`}
        >
          {settings.soundPack !== 'off' ? (
            <Volume2 className="w-[18px] h-[18px]" />
          ) : (
            <VolumeX className="w-[18px] h-[18px]" />
          )}
        </button>

        <button
          onClick={toggleHands}
          className={`p-2 rounded-lg transition-all duration-150 active:scale-90 ${
            settings.showHandsPreview
              ? 'text-[var(--main-color)] bg-[var(--main-color)]/10'
              : 'text-[var(--sub-color)] hover:text-[var(--text-color)] hover:bg-[var(--sub-alt-color)]'
          }`}
          title="Finger Guide"
        >
          <Hand className="w-[18px] h-[18px]" />
        </button>

        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg hover:bg-[var(--sub-alt-color)] text-[var(--sub-color)] hover:text-[var(--main-color)] transition-all duration-150 active:scale-90"
          title="Settings"
        >
          <SettingsIcon className="w-[18px] h-[18px]" />
        </button>

        <div className="w-px h-4 bg-[var(--sub-color)]/15 mx-1" />

        <a
          href="https://github.com/sanjai8173/goktype"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg hover:bg-[var(--sub-alt-color)] text-[var(--sub-color)] hover:text-[var(--main-color)] transition-all duration-150 active:scale-90"
          title="GitHub"
        >
          <GithubIcon className="w-[18px] h-[18px]" />
        </a>
      </nav>
    </header>
  );
};
