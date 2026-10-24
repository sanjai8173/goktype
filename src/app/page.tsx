'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { ModeSelector } from '@/components/ModeSelector';
import { TypingArea } from '@/components/TypingArea';
import { FingerPositionPreview } from '@/components/FingerPositionPreview';
import { ResultScreen } from '@/components/ResultScreen';
import { SettingsModal } from '@/components/SettingsModal';
import { StatsModal } from '@/components/StatsModal';
import { LeaderboardModal } from '@/components/LeaderboardModal';
import { Footer } from '@/components/Footer';
import {
  QuoteLength,
  TestMode,
  TestResult,
  TimeOption,
  UserSettings,
  WordOption,
} from '@/types';
import { DEFAULT_SETTINGS, loadSettings, saveSettings, saveTestResult } from '@/lib/storage/localStorage';
import { applyThemeToDom, getThemeById } from '@/lib/constants/themes';

export default function Home() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  // Test mode states
  const [mode, setMode] = useState<TestMode>('time');
  const [timeOption, setTimeOption] = useState<TimeOption>(30);
  const [wordOption, setWordOption] = useState<WordOption>(25);
  const [quoteLength, setQuoteLength] = useState<QuoteLength>('medium');
  const [punctuation, setPunctuation] = useState(false);
  const [numbers, setNumbers] = useState(false);

  // Active typing state
  const [currentChar, setCurrentChar] = useState<string>('');
  const [activeResult, setActiveResult] = useState<TestResult | null>(null);
  const [testKey, setTestKey] = useState(0);

  // Modal open states
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Load settings on mount
  useEffect(() => {
    const loaded = loadSettings();
    setSettings(loaded);
    applyThemeToDom(getThemeById(loaded.theme));
    setIsClientLoaded(true);
  }, []);

  // Update theme when setting changes
  const handleUpdateSettings = (updater: (prev: UserSettings) => UserSettings) => {
    setSettings((prev) => {
      const updated = updater(prev);
      saveSettings(updated);
      applyThemeToDom(getThemeById(updated.theme));
      return updated;
    });
  };

  // Reset or restart typing test
  const handleResetTest = () => {
    setActiveResult(null);
    setTestKey((k) => k + 1);
  };

  // Test completion callback
  const handleFinishTest = (result: TestResult) => {
    const { isPb } = saveTestResult(result);
    result.isPb = isPb;
    setActiveResult(result);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-between px-4 py-2 transition-colors duration-200">
      {/* Top Header */}
      <Header
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onResetTest={handleResetTest}
      />

      {/* Main Content Body */}
      <div className="w-full max-w-5xl flex flex-col items-center justify-center my-auto flex-1">
        {activeResult ? (
          /* Test Finished Screen */
          <ResultScreen
            result={activeResult}
            onNextTest={handleResetTest}
            onRepeatTest={handleResetTest}
          />
        ) : (
          /* Active Typing Test View */
          <div className="w-full flex flex-col items-center animate-in fade-in duration-150">
            {/* Mode Selector Pill */}
            <ModeSelector
              mode={mode}
              onSelectMode={(m) => {
                setMode(m);
                handleResetTest();
              }}
              timeOption={timeOption}
              onSelectTime={(t) => {
                setTimeOption(t);
                handleResetTest();
              }}
              wordOption={wordOption}
              onSelectWord={(w) => {
                setWordOption(w);
                handleResetTest();
              }}
              quoteLength={quoteLength}
              onSelectQuoteLength={(l) => {
                setQuoteLength(l);
                handleResetTest();
              }}
              punctuation={punctuation}
              onTogglePunctuation={() => {
                setPunctuation((p) => !p);
                handleResetTest();
              }}
              numbers={numbers}
              onToggleNumbers={() => {
                setNumbers((n) => !n);
                handleResetTest();
              }}
            />

            {/* Monkeytype Core Typing Engine */}
            <TypingArea
              key={testKey}
              mode={mode}
              timeOption={timeOption}
              wordOption={wordOption}
              quoteLength={quoteLength}
              punctuation={punctuation}
              numbers={numbers}
              soundPack={settings.soundPack}
              soundVolume={settings.soundVolume}
              caretStyle={settings.caretStyle}
              onFinishTest={handleFinishTest}
              onCurrentCharChange={setCurrentChar}
            />

            {/* EdClub Interactive Finger & Hands Position Previewer */}
            {(settings.showHandsPreview || settings.showKeyboard) && (
              <FingerPositionPreview
                currentChar={currentChar}
                isFocused={true}
                showHands={settings.showHandsPreview}
                showKeyboard={settings.showKeyboard}
              />
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />
    </main>
  );
}
