import React from 'react';
import { X, BookOpen, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { speakKoreanText } from '../utils/koreanNumber';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-indigo-100 flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-slate-100 bg-indigo-50/40 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 id="guide-title" className="text-xl font-jua text-indigo-950">큰 수 읽기 비법 노트 🎒</h2>
              <p className="text-xs text-indigo-600 font-jua mt-0.5">초등학교 4학년 1학기 큰 수 단원 핵심 비법!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm text-slate-700 leading-relaxed">
          {/* Rule 1 */}
          <div className="bg-amber-50/60 border border-amber-200/70 rounded-xl p-4">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-950 text-base">핵심 1. 오른쪽부터 4자리씩 끊어서 읽어요!</h3>
                <p className="text-amber-800 text-xs mt-1">
                  우리나라 수는 서양식 3자리가 아니라 <strong>4자리(만진법)</strong>마다 단위가 바뀝니다.
                </p>
                <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs font-semibold">
                  <div className="p-2 bg-purple-100 text-purple-900 rounded-lg border border-purple-200">
                    <span className="block text-base font-bold text-purple-700">조</span>
                    16 ~ 13자리
                  </div>
                  <div className="p-2 bg-blue-100 text-blue-900 rounded-lg border border-blue-200">
                    <span className="block text-base font-bold text-blue-700">억</span>
                    12 ~ 9자리
                  </div>
                  <div className="p-2 bg-emerald-100 text-emerald-900 rounded-lg border border-emerald-200">
                    <span className="block text-base font-bold text-emerald-700">만</span>
                    8 ~ 5자리
                  </div>
                  <div className="p-2 bg-slate-100 text-slate-800 rounded-lg border border-slate-200">
                    <span className="block text-base font-bold text-slate-700">일</span>
                    4 ~ 1자리
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-2">
            <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              핵심 2. 0(영)이 있는 자리는 읽지 않아요!
            </h3>
            <p className="text-xs text-slate-600">
              자릿수가 0이면 읽지 않고 건너뜁니다. 만약 한 단위(4자리) 전체가 0이면 그 단위 이름도 통째로 생략합니다.
            </p>
            <div className="bg-slate-50 rounded-lg p-3 text-xs space-y-1.5 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-sans">예시 1: 50,000,000,000,000</span>
                <span className="font-bold text-purple-700">오십조</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-sans">예시 2: 7,004,000,000,000</span>
                <span className="font-bold text-indigo-700">칠조 사억</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-sans">예시 3: 1,020,004,050</span>
                <span className="font-bold text-blue-700">십억 이천만 사천오십</span>
              </div>
            </div>
          </div>

          {/* Rule 3 */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-2">
            <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-emerald-600" />
              핵심 3. 띄어쓰기는 '조', '억', '만' 뒤에 해요!
            </h3>
            <p className="text-xs text-slate-600">
              한글 맞춤법 제44항에 따라 수는 만 단위(조, 억, 만)로 띄어 씁니다.
            </p>
            <div className="p-3 bg-emerald-50/60 border border-emerald-200/60 rounded-lg text-xs text-emerald-950 font-medium">
              4321098765432100 = <strong>사천삼백이십일조 구백팔십칠억 육천오백사십삼만 이천백</strong>
              <button
                type="button"
                onClick={() => speakKoreanText('사천삼백이십일조 구백팔십칠억 육천오백사십삼만 이천백')}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-300 rounded-md text-emerald-700 hover:bg-emerald-50 text-xs font-semibold cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                예시 소리 듣기
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t-2 border-slate-100 flex justify-end rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-jua font-bold bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer shadow-xs"
          >
            이해했어요, 게임하러 가기! ✨
          </button>
        </div>
      </div>
    </div>
  );
};
