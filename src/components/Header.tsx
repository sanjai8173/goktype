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
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  onOpenSettings,
  onOpenStats,
  onOpenLeaderboard,
  onResetTest,
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
    <header className="w-full max-w-5xl flex items-center justify-between py-6 px-4 select-none">
      {/* Brand: goktype */}
      <div className="flex items-center gap-3">
        <button
          onClick={onResetTest}
          className="group flex items-center gap-2.5 transition-transform duration-200 hover:scale-105 text-left focus:outline-none"
          title="Restart Test"
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--main-color)] to-[var(--main-color)]/70 flex items-center justify-center text-[var(--bg-color)] shadow-lg shadow-[var(--main-color)]/20">
            <Crown className="w-5 h-5 fill-current stroke-current" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-2xl font-black tracking-tight text-[var(--text-color)] group-hover:text-[var(--main-color)] transition-colors">
                gok<span className="text-[var(--main-color)]">type</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[var(--sub-alt-color)] text-[var(--main-color)] border border-[var(--main-color)]/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-[var(--sub-color)] font-mono tracking-wider -mt-0.5">
              by{' '}
              <a
                href="https://github.com/sanjai8173"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hover:text-[var(--main-color)] transition-colors underline decoration-dotted"
              >
                sanjai8173
              </a>
            </p>
          </div>
        </button>
      </div>

      {/* Navigation & Controls */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={onResetTest}
          className="p-2.5 rounded-xl hover:bg-[var(--sub-alt-color)] text-[var(--sub-color)] hover:text-[var(--main-color)] transition-colors"
          title="Typing Test"
        >
          <Keyboard className="w-5 h-5" />
        </button>

        <button
          onClick={onOpenLeaderboard}
          className="p-2.5 rounded-xl hover:bg-[var(--sub-alt-color)] text-[var(--sub-color)] hover:text-[var(--main-color)] transition-colors"
          title="Personal Bests"
        >
          <Trophy className="w-5 h-5" />
        </button>

        <button
          onClick={onOpenStats}
          className="p-2.5 rounded-xl hover:bg-[var(--sub-alt-color)] text-[var(--sub-color)] hover:text-[var(--main-color)] transition-colors"
          title="Statistics & History"
        >
          <BarChart3 className="w-5 h-5" />
        </button>

        <button
          onClick={toggleSound}
          className={`p-2.5 rounded-xl hover:bg-[var(--sub-alt-color)] transition-colors ${
            settings.soundPack !== 'off'
              ? 'text-[var(--main-color)]'
              : 'text-[var(--sub-color)] hover:text-[var(--text-color)]'
          }`}
          title={`Typing Sounds: ${settings.soundPack !== 'off' ? settings.soundPack : 'Off'}`}
        >
          {settings.soundPack !== 'off' ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>

        <button
          onClick={toggleHands}
          className={`p-2.5 rounded-xl hover:bg-[var(--sub-alt-color)] transition-colors ${
            settings.showHandsPreview
              ? 'text-[var(--main-color)]'
              : 'text-[var(--sub-color)] hover:text-[var(--text-color)]'
          }`}
          title="Toggle Finger Guide & Hands"
        >
          <Hand className="w-5 h-5" />
        </button>

        <button
          onClick={onOpenSettings}
          className="p-2.5 rounded-xl hover:bg-[var(--sub-alt-color)] text-[var(--sub-color)] hover:text-[var(--main-color)] transition-colors"
          title="Settings & Themes"
        >
          <SettingsIcon className="w-5 h-5" />
        </button>

        <div className="w-px h-5 bg-[var(--sub-color)]/20 mx-1" />

        <a
          href="https://github.com/sanjai8173/goktype"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl hover:bg-[var(--sub-alt-color)] text-[var(--sub-color)] hover:text-[var(--main-color)] transition-colors"
          title="GitHub Repo"
        >
          <GithubIcon className="w-5 h-5" />
        </a>
      </div>
    </header>
  );
};
