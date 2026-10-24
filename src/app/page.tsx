'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { ModeSelector } from '@/components/ModeSelector';
import { TypingArea } from '@/components/TypingArea';
import { FingerPositionPreview } from '@/components/FingerPositionPreview';
import { ResultScreen } from '@/components/ResultScreen';
import { SettingsModal } from '@/components/SettingsModal';
import { StatsModal } from '@/components/StatsModal';
import { LeaderboardModal } from '@/components/LeaderboardModal';
import { Footer } from '@/components/Footer';
import { SEOContent } from '@/components/SEOContent';
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

  // Test mode
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
  const [isTyping, setIsTyping] = useState(false);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Load settings
  useEffect(() => {
    const loaded = loadSettings();
    setSettings(loaded);
    applyThemeToDom(getThemeById(loaded.theme));
    setIsClientLoaded(true);
  }, []);

  const handleUpdateSettings = useCallback((updater: (prev: UserSettings) => UserSettings) => {
    setSettings((prev) => {
      const updated = updater(prev);
      saveSettings(updated);
      applyThemeToDom(getThemeById(updated.theme));
      return updated;
    });
  }, []);

  const handleResetTest = useCallback(() => {
    setActiveResult(null);
    setIsTyping(false);
    setTestKey((k) => k + 1);
  }, []);

  const handleFinishTest = useCallback((result: TestResult) => {
    const { isPb } = saveTestResult(result);
    result.isPb = isPb;
    setIsTyping(false);
    setActiveResult(result);
  }, []);

  const handleTypingStateChange = useCallback((typing: boolean) => {
    setIsTyping(typing);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center transition-colors duration-300">
      {/* Header — fades out while typing */}
      <Header
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onResetTest={handleResetTest}
        isTyping={isTyping}
      />

      {/* ── Main content ── */}
      <div className="w-full max-w-5xl flex flex-col items-center justify-center flex-1 px-4">
        {activeResult ? (
          <ResultScreen
            result={activeResult}
            onNextTest={handleResetTest}
            onRepeatTest={handleResetTest}
          />
        ) : (
          <div className="w-full flex flex-col items-center">
            {/* Mode selector — fades out while typing */}
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
              isTyping={isTyping}
            />

            {/* Core typing engine */}
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
              onTypingStateChange={handleTypingStateChange}
            />

            {/* Finger guide — fades smoothly */}
            {(settings.showHandsPreview || settings.showKeyboard) && (
              <div
                className={`w-full transition-all duration-500 ${
                  isTyping
                    ? 'opacity-60 scale-[0.97]'
                    : 'opacity-100 scale-100'
                }`}
              >
                <FingerPositionPreview
                  currentChar={currentChar}
                  isFocused={true}
                  showHands={settings.showHandsPreview}
                  showKeyboard={settings.showKeyboard}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* SEO Content & FAQs — accessible & crawlable */}
      <div
        className={`w-full flex justify-center transition-all duration-500 ${
          isTyping ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <SEOContent />
      </div>

      {/* Footer — fades while typing */}
      <div
        className={`w-full flex justify-center transition-all duration-500 ${
          isTyping ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <Footer />
      </div>

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
