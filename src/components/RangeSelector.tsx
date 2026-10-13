import React from 'react';
import {
  NumberRangeKey,
  RANGE_OPTIONS,
  ZeroDifficulty,
} from '../utils/koreanNumber';
import { sound } from '../utils/audio';

interface RangeSelectorProps {
  selectedRange: NumberRangeKey;
  onSelectRange: (key: NumberRangeKey) => void;
  difficulty: ZeroDifficulty;
  onChangeDifficulty: (diff: ZeroDifficulty) => void;
  disabled?: boolean;
}

export const RangeSelector: React.FC<RangeSelectorProps> = ({
  selectedRange,
  onSelectRange,
  difficulty,
  onChangeDifficulty,
  disabled = false,
}) => {
  const categories: Array<{
    id: '조' | '억' | '만' | '랜덤';
    name: string;
    icon: string;
    tag: string;
    colorTheme: {
      activeBorder: string;
      activeBg: string;
      titleColor: string;
      buttonActive: string;
    };
  }> = [
    {
      id: '조',
      name: '조 탐험대',
      icon: '🚀',
      tag: '13~16자리',
      colorTheme: {
        activeBorder: 'border-purple-300 ring-2 ring-purple-100',
        activeBg: 'bg-purple-50/50',
        titleColor: 'text-purple-900',
        buttonActive: 'bg-purple-600 text-white shadow-sm',
      },
    },
    {
      id: '억',
      name: '억 탐험대',
      icon: '⚡',
      tag: '9~12자리',
      colorTheme: {
        activeBorder: 'border-blue-300 ring-2 ring-blue-100',
        activeBg: 'bg-blue-50/50',
        titleColor: 'text-blue-900',
        buttonActive: 'bg-blue-600 text-white shadow-sm',
      },
    },
    {
      id: '만',
      name: '만 탐험대',
      icon: '🌱',
      tag: '5~8자리',
      colorTheme: {
        activeBorder: 'border-emerald-300 ring-2 ring-emerald-100',
        activeBg: 'bg-emerald-50/50',
        titleColor: 'text-emerald-900',
        buttonActive: 'bg-emerald-600 text-white shadow-sm',
      },
    },
    {
      id: '랜덤',
      name: '종합 챌린지',
      icon: '🎲',
      tag: '무작위 믹스',
      colorTheme: {
        activeBorder: 'border-amber-300 ring-2 ring-amber-100',
        activeBg: 'bg-amber-50/50',
        titleColor: 'text-amber-900',
        buttonActive: 'bg-amber-500 text-white shadow-sm',
      },
    },
  ];

  const currentOption = RANGE_OPTIONS.find((opt) => opt.key === selectedRange);
  const activeCategory = currentOption ? currentOption.category : '조';

  return (
    <div className="bg-white rounded-3xl border-2 border-indigo-100 p-5 shadow-sm space-y-4">
      {/* Top Banner & Current Mission */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎯</span>
          <h2 className="text-base font-jua text-slate-800">어떤 수로 연습할까요?</h2>
        </div>

        {currentOption && (
          <div className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-jua flex items-center gap-1.5">
            <span>선택:</span>
            <span className="font-bold underline underline-offset-2">{currentOption.label}</span>
            <span className="text-indigo-400 font-normal">({currentOption.digits}자리)</span>
          </div>
        )}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {categories.map((cat) => {
          const isCategoryActive = activeCategory === cat.id;
          const categoryItems = RANGE_OPTIONS.filter((o) => o.category === cat.id);

          return (
            <div
              key={cat.id}
              className={`p-3 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                isCategoryActive
                  ? `${cat.colorTheme.activeBorder} ${cat.colorTheme.activeBg}`
                  : 'border-slate-100 bg-slate-50/60 hover:border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2 pb-1 border-b border-black/5">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{cat.icon}</span>
                  <span className={`text-xs font-jua font-bold ${cat.colorTheme.titleColor}`}>
                    {cat.name}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{cat.tag}</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {categoryItems.map((opt) => {
                  const isSelected = selectedRange === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        sound.playClick();
                        onSelectRange(opt.key);
                      }}
                      className={`px-2 py-1.5 text-xs font-jua rounded-xl transition-all text-center whitespace-nowrap cursor-pointer active:scale-95 ${
                        isSelected
                          ? `${cat.colorTheme.buttonActive} ring-1 ring-black/10 scale-[1.02]`
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-2xs'
                      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Difficulty / 0-Pattern Settings */}
      <div className="pt-3 border-t-2 border-slate-100/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-jua text-slate-700 flex items-center gap-1">
            <span>✨</span>
            <span>0(영) 난이도:</span>
          </span>
          <div className="inline-flex rounded-xl border border-slate-200 p-1 bg-slate-100/90 gap-1">
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                sound.playClick();
                onChangeDifficulty('standard');
              }}
              className={`px-3 py-1 text-xs font-jua rounded-lg transition-all cursor-pointer ${
                difficulty === 'standard'
                  ? 'bg-white text-indigo-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🍀 기본 자연수
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                sound.playClick();
                onChangeDifficulty('zero_trap');
              }}
              className={`px-3 py-1 text-xs font-jua rounded-lg transition-all cursor-pointer ${
                difficulty === 'zero_trap'
                  ? 'bg-amber-500 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="중간에 0이 연속으로 들어간 헷갈리기 쉬운 문제 집중 훈련"
            >
              🚨 0 함정 마스터
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                sound.playClick();
                onChangeDifficulty('dense');
              }}
              className={`px-3 py-1 text-xs font-jua rounded-lg transition-all cursor-pointer ${
                difficulty === 'dense'
                  ? 'bg-white text-indigo-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="0 없이 1~9로 가득 채워 긴 호흡으로 읽기"
            >
              🧱 꽉 찬 자릿수
            </button>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 font-medium">
          {difficulty === 'zero_trap' && '※ 자릿수 중간에 0이 자주 숨어있어 시험 대비에 최고예요!'}
          {difficulty === 'standard' && '※ 0이 적당히 포함된 자연스러운 큰 수예요.'}
          {difficulty === 'dense' && '※ 모든 자릿수가 숫자로 채워진 긴 호흡 연습용이에요.'}
        </div>
      </div>
    </div>
  );
};
