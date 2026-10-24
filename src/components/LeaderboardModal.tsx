'use client';

import React from 'react';
import { X, Trophy, Crown, Flame, Award } from 'lucide-react';
import { loadPersonalBests } from '@/lib/storage/localStorage';
import { TestResult } from '@/types';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const pbs: Record<string, TestResult> = loadPersonalBests();

  const standardModes = [
    { label: 'Time 15s', key: 'time_15s_norm_norm' },
    { label: 'Time 30s', key: 'time_30s_norm_norm' },
    { label: 'Time 60s', key: 'time_60s_norm_norm' },
    { label: 'Time 120s', key: 'time_120s_norm_norm' },
    { label: 'Words 10', key: 'words_10w_norm_norm' },
    { label: 'Words 25', key: 'words_25w_norm_norm' },
    { label: 'Words 50', key: 'words_50w_norm_norm' },
    { label: 'Words 100', key: 'words_100w_norm_norm' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150 select-none">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[var(--bg-color)] border border-[var(--sub-color)]/30 rounded-3xl p-6 shadow-2xl flex flex-col gap-6 text-[var(--text-color)] font-mono">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--sub-color)]/20 pb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[var(--main-color)]" />
            <h2 className="text-xl font-bold tracking-tight">Personal Bests</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[var(--sub-alt-color)] text-[var(--sub-color)] hover:text-[var(--text-color)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Branding Callout */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[var(--main-color)]/10 to-transparent border border-[var(--main-color)]/20 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[var(--main-color)] text-[var(--bg-color)]">
            <Crown className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--main-color)]">GokType Hall of Fame</h3>
            <p className="text-xs text-[var(--sub-color)]">
              Your highest achieved speeds across all competitive modes, saved locally.
            </p>
          </div>
        </div>

        {/* Benchmark Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {standardModes.map((item) => {
            const pb = pbs[item.key];
            return (
              <div
                key={item.key}
                className="p-4 rounded-2xl bg-[var(--sub-alt-color)]/50 border border-[var(--sub-color)]/20 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${pb ? 'bg-[var(--main-color)]/20 text-[var(--main-color)]' : 'bg-[var(--sub-color)]/10 text-[var(--sub-color)]'}`}>
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold block text-[var(--text-color)]">{item.label}</span>
                    <span className="text-[10px] text-[var(--sub-color)]">
                      {pb ? `${pb.accuracy}% acc • ${pb.consistency}% const` : 'No score yet'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  {pb ? (
                    <span className="text-2xl font-black text-[var(--main-color)]">
                      {pb.wpm} <span className="text-xs text-[var(--sub-color)] font-normal">WPM</span>
                    </span>
                  ) : (
                    <span className="text-lg font-bold text-[var(--sub-color)]">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--sub-color)]/20 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[var(--main-color)] text-[var(--bg-color)] font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
