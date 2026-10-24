'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  Crown,
  Terminal,
  Feather,
  Sparkles,
  Ghost,
  Zap,
  Keyboard,
  Award,
  Check,
} from 'lucide-react';
import { UserProfile } from '@/types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
}

export const AVATAR_ICONS = [
  { id: 'crown', label: 'Crown', icon: Crown },
  { id: 'terminal', label: 'Terminal', icon: Terminal },
  { id: 'feather', label: 'Feather', icon: Feather },
  { id: 'sparkle', label: 'Sparkle', icon: Sparkles },
  { id: 'ghost', label: 'Ghost', icon: Ghost },
  { id: 'zap', label: 'Zap', icon: Zap },
  { id: 'keyboard', label: 'Keyboard', icon: Keyboard },
  { id: 'award', label: 'Award', icon: Award },
] as const;

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);

  React.useEffect(() => {
    setFormData(profile);
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150 select-none">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[var(--bg-color)] border border-[var(--sub-color)]/25 rounded-3xl p-6 shadow-2xl flex flex-col gap-6 text-[var(--text-color)] font-mono">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--sub-color)]/20 pb-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[var(--main-color)]" />
            <h2 className="text-lg font-bold tracking-tight">Edit Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[var(--sub-alt-color)] text-[var(--sub-color)] hover:text-[var(--text-color)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--sub-color)] font-semibold mb-2">
              Choose Avatar
            </label>
            <div className="grid grid-cols-4 gap-2">
              {AVATAR_ICONS.map((item) => {
                const IconComponent = item.icon;
                const isSelected = formData.avatar === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        avatar: item.id as UserProfile['avatar'],
                      }))
                    }
                    className={`flex flex-col items-center justify-center py-3 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-[var(--main-color)] text-[var(--bg-color)] border-transparent font-bold shadow-md'
                        : 'bg-[var(--sub-alt-color)] text-[var(--sub-color)] hover:text-[var(--text-color)] border-[var(--sub-color)]/20 hover:border-[var(--main-color)]/40'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 mb-1" />
                    <span className="text-[10px]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--sub-color)] font-semibold mb-1.5">
              Username
            </label>
            <input
              type="text"
              required
              maxLength={24}
              value={formData.username}
              onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
              placeholder="e.g. Typist"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--sub-alt-color)] border border-[var(--sub-color)]/20 text-sm text-[var(--text-color)] placeholder-[var(--sub-color)]/50 focus:outline-none focus:border-[var(--main-color)] transition-colors"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--sub-color)] font-semibold mb-1.5">
              Bio / Tagline
            </label>
            <input
              type="text"
              maxLength={100}
              value={formData.bio}
              onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
              placeholder="Short bio about your typing journey"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--sub-alt-color)] border border-[var(--sub-color)]/20 text-sm text-[var(--text-color)] placeholder-[var(--sub-color)]/50 focus:outline-none focus:border-[var(--main-color)] transition-colors"
            />
          </div>

          {/* Keyboard / Gear */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--sub-color)] font-semibold mb-1.5">
              Keyboard Setup
            </label>
            <input
              type="text"
              maxLength={60}
              value={formData.keyboard}
              onChange={(e) => setFormData((prev) => ({ ...prev, keyboard: e.target.value }))}
              placeholder="e.g. Vintage Typewriter · Cherry MX Blue"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--sub-alt-color)] border border-[var(--sub-color)]/20 text-sm text-[var(--text-color)] placeholder-[var(--sub-color)]/50 focus:outline-none focus:border-[var(--main-color)] transition-colors"
            />
          </div>

          {/* Layout & Goals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--sub-color)] font-semibold mb-1.5">
                Layout
              </label>
              <select
                value={formData.layout}
                onChange={(e) => setFormData((prev) => ({ ...prev, layout: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--sub-alt-color)] border border-[var(--sub-color)]/20 text-xs text-[var(--text-color)] focus:outline-none focus:border-[var(--main-color)] transition-colors"
              >
                <option value="QWERTY">QWERTY</option>
                <option value="Dvorak">Dvorak</option>
                <option value="Colemak">Colemak</option>
                <option value="Workman">Workman</option>
                <option value="AZERTY">AZERTY</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--sub-color)] font-semibold mb-1.5">
                Target WPM
              </label>
              <input
                type="number"
                min={20}
                max={300}
                value={formData.targetWpm}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    targetWpm: Math.max(1, parseInt(e.target.value) || 100),
                  }))
                }
                className="w-full px-3.5 py-2 rounded-xl bg-[var(--sub-alt-color)] border border-[var(--sub-color)]/20 text-xs text-[var(--text-color)] focus:outline-none focus:border-[var(--main-color)] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--sub-color)] font-semibold mb-1.5">
                Target Acc %
              </label>
              <input
                type="number"
                min={80}
                max={100}
                value={formData.targetAccuracy}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    targetAccuracy: Math.min(100, Math.max(1, parseInt(e.target.value) || 98)),
                  }))
                }
                className="w-full px-3.5 py-2 rounded-xl bg-[var(--sub-alt-color)] border border-[var(--sub-color)]/20 text-xs text-[var(--text-color)] focus:outline-none focus:border-[var(--main-color)] transition-colors"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-[var(--sub-color)]/20 pt-4 flex items-center justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--sub-color)] hover:text-[var(--text-color)] hover:bg-[var(--sub-alt-color)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[var(--main-color)] text-[var(--bg-color)] font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
