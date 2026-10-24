'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Edit3,
  Calendar,
  Keyboard as KeyboardIcon,
  Crown,
  Terminal,
  Feather,
  Sparkles,
  Ghost,
  Zap,
  Award,
  Target,
  Clock,
  BarChart2,
  Trash2,
  Download,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { TestResult, UserProfile } from '@/types';
import {
  clearHistory,
  deleteTestResult,
  loadPersonalBests,
  loadTestResults,
} from '@/lib/storage/localStorage';
import { EditProfileModal } from './EditProfileModal';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onBackToTest: () => void;
}

const AVATAR_MAP = {
  crown: Crown,
  terminal: Terminal,
  feather: Feather,
  sparkle: Sparkles,
  ghost: Ghost,
  zap: Zap,
  keyboard: KeyboardIcon,
  award: Award,
};

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onUpdateProfile,
  onBackToTest,
}) => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [pbs, setPbs] = useState<Record<string, TestResult>>({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'time' | 'words' | 'quote' | 'zen'>('all');

  React.useEffect(() => {
    setResults(loadTestResults());
    setPbs(loadPersonalBests());
  }, []);

  const totalTests = results.length;
  const totalTimeSeconds = results.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  const highestWpm = results.length > 0 ? Math.max(...results.map((r) => r.wpm)) : 0;
  const avgWpm = results.length > 0 ? Math.round(results.reduce((acc, r) => acc + r.wpm, 0) / results.length) : 0;
  const avgAcc = results.length > 0 ? Math.round(results.reduce((acc, r) => acc + r.accuracy, 0) / results.length) : 0;
  const avgConsistency = results.length > 0 ? Math.round(results.reduce((acc, r) => acc + r.consistency, 0) / results.length) : 0;

  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const remainingSecs = secs % 60;
    if (hours > 0) return `${hours}h ${mins}m ${remainingSecs}s`;
    if (mins > 0) return `${mins}m ${remainingSecs}s`;
    return `${remainingSecs}s`;
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTypistTier = (wpm: number) => {
    if (wpm >= 140) return { title: 'Typing Prodigy', icon: Flame };
    if (wpm >= 120) return { title: 'Grandmaster Typist', icon: Crown };
    if (wpm >= 100) return { title: 'Master Typist', icon: Award };
    if (wpm >= 80) return { title: 'Fast Typist', icon: Zap };
    if (wpm >= 60) return { title: 'Skilled Typist', icon: Target };
    if (wpm >= 40) return { title: 'Novice Typist', icon: Terminal };
    return { title: 'Beginner Typist', icon: Feather };
  };

  const tier = getTypistTier(highestWpm);
  const TierIcon = tier.icon;
  const AvatarIcon = AVATAR_MAP[profile.avatar] || Crown;

  const standardPbs = [
    { label: 'Time 15s', key: 'time_15s_norm_norm' },
    { label: 'Time 30s', key: 'time_30s_norm_norm' },
    { label: 'Time 60s', key: 'time_60s_norm_norm' },
    { label: 'Time 120s', key: 'time_120s_norm_norm' },
    { label: 'Words 10', key: 'words_10w_norm_norm' },
    { label: 'Words 25', key: 'words_25w_norm_norm' },
    { label: 'Words 50', key: 'words_50w_norm_norm' },
    { label: 'Words 100', key: 'words_100w_norm_norm' },
  ];

  const filteredResults = results.filter((r) => {
    if (selectedFilter === 'all') return true;
    return r.mode === selectedFilter;
  });

  const handleDeleteResult = (id: string) => {
    const updated = deleteTestResult(id);
    setResults(updated);
    setPbs(loadPersonalBests());
  };

  const handleClearHistory = () => {
    if (confirm('Clear all your typing test records and personal bests from localStorage?')) {
      clearHistory();
      setResults([]);
      setPbs({});
    }
  };

  const handleExportJson = () => {
    const payload = {
      profile,
      stats: { totalTests, totalTimeSeconds, highestWpm, avgWpm, avgAcc, avgConsistency },
      results,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', `goktype_profile_${profile.username.toLowerCase()}_${Date.now()}.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
  };

  // Progress chart coordinates
  const chartResults = [...results].reverse().slice(-30);
  const chartMaxWpm = Math.max(40, ...chartResults.map((r) => r.wpm));
  const cW = 600;
  const cH = 120;
  const cPad = 20;

  const toChartX = (idx: number) => cPad + (idx / Math.max(1, chartResults.length - 1)) * (cW - cPad * 2);
  const toChartY = (w: number) => cH - cPad - (w / chartMaxWpm) * (cH - cPad * 2);
  const chartPath = chartResults.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${toChartX(i)},${toChartY(pt.wpm)}`).join(' ');

  return (
    <div className="w-full max-w-5xl flex flex-col gap-8 py-6 px-4 font-mono select-none page-enter">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToTest}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[var(--sub-alt-color)] border border-[var(--sub-color)]/20 text-xs font-semibold text-[var(--sub-color)] hover:text-[var(--text-color)] hover:border-[var(--main-color)]/40 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Test (Tab)</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--sub-alt-color)] border border-[var(--sub-color)]/20 text-xs text-[var(--sub-color)] hover:text-[var(--text-color)] transition-colors"
            title="Export Profile & Results"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--main-color)] text-[var(--bg-color)] text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-md"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* ── Monkeytype-Style Profile Hero Card ── */}
      <div className="p-6 md:p-8 rounded-3xl bg-[var(--sub-alt-color)]/50 border border-[var(--sub-color)]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Avatar Icon */}
          <div className="relative w-20 h-20 rounded-2xl bg-[var(--main-color)] text-[var(--bg-color)] flex items-center justify-center shadow-lg shadow-white/5">
            <AvatarIcon className="w-10 h-10 stroke-[2.2]" />
            <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-[var(--bg-color)] border border-[var(--sub-color)]/30 text-[10px] font-bold text-[var(--main-color)]">
              {profile.layout}
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl md:text-3xl font-black text-[var(--text-color)] tracking-tight">
                {profile.username}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--sub-color)]/15 border border-[var(--sub-color)]/25 text-[10px] font-bold text-[var(--text-color)]">
                <TierIcon className="w-3 h-3 text-[var(--main-color)]" />
                {tier.title}
              </span>
            </div>

            <p className="text-xs text-[var(--sub-color)] mt-1 max-w-lg leading-relaxed">
              {profile.bio || 'Touch typing practitioner on GokType.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-[var(--sub-color)] mt-3">
              <span className="flex items-center gap-1.5">
                <KeyboardIcon className="w-3.5 h-3.5 text-[var(--main-color)]" />
                {profile.keyboard || 'Standard Mechanical'}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[var(--sub-color)]" />
                Joined {formatDate(profile.joinedDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Goal Meters */}
        <div className="flex flex-col gap-3 min-w-[200px] w-full md:w-auto p-4 rounded-2xl bg-[var(--bg-color)]/70 border border-[var(--sub-color)]/15">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-[var(--sub-color)]">WPM Goal</span>
            <span className="text-[var(--text-color)]">
              {highestWpm} / {profile.targetWpm}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[var(--sub-alt-color)] border border-[var(--sub-color)]/20 overflow-hidden">
            <div
              className="h-full bg-[var(--main-color)] rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.round((highestWpm / Math.max(1, profile.targetWpm)) * 100))}%`,
              }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-semibold mt-1">
            <span className="text-[var(--sub-color)]">Accuracy Goal</span>
            <span className="text-[var(--text-color)]">
              {avgAcc}% / {profile.targetAccuracy}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[var(--sub-alt-color)] border border-[var(--sub-color)]/20 overflow-hidden">
            <div
              className="h-full bg-[var(--text-color)] rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.round((avgAcc / Math.max(1, profile.targetAccuracy)) * 100))}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Key Statistics Cards (Monkeytype-Style) ── */}
      <div>
        <h2 className="text-xs uppercase tracking-widest text-[var(--sub-color)] font-bold mb-3 flex items-center gap-1.5">
          <BarChart2 className="w-3.5 h-3.5 text-[var(--main-color)]" />
          Typing Statistics
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { label: 'tests completed', value: totalTests },
            { label: 'time typing', value: formatTime(totalTimeSeconds) },
            { label: 'highest wpm', value: highestWpm, highlight: true },
            { label: 'average wpm', value: avgWpm },
            { label: 'avg accuracy', value: `${avgAcc}%` },
            { label: 'avg consistency', value: `${avgConsistency}%` },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[var(--sub-alt-color)]/50 border border-[var(--sub-color)]/20 flex flex-col justify-between"
            >
              <span className="text-[10px] uppercase tracking-wider text-[var(--sub-color)] font-semibold mb-1">
                {stat.label}
              </span>
              <span
                className={`font-mono font-black text-2xl md:text-3xl leading-none mt-1 ${
                  stat.highlight ? 'text-[var(--main-color)]' : 'text-[var(--text-color)]'
                }`}
              >
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Personal Bests Benchmark Grid (Monkeytype-Style) ── */}
      <div>
        <h2 className="text-xs uppercase tracking-widest text-[var(--sub-color)] font-bold mb-3 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-[var(--main-color)]" />
          Personal Bests
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {standardPbs.map((item) => {
            const pb = pbs[item.key];
            return (
              <div
                key={item.key}
                className="p-4 rounded-2xl bg-[var(--sub-alt-color)]/50 border border-[var(--sub-color)]/20 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs text-[var(--sub-color)] mb-2">
                  <span className="font-semibold text-[var(--text-color)]">{item.label}</span>
                  {pb && <span className="text-[10px]">{formatDate(pb.timestamp)}</span>}
                </div>

                <div className="flex items-baseline justify-between mt-1">
                  {pb ? (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-[var(--main-color)]">
                          {pb.wpm}
                        </span>
                        <span className="text-xs text-[var(--sub-color)]">wpm</span>
                      </div>
                      <div className="text-right text-[11px] text-[var(--sub-color)]">
                        <div>{pb.accuracy}% acc</div>
                        <div>{pb.rawWpm} raw</div>
                      </div>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-[var(--sub-color)]/40">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── WPM Progress Chart ── */}
      {chartResults.length > 1 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs uppercase tracking-widest text-[var(--sub-color)] font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[var(--main-color)]" />
              Recent WPM Trajectory ({chartResults.length} tests)
            </h2>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--sub-alt-color)]/40 border border-[var(--sub-color)]/20">
            <svg viewBox={`0 0 ${cW} ${cH}`} className="w-full h-28">
              {/* Reference Grid */}
              <line x1={cPad} y1={cH - cPad} x2={cW - cPad} y2={cH - cPad} stroke="var(--sub-color)" strokeOpacity="0.2" />
              <line x1={cPad} y1={cPad} x2={cW - cPad} y2={cPad} stroke="var(--sub-color)" strokeOpacity="0.08" strokeDasharray="3 4" />

              {/* Progress Line */}
              <path
                d={chartPath}
                fill="none"
                stroke="var(--main-color)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {chartResults.map((pt, idx) => (
                <circle
                  key={idx}
                  cx={toChartX(idx)}
                  cy={toChartY(pt.wpm)}
                  r="3.5"
                  fill="var(--bg-color)"
                  stroke="var(--main-color)"
                  strokeWidth="2"
                />
              ))}
            </svg>
          </div>
        </div>
      )}

      {/* ── Test History Table (Monkeytype-Style) ── */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <h2 className="text-xs uppercase tracking-widest text-[var(--sub-color)] font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[var(--main-color)]" />
            Activity History ({filteredResults.length})
          </h2>

          <div className="flex items-center gap-1.5">
            {(['all', 'time', 'words', 'quote', 'zen'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedFilter(mode)}
                className={`px-2.5 py-1 rounded-lg text-xs capitalize transition-colors ${
                  selectedFilter === mode
                    ? 'bg-[var(--main-color)] text-[var(--bg-color)] font-bold'
                    : 'text-[var(--sub-color)] hover:text-[var(--text-color)] hover:bg-[var(--sub-alt-color)]'
                }`}
              >
                {mode}
              </button>
            ))}

            {results.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="p-1.5 rounded-lg text-[var(--sub-color)] hover:text-[var(--error-color)] hover:bg-[var(--sub-alt-color)] transition-colors ml-2"
                title="Clear All History"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {filteredResults.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[var(--sub-alt-color)]/30 border border-[var(--sub-color)]/20 text-center text-xs text-[var(--sub-color)]">
            No typing tests recorded yet. Complete a test to see your history here!
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--sub-color)]/20 overflow-x-auto bg-[var(--sub-alt-color)]/20">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--sub-color)]/20 text-[10px] uppercase text-[var(--sub-color)] font-semibold">
                  <th className="py-3 px-4">Mode</th>
                  <th className="py-3 px-4">WPM</th>
                  <th className="py-3 px-4">Accuracy</th>
                  <th className="py-3 px-4">Raw</th>
                  <th className="py-3 px-4">Consistency</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--sub-color)]/10 font-medium">
                {filteredResults.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-[var(--sub-alt-color)]/50 transition-colors"
                  >
                    <td className="py-3 px-4 capitalize font-semibold text-[var(--text-color)]">
                      {r.mode} <span className="text-[var(--sub-color)]">{r.modeConfig}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-sm text-[var(--main-color)]">{r.wpm}</span>
                    </td>
                    <td className="py-3 px-4 text-[var(--text-color)]">{r.accuracy}%</td>
                    <td className="py-3 px-4 text-[var(--sub-color)]">{r.rawWpm}</td>
                    <td className="py-3 px-4 text-[var(--sub-color)]">{r.consistency}%</td>
                    <td className="py-3 px-4 text-[var(--sub-color)] text-[11px]">
                      {formatDate(r.timestamp)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteResult(r.id)}
                        className="p-1 rounded text-[var(--sub-color)] hover:text-[var(--error-color)] transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onSaveProfile={onUpdateProfile}
      />
    </div>
  );
};
