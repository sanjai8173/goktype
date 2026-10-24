'use client';

import React from 'react';
import { X, Volume2, Palette, Terminal, Sliders } from 'lucide-react';
import { CaretStyle, SoundPack, ThemeId, UserSettings } from '@/types';
import { THEMES } from '@/lib/constants/themes';
import { soundPlayer } from '@/lib/sound/soundPlayer';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (updater: (prev: UserSettings) => UserSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const testSound = (pack: SoundPack) => {
    soundPlayer.playKey(pack, settings.soundVolume, false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[var(--bg-color)] border border-[var(--sub-color)]/30 rounded-3xl p-6 shadow-2xl flex flex-col gap-6 text-[var(--text-color)] font-mono">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--sub-color)]/20 pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[var(--main-color)]" />
            <h2 className="text-xl font-bold tracking-tight">Settings & Customization</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[var(--sub-alt-color)] text-[var(--sub-color)] hover:text-[var(--text-color)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Picker */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--sub-color)] uppercase tracking-wider">
            <Palette className="w-4 h-4 text-[var(--main-color)]" />
            <span>Theme Selection</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {THEMES.map((t) => {
              const isSelected = settings.theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onUpdateSettings((prev) => ({ ...prev, theme: t.id }))}
                  className={`flex flex-col p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-[var(--main-color)] ring-2 ring-[var(--main-color)]/30 bg-[var(--sub-alt-color)] shadow-md'
                      : 'border-[var(--sub-color)]/20 bg-[var(--sub-alt-color)]/40 hover:border-[var(--sub-color)]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold truncate">{t.name}</span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[var(--main-color)] animate-ping" />
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-4 h-4 rounded-full border border-black/20 shadow-sm"
                      style={{ backgroundColor: t.bg }}
                      title="Background"
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-black/20 shadow-sm"
                      style={{ backgroundColor: t.mainColor }}
                      title="Main Accent"
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-black/20 shadow-sm"
                      style={{ backgroundColor: t.textColor }}
                      title="Text Color"
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-black/20 shadow-sm"
                      style={{ backgroundColor: t.errorColor }}
                      title="Error Color"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sound Effects */}
        <div className="flex flex-col gap-3 border-t border-[var(--sub-color)]/20 pt-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--sub-color)] uppercase tracking-wider">
            <Volume2 className="w-4 h-4 text-[var(--main-color)]" />
            <span>Typing Sound Effects</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(
              [
                { id: 'thock', label: 'Holy Panda (Thock)' },
                { id: 'mechanical', label: 'Cherry MX Blue' },
                { id: 'tactile', label: 'Cherry MX Brown' },
                { id: 'typewriter', label: 'Vintage Typewriter' },
                { id: 'pop', label: 'Bubble Pop' },
                { id: 'beep', label: '8-Bit Synth' },
                { id: 'off', label: 'Muted / Off' },
              ] as { id: SoundPack; label: string }[]
            ).map((s) => {
              const isSelected = settings.soundPack === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    onUpdateSettings((prev) => ({ ...prev, soundPack: s.id }));
                    if (s.id !== 'off') testSound(s.id);
                  }}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                    isSelected
                      ? 'bg-[var(--main-color)] text-[var(--bg-color)] border-transparent font-bold shadow-md'
                      : 'bg-[var(--sub-alt-color)] text-[var(--text-color)] border-[var(--sub-color)]/20 hover:border-[var(--main-color)]/40'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* Volume Slider */}
          {settings.soundPack !== 'off' && (
            <div className="flex items-center gap-4 bg-[var(--sub-alt-color)]/50 p-3 rounded-xl border border-[var(--sub-color)]/20 mt-1">
              <span className="text-xs text-[var(--sub-color)] whitespace-nowrap">
                Volume: {Math.round(settings.soundVolume * 100)}%
              </span>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={settings.soundVolume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onUpdateSettings((prev) => ({ ...prev, soundVolume: val }));
                  testSound(settings.soundPack);
                }}
                className="w-full accent-[var(--main-color)] cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Caret Style & Appearance */}
        <div className="flex flex-col gap-3 border-t border-[var(--sub-color)]/20 pt-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--sub-color)] uppercase tracking-wider">
            <Terminal className="w-4 h-4 text-[var(--main-color)]" />
            <span>Caret Style</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {(['line', 'block', 'underline', 'box'] as CaretStyle[]).map((c) => {
              const isSelected = settings.caretStyle === c;
              return (
                <button
                  key={c}
                  onClick={() => onUpdateSettings((prev) => ({ ...prev, caretStyle: c }))}
                  className={`px-3 py-2 rounded-xl border text-xs capitalize transition-all ${
                    isSelected
                      ? 'bg-[var(--main-color)] text-[var(--bg-color)] border-transparent font-bold'
                      : 'bg-[var(--sub-alt-color)] text-[var(--text-color)] border-[var(--sub-color)]/20'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--sub-color)]/20 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[var(--main-color)] text-[var(--bg-color)] font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
