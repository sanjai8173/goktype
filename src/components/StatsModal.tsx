'use client';

import React, { useState } from 'react';
import { X, BarChart3, Trash2, Download, Zap, Target, Clock, Trophy } from 'lucide-react';
import { TestResult } from '@/types';
import { clearHistory, loadPersonalBests, loadTestResults } from '@/lib/storage/localStorage';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose }) => {
  const [results, setResults] = useState<TestResult[]>(() => loadTestResults());
  const [pbs, setPbs] = useState<Record<string, TestResult>>(() => loadPersonalBests());

  if (!isOpen) return null;

  const totalTests = results.length;
  const totalTimeSeconds = results.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  const highestWpm = results.length > 0 ? Math.max(...results.map((r) => r.wpm)) : 0;
  const avgWpm = results.length > 0 ? Math.round(results.reduce((acc, r) => acc + r.wpm, 0) / results.length) : 0;
  const avgAcc = results.length > 0 ? Math.round(results.reduce((acc, r) => acc + r.accuracy, 0) / results.length) : 0;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    if (mins >= 60) {
      const hours = Math.floor(mins / 60);
      return `${hours}h ${mins % 60}m`;
    }
    return `${mins}m ${remainingSecs}s`;
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all typing test history and personal bests?')) {
      clearHistory();
      setResults([]);
      setPbs({});
    }
  };

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(results, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `goktype_stats_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-[var(--bg-color)] border border-[var(--sub-color)]/30 rounded-3xl p-6 shadow-2xl flex flex-col gap-6 text-[var(--text-color)] font-mono">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--sub-color)]/20 pb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[var(--main-color)]" />
            <h2 className="text-xl font-bold tracking-tight">Personal Statistics</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[var(--sub-alt-color)] text-[var(--sub-color)] hover:text-[var(--text-color)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-[var(--sub-alt-color)]/50 border border-[var(--sub-color)]/20 flex flex-col">
            <div className="flex items-center gap-1.5 text-xs text-[var(--sub-color)] mb-1">
              <Zap className="w-3.5 h-3.5 text-[var(--main-color)]" />
              <span>Highest WPM</span>
            </div>
            <span className="text-3xl font-black text-[var(--main-color)]">{highestWpm}</span>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--sub-alt-color)]/50 border border-[var(--sub-color)]/20 flex flex-col">
            <div className="flex items-center gap-1.5 text-xs text-[var(--sub-color)] mb-1">
              <Target className="w-3.5 h-3.5 text-[var(--main-color)]" />
              <span>Avg Accuracy</span>
            </div>
            <span className="text-3xl font-black text-[var(--text-color)]">{avgAcc}%</span>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--sub-alt-color)]/50 border border-[var(--sub-color)]/20 flex flex-col">
            <div className="flex items-center gap-1.5 text-xs text-[var(--sub-color)] mb-1">
              <Clock className="w-3.5 h-3.5 text-[var(--main-color)]" />
              <span>Typing Time</span>
            </div>
            <span className="text-2xl font-bold text-[var(--text-color)]">{formatTime(totalTimeSeconds)}</span>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--sub-alt-color)]/50 border border-[var(--sub-color)]/20 flex flex-col">
            <div className="flex items-center gap-1.5 text-xs text-[var(--sub-color)] mb-1">
              <Trophy className="w-3.5 h-3.5 text-[var(--main-color)]" />
              <span>Completed</span>
            </div>
            <span className="text-3xl font-black text-[var(--text-color)]">{totalTests}</span>
          </div>
        </div>

        {/* Recent Tests Table */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs uppercase font-semibold text-[var(--sub-color)]">
            <span>Recent Tests ({results.length})</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                className="flex items-center gap-1 hover:text-[var(--main-color)] transition-colors normal-case"
                title="Export JSON"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
              <button
                onClick={handleClearHistory}
                className="flex items-center gap-1 hover:text-[var(--error-color)] transition-colors normal-case"
                title="Clear all history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          <div className="border border-[var(--sub-color)]/20 rounded-2xl overflow-hidden bg-[var(--sub-alt-color)]/30">
            {results.length === 0 ? (
              <div className="p-8 text-center text-sm text-[var(--sub-color)]">
                No typing tests recorded yet. Complete a test to see your analytics!
              </div>
            ) : (
              <div className="overflow-x-auto max-h-60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--sub-alt-color)] text-[var(--sub-color)] sticky top-0">
                    <tr>
                      <th className="p-3">WPM</th>
                      <th className="p-3">Accuracy</th>
                      <th className="p-3">Mode</th>
                      <th className="p-3">Raw</th>
                      <th className="p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--sub-color)]/10">
                    {results.map((r) => (
                      <tr key={r.id} className="hover:bg-[var(--sub-alt-color)]/40">
                        <td className="p-3 font-bold text-[var(--main-color)]">{r.wpm}</td>
                        <td className="p-3 font-semibold">{r.accuracy}%</td>
                        <td className="p-3 text-[var(--sub-color)] capitalize">
                          {r.mode} {r.modeConfig}
                        </td>
                        <td className="p-3 text-[var(--sub-color)]">{r.rawWpm}</td>
                        <td className="p-3 text-[var(--sub-color)]">
                          {new Date(r.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
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
