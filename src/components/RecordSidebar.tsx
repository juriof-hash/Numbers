import React, { useState } from 'react';
import {
  Trophy,
  Trash2,
  Copy,
  Check,
  Volume2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Award,
} from 'lucide-react';
import { GameRecord } from '../types/game';
import { speakKoreanText } from '../utils/koreanNumber';
import { sound } from '../utils/audio';

interface RecordSidebarProps {
  records: GameRecord[];
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
}

export const RecordSidebar: React.FC<RecordSidebarProps> = ({
  records,
  onDeleteRecord,
  onClearAll,
}) => {
  const [copied, setCopied] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Find personal best
  const bestTime =
    records.length > 0 ? Math.min(...records.map((r) => r.timeSeconds)) : null;

  const averageTime =
    records.length > 0
      ? records.reduce((acc, curr) => acc + curr.timeSeconds, 0) / records.length
      : null;

  const handleCopyRecords = () => {
    if (records.length === 0) return;
    sound.playClick();

    const lines = [
      '★ [조·억·만 큰 수 읽기 게임 연습 기록] ★',
      `총 푼 문제: ${records.length}개`,
      bestTime ? `최고 기록: ${bestTime.toFixed(2)}초 👑` : '',
      averageTime ? `평균 시간: ${averageTime.toFixed(2)}초` : '',
      '--------------------------------',
      ...records.map(
        (r, idx) =>
          `${idx + 1}. [${r.rangeLabel}] ${r.formattedWithComma} -> ${r.timeSeconds.toFixed(2)}초 (${r.koreanReading})`
      ),
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(lines).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSpeak = (text: string) => {
    sound.playClick();
    speakKoreanText(text);
  };

  return (
    <aside className="bg-white rounded-3xl border-2 border-indigo-100 p-5 shadow-sm flex flex-col h-full max-h-[850px]">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3.5 border-b-2 border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-amber-100 text-amber-700">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-jua text-slate-900 leading-tight">나의 스피드 기록장</h2>
            <p className="text-[10px] text-slate-400 font-medium">연습할수록 속도가 빨라져요!</p>
          </div>
        </div>

        {records.length > 0 && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopyRecords}
              className="px-2.5 py-1 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all cursor-pointer text-xs font-jua flex items-center gap-1 border border-slate-200"
              title="기록 복사하기"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '복사 완료!' : '기록 복사'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('연습 기록을 모두 지우고 새로 시작할까요?')) {
                  sound.playClick();
                  onClearAll();
                }
              }}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              title="기록 비우기"
              aria-label="기록 비우기"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Summary KPI Strip */}
      {records.length > 0 && (
        <div className="grid grid-cols-3 gap-2 py-3 border-b-2 border-slate-100 text-center">
          <div className="p-2.5 rounded-2xl bg-indigo-50/70 border border-indigo-100">
            <span className="block text-[10px] text-indigo-700 font-jua">푼 문제</span>
            <span className="text-base font-jua font-bold text-indigo-950 mt-0.5">
              {records.length}개
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-amber-50/80 border border-amber-200">
            <span className="block text-[10px] text-amber-700 font-jua flex items-center justify-center gap-0.5">
              <span>👑 최고 기록</span>
            </span>
            <span className="text-base font-jua font-bold text-amber-950 mt-0.5">
              {bestTime !== null ? `${bestTime.toFixed(2)}초` : '-'}
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
            <span className="block text-[10px] text-emerald-700 font-jua">평균 시간</span>
            <span className="text-base font-jua font-bold text-emerald-950 mt-0.5">
              {averageTime !== null ? `${averageTime.toFixed(2)}초` : '-'}
            </span>
          </div>
        </div>
      )}

      {/* Records Scrollable List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 my-2.5 pr-1 space-y-2">
        {records.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 space-y-3">
            <div className="w-14 h-14 rounded-3xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs">
              <Sparkles className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-jua text-slate-700">기록장이 비어있어요</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              큰 수를 소리 내어 읽고
              <br />
              <strong className="text-indigo-600">[다 읽었어요!]</strong> 버튼을 누르면
              <br />
              여기에 시간 기록이 쌓여요!
            </p>
          </div>
        ) : (
          records.map((rec, index) => {
            const isBest = rec.timeSeconds === bestTime;
            const isExpanded = expandedId === rec.id;

            return (
              <div
                key={rec.id}
                className={`p-3.5 rounded-2xl border-2 transition-all ${
                  isBest
                    ? 'bg-amber-50/60 border-amber-300 ring-2 ring-amber-100 shadow-2xs'
                    : 'bg-white border-slate-200/80 hover:border-indigo-200 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-jua text-slate-400">
                        #{records.length - index}
                      </span>
                      <span className="text-[11px] font-jua px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {rec.rangeLabel}
                      </span>
                      {isBest && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-jua font-bold text-amber-900 bg-amber-200/80 border border-amber-300 px-2 py-0.5 rounded-full">
                          <Award className="w-3 h-3 text-amber-700" />
                          최고 1위
                        </span>
                      )}
                    </div>

                    <div className="mt-1 font-jua text-xs text-slate-900 truncate" title={rec.formattedWithComma}>
                      {rec.formattedWithComma}
                    </div>
                  </div>

                  {/* Time badge */}
                  <div className="flex flex-col items-end shrink-0">
                    <span
                      className={`font-jua text-base font-bold ${
                        isBest ? 'text-amber-700' : 'text-indigo-700'
                      }`}
                    >
                      {rec.timeSeconds.toFixed(2)}
                      <span className="text-xs font-normal ml-0.5">초</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => onDeleteRecord(rec.id)}
                      className="mt-1 p-1 text-slate-300 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                      title="이 기록 삭제"
                      aria-label="이 기록 삭제"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Korean reading toggle & TTS speech button */}
                <div className="mt-2.5 pt-2 border-t border-black/5 flex items-center justify-between text-xs font-jua">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                    className="text-slate-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
                  >
                    <span>한글 정답</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSpeak(rec.koreanReading)}
                    className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                    title="소리 듣기"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>발음 듣기</span>
                  </button>
                </div>

                {/* Expanded text */}
                {isExpanded && (
                  <div className="mt-2 p-2.5 bg-slate-50 rounded-xl text-xs font-jua text-slate-800 leading-relaxed border border-slate-200">
                    {rec.koreanReading}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer tip */}
      {records.length > 0 && (
        <div className="pt-2 border-t-2 border-slate-100 text-[11px] text-slate-400 font-jua text-center">
          브라우저를 닫아도 기록이 지워지지 않아요 🎈
        </div>
      )}
    </aside>
  );
};
