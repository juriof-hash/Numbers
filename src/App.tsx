import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  NumberRangeKey,
  ZeroDifficulty,
  RANGE_OPTIONS,
  generateRandomNumber,
  analyzeKoreanNumber,
  NumberAnalysis,
} from './utils/koreanNumber';
import { GameRecord, DisplayMode, GameStatus } from './types/game';
import { Header } from './components/Header';
import { RangeSelector } from './components/RangeSelector';
import { GameStage } from './components/GameStage';
import { RecordSidebar } from './components/RecordSidebar';
import { GuideModal } from './components/GuideModal';
import { sound } from './utils/audio';
import heroVisual from './assets/images/math_large_numbers_hero_1791879484543.jpg';

const STORAGE_KEY_RECORDS = 'korean_number_game_records_v1';
const STORAGE_KEY_MUTED = 'korean_number_game_muted_v1';
const STORAGE_KEY_RANGE = 'korean_number_game_range_v1';
const STORAGE_KEY_DISPLAY_MODE = 'korean_number_game_display_mode_v1';

export default function App() {
  const [selectedRange, setSelectedRange] = useState<NumberRangeKey>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RANGE);
      if (saved && RANGE_OPTIONS.some((o) => o.key === saved)) {
        return saved as NumberRangeKey;
      }
    } catch {
      // ignore
    }
    return 'thousand_trillion'; // Default: 몇천조
  });

  const [difficulty, setDifficulty] = useState<ZeroDifficulty>('standard');
  const [displayMode, setDisplayMode] = useState<DisplayMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DISPLAY_MODE);
      if (saved && ['plain', 'standard', 'korean_unit', 'block_breakdown'].includes(saved)) {
        return saved as DisplayMode;
      }
    } catch {
      // ignore
    }
    return 'plain'; // Default to plain (기호 없음) as requested for reading training
  });
  const [status, setStatus] = useState<GameStatus>('idle');
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [analysis, setAnalysis] = useState<NumberAnalysis | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_MUTED) === 'true';
    } catch {
      return false;
    }
  });

  const [records, setRecords] = useState<GameRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECORDS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [isPersonalBest, setIsPersonalBest] = useState(false);

  const startTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<number | null>(null);

  // Sync mute setting
  useEffect(() => {
    sound.setMuted(isMuted);
    try {
      localStorage.setItem(STORAGE_KEY_MUTED, String(isMuted));
    } catch {
      // ignore
    }
  }, [isMuted]);

  // Sync range setting
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RANGE, selectedRange);
    } catch {
      // ignore
    }
  }, [selectedRange]);

  // Sync display mode setting
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DISPLAY_MODE, displayMode);
    } catch {
      // ignore
    }
  }, [displayMode]);

  // Sync records
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
    } catch {
      // ignore
    }
  }, [records]);

  // Generate initial number on mount
  useEffect(() => {
    const rawNum = generateRandomNumber(selectedRange, difficulty);
    setAnalysis(analyzeKoreanNumber(rawNum));
  }, []);

  // When selected range or difficulty changes, if idle or completed, generate a fresh number
  const handleRangeChange = (newRange: NumberRangeKey) => {
    setSelectedRange(newRange);
    if (status !== 'running') {
      const rawNum = generateRandomNumber(newRange, difficulty);
      setAnalysis(analyzeKoreanNumber(rawNum));
      setStatus('idle');
      setElapsedTime(0);
      setIsPersonalBest(false);
    }
  };

  const handleDifficultyChange = (newDiff: ZeroDifficulty) => {
    setDifficulty(newDiff);
    if (status !== 'running') {
      const rawNum = generateRandomNumber(selectedRange, newDiff);
      setAnalysis(analyzeKoreanNumber(rawNum));
      setStatus('idle');
      setElapsedTime(0);
      setIsPersonalBest(false);
    }
  };

  // Start reading
  const handleStart = useCallback(() => {
    if (!analysis) {
      const raw = generateRandomNumber(selectedRange, difficulty);
      setAnalysis(analyzeKoreanNumber(raw));
    }

    sound.playStart();
    setStatus('running');
    setElapsedTime(0);
    setIsPersonalBest(false);
    startTimeRef.current = performance.now();

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    timerIntervalRef.current = window.setInterval(() => {
      const now = performance.now();
      const currentSeconds = (now - startTimeRef.current) / 1000;
      setElapsedTime(currentSeconds);
    }, 15);
  }, [analysis, selectedRange, difficulty]);

  // Stop reading
  const handleStop = useCallback(() => {
    if (status !== 'running' || !analysis) return;

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    const now = performance.now();
    const finalSeconds = parseFloat(((now - startTimeRef.current) / 1000).toFixed(2));
    setElapsedTime(finalSeconds);
    setStatus('completed');

    const rangeObj = RANGE_OPTIONS.find((r) => r.key === selectedRange);
    const rangeLabel = rangeObj ? rangeObj.label : '큰 수';

    // Check personal best
    const previousBest = records.length > 0 ? Math.min(...records.map((r) => r.timeSeconds)) : Infinity;
    const isBest = finalSeconds < previousBest && finalSeconds > 0.3;
    setIsPersonalBest(isBest);

    // Save record
    const newRecord: GameRecord = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      numberRaw: analysis.raw,
      formattedWithComma: analysis.formattedWithComma,
      formattedKoreanUnit: analysis.formattedKoreanUnit,
      koreanReading: analysis.koreanReading,
      rangeKey: selectedRange,
      rangeLabel,
      timeSeconds: finalSeconds,
      timestamp: Date.now(),
      difficulty,
    };

    setRecords((prev) => [newRecord, ...prev]);
  }, [status, analysis, selectedRange, difficulty, records]);

  // Next question
  const handleNext = useCallback(() => {
    sound.playClick();
    const raw = generateRandomNumber(selectedRange, difficulty);
    setAnalysis(analyzeKoreanNumber(raw));
    setStatus('idle');
    setElapsedTime(0);
    setIsPersonalBest(false);

    // Auto-start next reading for fast flow
    setTimeout(() => {
      handleStart();
    }, 50);
  }, [selectedRange, difficulty, handleStart]);

  // Retry same number
  const handleRetry = useCallback(() => {
    sound.playClick();
    setStatus('idle');
    setElapsedTime(0);
    setIsPersonalBest(false);
    setTimeout(() => {
      handleStart();
    }, 50);
  }, [handleStart]);

  // Global keyboard shortcut (Space bar / Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();

        if (status === 'idle') {
          handleStart();
        } else if (status === 'running') {
          sound.playStop();
          handleStop();
        } else if (status === 'completed') {
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, handleStart, handleStop, handleNext]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const handleDeleteRecord = (id: string) => {
    sound.playClick();
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const handleClearAllRecords = () => {
    setRecords([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/40 via-sky-50/30 to-purple-50/40 flex flex-col text-slate-900 font-sans">
      {/* 3-zone Header */}
      <Header
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left / Center Zone: Range Controls & Game Stage (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Range Selection Card */}
            <RangeSelector
              selectedRange={selectedRange}
              onSelectRange={handleRangeChange}
              difficulty={difficulty}
              onChangeDifficulty={handleDifficultyChange}
              disabled={status === 'running'}
            />

            {/* Giant Centered Game Stage */}
            <GameStage
              status={status}
              elapsedTime={elapsedTime}
              analysis={analysis}
              displayMode={displayMode}
              onChangeDisplayMode={setDisplayMode}
              onStart={handleStart}
              onStop={handleStop}
              onNext={handleNext}
              onRetry={handleRetry}
              isPersonalBest={isPersonalBest}
            />

            {/* Visual Concept Reference Card */}
            <div className="bg-white rounded-3xl border-2 border-indigo-100 p-5 shadow-sm flex flex-col sm:flex-row items-center gap-5">
              <div className="sm:w-52 shrink-0 overflow-hidden rounded-2xl border-2 border-indigo-100/80 bg-slate-50 shadow-2xs">
                <img
                  src={heroVisual}
                  alt="조, 억, 만 수 읽기 교육 인포그래픽"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="text-xs text-slate-600 space-y-1.5 font-medium leading-relaxed">
                <div className="flex items-center gap-2">
                  <span className="text-base">💡</span>
                  <h4 className="font-jua text-indigo-950 text-sm sm:text-base">
                    만, 억, 조 단위 관계 쏙쏙 이해하기!
                  </h4>
                </div>
                <p>
                  • <strong>10,000이 10개</strong>이면 10만, <strong>1,000개</strong>이면 1,000만, <strong>10,000개</strong>이면 <strong>1억(100,000,000)</strong>이 됩니다.
                </p>
                <p>
                  • <strong>1억이 10,000개</strong> 모이면 <strong>1조(1,000,000,000,000)</strong>가 됩니다.
                </p>
                <p className="text-indigo-700 font-jua text-xs pt-1">
                  ※ 4자리씩 끊어 [천, 백, 십, 일]을 읽고 단위(조/억/만)를 붙이면 아무리 큰 수도 술술 읽혀요!
                </p>
              </div>
            </div>
          </div>

          {/* Right Zone: Timer Records List (4 cols) */}
          <div className="lg:col-span-4 sticky top-20">
            <RecordSidebar
              records={records}
              onDeleteRecord={handleDeleteRecord}
              onClearAll={handleClearAllRecords}
            />
          </div>
        </div>
      </main>

      {/* Cheatsheet Guide Modal */}
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}
