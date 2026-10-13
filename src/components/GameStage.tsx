import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  Play,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Eye,
  EyeOff,
  Trophy,
  Layers,
  Sparkles,
  Timer,
  Star,
} from 'lucide-react';
import {
  NumberAnalysis,
  speakKoreanText,
} from '../utils/koreanNumber';
import { DisplayMode, GameStatus } from '../types/game';
import { sound } from '../utils/audio';
import mascotImg from '../assets/images/cute_math_mascot_1791880183512.jpg';

interface GameStageProps {
  status: GameStatus;
  elapsedTime: number;
  analysis: NumberAnalysis | null;
  displayMode: DisplayMode;
  onChangeDisplayMode: (mode: DisplayMode) => void;
  onStart: () => void;
  onStop: () => void;
  onNext: () => void;
  onRetry: () => void;
  isPersonalBest: boolean;
}

export const GameStage: React.FC<GameStageProps> = ({
  status,
  elapsedTime,
  analysis,
  displayMode,
  onChangeDisplayMode,
  onStart,
  onStop,
  onNext,
  onRetry,
  isPersonalBest,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showAnswerReading, setShowAnswerReading] = useState(true);
  const [hoveredDigitIdx, setHoveredDigitIdx] = useState<number | null>(null);

  const formattedTimer = elapsedTime.toFixed(2);

  const handleSpeak = (text: string) => {
    sound.playClick();
    setIsSpeaking(true);
    speakKoreanText(
      text,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const fireConfetti = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'],
      });
    } catch {
      // ignore
    }
  };

  // Praise message based on time
  const getPraiseMessage = (seconds: number) => {
    if (seconds < 3.5) {
      return {
        badge: '⚡ 번개 스피드 마스터!',
        title: '우와! 번개처럼 빠른 속도로 다 읽었어요!',
        stars: 3,
      };
    } else if (seconds < 6.5) {
      return {
        badge: '🌟 스피드 탐험가!',
        title: '멋져요! 막힘없이 시원시원하게 읽어냈네요!',
        stars: 3,
      };
    } else {
      return {
        badge: '👏 꼼꼼한 수학 박사!',
        title: '정확하게 끝까지 집중해서 잘 읽었어요!',
        stars: 2,
      };
    }
  };

  const praise = getPraiseMessage(elapsedTime);

  // Helper to get place value name for hovered digit in plain mode
  const getPlaceValueName = (indexFromRight: number) => {
    const units = [
      '일', '십', '백', '천',
      '만', '십만', '백만', '천만',
      '억', '십억', '백억', '천억',
      '조', '십조', '백조', '천조'
    ];
    return units[indexFromRight] ? `${units[indexFromRight]}의 자리` : '';
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-indigo-100 p-5 sm:p-7 shadow-sm flex flex-col items-center justify-between min-h-[500px] relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-100/50 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-indigo-100/50 rounded-full blur-2xl pointer-events-none" />

      {/* Top Bar: Display Mode Tabs + Stopwatch Capsule */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 pb-4 border-b-2 border-slate-100 relative z-10">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-jua text-slate-500">보기 모드:</span>
          <div className="inline-flex rounded-2xl border border-slate-200 p-1 bg-slate-100/90 gap-1 flex-wrap">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onChangeDisplayMode('plain');
              }}
              className={`px-3 py-1 text-xs font-jua rounded-xl transition-all cursor-pointer ${
                displayMode === 'plain'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              기호 없음 (순수 숫자)
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onChangeDisplayMode('standard');
              }}
              className={`px-3 py-1 text-xs font-jua rounded-xl transition-all cursor-pointer ${
                displayMode === 'standard'
                  ? 'bg-white text-indigo-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              표준 콤마 (3자리)
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onChangeDisplayMode('korean_unit');
              }}
              className={`px-3 py-1 text-xs font-jua rounded-xl transition-all cursor-pointer ${
                displayMode === 'korean_unit'
                  ? 'bg-white text-indigo-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              단위 표기 (조·억·만)
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onChangeDisplayMode('block_breakdown');
              }}
              className={`px-3 py-1 text-xs font-jua rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                displayMode === 'block_breakdown'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3 h-3" />
              4자리 블록 가이드
            </button>
          </div>
        </div>

        {/* Stopwatch Capsule */}
        <div
          className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl border-2 font-mono tabular-nums transition-all ${
            status === 'running'
              ? 'bg-amber-50 border-amber-400 text-amber-900 ring-4 ring-amber-100 shadow-sm'
              : status === 'completed'
              ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <div className={`p-1 rounded-full ${status === 'running' ? 'bg-amber-200 text-amber-800 animate-spin' : 'text-slate-400'}`}>
            <Timer className="w-4 h-4" />
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="text-[10px] text-slate-500 font-jua">
              {status === 'running' ? '읽는 중 ⏱️' : '측정 시간'}
            </span>
            <span className="text-xl font-bold font-jua mt-0.5">
              {formattedTimer}
              <span className="text-xs font-normal ml-0.5 font-sans">초</span>
            </span>
          </div>
        </div>
      </div>

      {/* Center Zone: Giant Number Presentation */}
      <div className="w-full flex-1 flex flex-col items-center justify-center my-6 text-center relative z-10">
        {analysis ? (
          <div className="w-full max-w-4xl space-y-4">
            {/* View Mode 0: Plain Numbers without symbols (Strict Single Line) */}
            {displayMode === 'plain' && (
              <div className="py-7 px-3 sm:px-5 bg-gradient-to-b from-indigo-50/50 via-white to-indigo-50/30 rounded-3xl border-2 border-indigo-100/80 shadow-xs overflow-hidden">
                <div className="w-full flex flex-nowrap items-center justify-center gap-0.5 sm:gap-1 md:gap-1.5 whitespace-nowrap overflow-x-auto py-2">
                  {analysis.raw.split('').map((char, idx) => {
                    const indexFromRight = analysis.raw.length - 1 - idx;
                    const isHovered = hoveredDigitIdx === idx;
                    const placeName = getPlaceValueName(indexFromRight);
                    const numLength = analysis.raw.length;

                    // Dynamic font size strictly fitting on a single line
                    const digitSizeClass =
                      numLength <= 6
                        ? 'text-4xl sm:text-6xl md:text-7xl'
                        : numLength <= 8
                        ? 'text-3xl sm:text-5xl md:text-6xl'
                        : numLength <= 12
                        ? 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl'
                        : 'text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[42px]';

                    return (
                      <div
                        key={idx}
                        onMouseEnter={() => setHoveredDigitIdx(idx)}
                        onMouseLeave={() => setHoveredDigitIdx(null)}
                        className="relative group flex flex-col items-center shrink-0"
                      >
                        {/* Hover Place Value Tooltip */}
                        {isHovered && (
                          <div className="absolute -top-9 px-2 py-0.5 bg-indigo-900 text-white rounded-lg text-[10px] font-jua whitespace-nowrap shadow-md z-30 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                            {placeName}
                          </div>
                        )}

                        <span
                          className={`inline-block font-jua tabular-nums shrink-0 whitespace-nowrap transition-transform cursor-help select-all leading-none ${digitSizeClass} ${
                            isHovered
                              ? 'text-indigo-600 scale-125'
                              : 'text-slate-900 hover:text-indigo-600'
                          }`}
                        >
                          {char}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs font-jua text-slate-500 whitespace-nowrap flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    기호 없음 (직접 끊어읽기 실전 연습)
                  </span>
                  <span>·</span>
                  <span>총 {analysis.raw.length}자리 수</span>
                  <span>·</span>
                  <span className="text-indigo-600">숫자에 마우스를 대면 자릿값이 보여요!</span>
                </div>
              </div>
            )}

            {/* View Mode 1: Standard Comma (Strict Single Line) */}
            {displayMode === 'standard' && (
              <div className="py-7 px-3 sm:px-5 bg-gradient-to-b from-slate-50/80 to-white rounded-3xl border-2 border-slate-200/80 shadow-xs overflow-hidden">
                <div
                  className={`w-full font-jua tracking-wider text-slate-900 tabular-nums whitespace-nowrap overflow-x-auto select-all leading-tight py-2 ${
                    analysis.formattedWithComma.length <= 8
                      ? 'text-3xl sm:text-5xl md:text-6xl'
                      : analysis.formattedWithComma.length <= 13
                      ? 'text-2xl sm:text-4xl md:text-5xl'
                      : 'text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[40px]'
                  }`}
                >
                  {analysis.formattedWithComma}
                </div>
                <div className="mt-4 text-xs font-jua text-slate-500 whitespace-nowrap">
                  표준 3자리 콤마 표기 · 총 {analysis.raw.length}자리 수
                </div>
              </div>
            )}

            {/* View Mode 2: Korean Units Spaced (Strict Single Line) */}
            {displayMode === 'korean_unit' && (
              <div className="py-7 px-3 sm:px-5 bg-gradient-to-b from-indigo-50/60 to-purple-50/30 rounded-3xl border-2 border-indigo-200/70 shadow-xs overflow-hidden">
                <div
                  className={`w-full font-jua tracking-wide text-slate-900 whitespace-nowrap overflow-x-auto select-all leading-relaxed py-2 ${
                    analysis.formattedKoreanUnit.length <= 10
                      ? 'text-2xl sm:text-4xl md:text-5xl'
                      : analysis.formattedKoreanUnit.length <= 16
                      ? 'text-xl sm:text-3xl md:text-4xl'
                      : 'text-lg sm:text-2xl md:text-3xl lg:text-4xl'
                  }`}
                >
                  {analysis.formattedKoreanUnit}
                </div>
                <div className="mt-4 text-xs font-jua text-indigo-600 whitespace-nowrap">
                  {analysis.formattedWithComma} ({analysis.raw.length}자리 수)
                </div>
              </div>
            )}

            {/* View Mode 3: 4-digit Educational Block Breakdown */}
            {displayMode === 'block_breakdown' && (
              <div className="w-full py-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {analysis.blocks.map((block) => (
                    <div
                      key={block.unit}
                      className={`rounded-2xl border-2 p-3.5 flex flex-col ${block.colorClass.bg} ${block.colorClass.border} shadow-2xs transition-all hover:-translate-y-0.5`}
                    >
                      {/* Unit Header */}
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/5">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-jua font-bold ${block.colorClass.badge}`}>
                          {block.unit === '일' ? '일의 자리' : `${block.unit}의 자리`}
                        </span>
                        <span className="text-xs font-jua font-bold text-slate-600">
                          {block.valueNumber > 0 ? `${block.valueNumber}` : '0'}
                        </span>
                      </div>

                      {/* 4 Digits Table: 천, 백, 십, 일 */}
                      <div className="grid grid-cols-4 gap-1.5 text-center my-1.5">
                        {block.digits.map((d, dIdx) => (
                          <div
                            key={dIdx}
                            className={`p-2 rounded-xl flex flex-col items-center justify-center transition-all ${
                              d.isZero
                                ? 'bg-white/50 text-slate-400'
                                : 'bg-white text-slate-900 shadow-2xs font-jua'
                            }`}
                          >
                            <span className="text-[10px] text-slate-400 font-jua">{d.label}</span>
                            <span className="text-xl sm:text-2xl font-jua">{d.digit}</span>
                          </div>
                        ))}
                      </div>

                      {/* Korean spoken for this block */}
                      <div className="mt-2 pt-2 border-t border-black/5 text-center text-xs font-jua text-slate-700 min-h-[1.25rem]">
                        {block.koreanText || <span className="text-slate-400 font-normal font-sans">(0이라서 건너뜀)</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Feedback Banner */}
            {status === 'completed' && (
              <div className="mt-5 p-5 rounded-3xl bg-gradient-to-r from-emerald-50 via-amber-50/50 to-indigo-50 border-2 border-emerald-200 text-left animate-in fade-in slide-in-from-bottom-3 duration-300 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-xs bg-amber-100 shrink-0">
                      <img
                        src={mascotImg}
                        alt="별이 마스코트"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover scale-110"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-jua font-bold">
                          {praise.badge}
                        </span>
                        {isPersonalBest && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold font-jua text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                            <Trophy className="w-3.5 h-3.5 text-amber-600" />
                            최고 기록 갱신 🏆
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm sm:text-base font-jua text-slate-800 mt-1">
                        {praise.title} (기록:{' '}
                        <span className="text-emerald-700 font-extrabold text-lg">
                          {formattedTimer}초
                        </span>)
                      </h4>
                    </div>
                  </div>

                  {/* Actions: Show text / Audio */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowAnswerReading(!showAnswerReading)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-jua text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      {showAnswerReading ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showAnswerReading ? '한글 숨기기' : '정답 확인'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSpeak(analysis.koreanReading)}
                      disabled={isSpeaking}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-jua rounded-xl border transition-all active:scale-95 cursor-pointer shadow-2xs ${
                        isSpeaking
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isSpeaking ? '읽어주는 중...' : '발음 듣기'}</span>
                    </button>
                  </div>
                </div>

                {/* Korean reading text box */}
                {showAnswerReading && (
                  <div className="p-3.5 bg-white rounded-2xl border border-emerald-100 text-slate-900 text-base sm:text-lg font-jua leading-relaxed tracking-wide shadow-2xs">
                    {analysis.koreanReading}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 space-y-3">
            <div className="w-20 h-20 mx-auto rounded-3xl overflow-hidden border-2 border-amber-300 shadow-md">
              <img
                src={mascotImg}
                alt="마스코트 별이"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-jua text-slate-800">수의 범위를 고르고 시작 버튼을 눌러보세요!</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              스페이스바를 누르거나 아래 버튼을 누르면 큰 수가 화면에 크게 나타납니다.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Action Area: Big tactile buttons */}
      <div className="w-full pt-4 border-t-2 border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
        {status === 'idle' && (
          <button
            type="button"
            onClick={onStart}
            className="w-full sm:w-auto min-w-[260px] px-8 py-4 text-lg font-jua font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>읽기 시작하기 (스페이스바)</span>
          </button>
        )}

        {status === 'running' && (
          <button
            type="button"
            onClick={() => {
              sound.playStop();
              onStop();
              if (isPersonalBest) {
                sound.playCelebration();
                fireConfetti();
              }
            }}
            className="w-full sm:w-auto min-w-[300px] px-8 py-4.5 text-xl font-jua font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer animate-gentle-bounce"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span>다 읽었어요! 완료 (스페이스바)</span>
          </button>
        )}

        {status === 'completed' && (
          <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onRetry}
              className="px-5 py-3.5 text-sm font-jua font-bold text-slate-700 bg-white border-2 border-slate-200 hover:bg-slate-50 active:scale-95 rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>이 수 다시 읽기</span>
            </button>

            <button
              type="button"
              onClick={onNext}
              className="min-w-[240px] px-8 py-3.5 text-lg font-jua font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>다음 문제로 출동! (스페이스바)</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
