import React from 'react';
import { Volume2, VolumeX, Sparkles, BookOpen } from 'lucide-react';
import { sound } from '../utils/audio';
import mascotImg from '../assets/images/cute_math_mascot_1791880183512.jpg';

interface HeaderProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isMuted,
  onToggleMute,
  onOpenGuide,
}) => {
  return (
    <header className="flex items-center justify-between gap-4 px-5 sm:px-8 py-3 bg-white/95 backdrop-blur-md border-b-2 border-indigo-100/80 sticky top-0 z-40 shadow-xs">
      {/* Brand Zone: Mascot + Cheerful title */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-2xs bg-amber-50 shrink-0">
          <img
            src={mascotImg}
            alt="수학 탐험대 마스코트 별이"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover scale-110"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-jua text-indigo-900 tracking-tight leading-none">
              조·억·만 큰 수 읽기
            </h1>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold font-jua border border-amber-200">
              초등 4학년 큰 수 단원 🎒
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium hidden sm:block mt-0.5">
            소리 내어 크게 읽고 타이머를 멈추는 스피드 챌린지!
          </p>
        </div>
      </div>

      {/* Nav & Action Controls */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onOpenGuide();
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs font-jua transition-all active:scale-95 cursor-pointer shadow-2xs"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>읽는 법 비법 노트</span>
        </button>

        <button
          type="button"
          onClick={onToggleMute}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-jua transition-all active:scale-95 cursor-pointer shadow-2xs ${
            isMuted
              ? 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
              : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
          }`}
          title={isMuted ? '효과음 켜기' : '효과음 끄기'}
          aria-label={isMuted ? '효과음 켜기' : '효과음 끄기'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-600" />}
          <span className="hidden sm:inline">{isMuted ? '소리 꺼짐' : '효과음 켜짐'}</span>
        </button>
      </div>
    </header>
  );
};
