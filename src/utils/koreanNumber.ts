/**
 * Utilities for Korean large number generation, conversion, and formatting.
 * Covers: 조 (10^12), 억 (10^8), 만 (10^4), and standard ones (10^0).
 * Based on Korean elementary 4th-grade mathematics curriculum (초등 4학년 1학기 큰 수).
 */

export type NumberRangeKey =
  | 'thousand_trillion' // 몇천조 (16자리: 1,000조 ~ 9,999조)
  | 'hundred_trillion'  // 몇백조 (15자리: 100조 ~ 999조)
  | 'ten_trillion'      // 몇십조 (14자리: 10조 ~ 99조)
  | 'trillion'          // 몇조 (13자리: 1조 ~ 9조)
  | 'thousand_billion'  // 몇천억 (12자리: 1,000억 ~ 9,999억)
  | 'hundred_billion'   // 몇백억 (11자리: 100억 ~ 999억)
  | 'ten_billion'       // 몇십억 (10자리: 10억 ~ 99억)
  | 'billion'           // 몇억 (9자리: 1억 ~ 9억)
  | 'thousand_ten_thousand' // 몇천만 (8자리: 1,000만 ~ 9,999만)
  | 'hundred_ten_thousand'  // 몇백만 (7자리: 100만 ~ 999만)
  | 'ten_ten_thousand'      // 몇십만 (6자리: 10만 ~ 99만)
  | 'ten_thousand'          // 몇만 (5자리: 1만 ~ 9만)
  | 'mix_trillion'      // 조 전체 랜덤 (1조 ~ 9,999조)
  | 'mix_billion'       // 억 전체 랜덤 (1억 ~ 9,999억)
  | 'mix_ten_thousand'  // 만 전체 랜덤 (1만 ~ 9,999만)
  | 'mix_all';          // 전체 범위 랜덤 (1만 ~ 9,999조)

export type ZeroDifficulty = 'standard' | 'zero_trap' | 'dense';

export interface RangeOption {
  key: NumberRangeKey;
  label: string;
  category: '조' | '억' | '만' | '랜덤';
  digits: number; // or max digits
  description: string;
  example: string;
}

export const RANGE_OPTIONS: RangeOption[] = [
  // 조 단위
  {
    key: 'thousand_trillion',
    label: '몇천조',
    category: '조',
    digits: 16,
    description: '1,000조 ~ 9,999조 (16자리)',
    example: '5,820조 1,430억 7,920만 1,450',
  },
  {
    key: 'hundred_trillion',
    label: '몇백조',
    category: '조',
    digits: 15,
    description: '100조 ~ 999조 (15자리)',
    example: '740조 3,800억 4,100만 8,900',
  },
  {
    key: 'ten_trillion',
    label: '몇십조',
    category: '조',
    digits: 14,
    description: '10조 ~ 99조 (14자리)',
    example: '68조 5,200억 9,000만 3,100',
  },
  {
    key: 'trillion',
    label: '몇조',
    category: '조',
    digits: 13,
    description: '1조 ~ 9조 (13자리)',
    example: '7조 1,500억 8,240만 6,000',
  },

  // 억 단위
  {
    key: 'thousand_billion',
    label: '몇천억',
    category: '억',
    digits: 12,
    description: '1,000억 ~ 9,999억 (12자리)',
    example: '4,520억 8,900만 7,000',
  },
  {
    key: 'hundred_billion',
    label: '몇백억',
    category: '억',
    digits: 11,
    description: '100억 ~ 999억 (11자리)',
    example: '350억 4,120만 9,300',
  },
  {
    key: 'ten_billion',
    label: '몇십억',
    category: '억',
    digits: 10,
    description: '10억 ~ 99억 (10자리)',
    example: '82억 6,700만 1,200',
  },
  {
    key: 'billion',
    label: '몇억',
    category: '억',
    digits: 9,
    description: '1억 ~ 9억 (9자리)',
    example: '9억 4,200만 5,600',
  },

  // 만 단위
  {
    key: 'thousand_ten_thousand',
    label: '몇천만',
    category: '만',
    digits: 8,
    description: '1,000만 ~ 9,999만 (8자리)',
    example: '7,840만 9,200',
  },
  {
    key: 'hundred_ten_thousand',
    label: '몇백만',
    category: '만',
    digits: 7,
    description: '100만 ~ 999만 (7자리)',
    example: '520만 4,300',
  },
  {
    key: 'ten_ten_thousand',
    label: '몇십만',
    category: '만',
    digits: 6,
    description: '10만 ~ 99만 (6자리)',
    example: '64만 8,100',
  },
  {
    key: 'ten_thousand',
    label: '몇만',
    category: '만',
    digits: 5,
    description: '1만 ~ 9만 (5자리)',
    example: '8만 3,500',
  },

  // 종합 랜덤
  {
    key: 'mix_trillion',
    label: '조 전체 랜덤',
    category: '랜덤',
    digits: 16,
    description: '1조 ~ 9,999조 무작위',
    example: '조 단위 자릿수 무작위 훈련',
  },
  {
    key: 'mix_billion',
    label: '억 전체 랜덤',
    category: '랜덤',
    digits: 12,
    description: '1억 ~ 9,999억 무작위',
    example: '억 단위 자릿수 무작위 훈련',
  },
  {
    key: 'mix_ten_thousand',
    label: '만 전체 랜덤',
    category: '랜덤',
    digits: 8,
    description: '1만 ~ 9,999만 무작위',
    example: '만 단위 자릿수 무작위 훈련',
  },
  {
    key: 'mix_all',
    label: '만~천조 종합',
    category: '랜덤',
    digits: 16,
    description: '만부터 천조까지 자유 무작위',
    example: '모든 자릿수 종합 도전 모드',
  },
];

const KOREAN_DIGITS = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];

export interface DigitBreakdown {
  label: '천' | '백' | '십' | '일';
  digit: string;
  isZero: boolean;
}

export interface GroupBlock {
  unit: '조' | '억' | '만' | '일';
  fullValueStr: string; // 4자리 (e.g. "0420" or "4520")
  valueNumber: number;  // 0 ~ 9999
  hasValue: boolean;
  koreanText: string;   // e.g. "사천오백이십" or ""
  digits: DigitBreakdown[]; // [천, 백, 십, 일]
  colorClass: {
    badge: string;
    bg: string;
    border: string;
    text: string;
    lightBg: string;
  };
}

export interface NumberAnalysis {
  raw: string; // e.g. "4520102000405001"
  formattedWithComma: string; // e.g. "4,520,102,000,405,001"
  formattedKoreanUnit: string; // e.g. "4520조 1020억 40만 5001"
  koreanReading: string; // e.g. "사천오백이십조 천이십억 사십만 오천일"
  blocks: GroupBlock[]; // [조, 억, 만, 일] (left to right)
  activeUnitsCount: number;
}

/**
 * Generates a random number string strictly within the specified range and zero difficulty.
 */
export function generateRandomNumber(
  rangeKey: NumberRangeKey,
  difficulty: ZeroDifficulty = 'standard'
): string {
  let length: number;

  switch (rangeKey) {
    case 'thousand_trillion': length = 16; break;
    case 'hundred_trillion': length = 15; break;
    case 'ten_trillion': length = 14; break;
    case 'trillion': length = 13; break;

    case 'thousand_billion': length = 12; break;
    case 'hundred_billion': length = 11; break;
    case 'ten_billion': length = 10; break;
    case 'billion': length = 9; break;

    case 'thousand_ten_thousand': length = 8; break;
    case 'hundred_ten_thousand': length = 7; break;
    case 'ten_ten_thousand': length = 6; break;
    case 'ten_thousand': length = 5; break;

    case 'mix_trillion':
      length = Math.floor(Math.random() * 4) + 13; // 13 ~ 16
      break;
    case 'mix_billion':
      length = Math.floor(Math.random() * 4) + 9; // 9 ~ 12
      break;
    case 'mix_ten_thousand':
      length = Math.floor(Math.random() * 4) + 5; // 5 ~ 8
      break;
    case 'mix_all':
      length = Math.floor(Math.random() * 12) + 5; // 5 ~ 16
      break;
  }

  // First digit cannot be 0
  const firstDigit = (Math.floor(Math.random() * 9) + 1).toString();
  const digits: string[] = [firstDigit];

  for (let i = 1; i < length; i++) {
    let digit: string;

    if (difficulty === 'dense') {
      // 꽉 찬 수: 0 없이 1~9로 가득 채움
      digit = (Math.floor(Math.random() * 9) + 1).toString();
    } else if (difficulty === 'zero_trap') {
      // 0 함정 모드: 0이 나올 확률 45% (연속 0 가능)
      if (Math.random() < 0.45) {
        digit = '0';
      } else {
        digit = (Math.floor(Math.random() * 9) + 1).toString();
      }
    } else {
      // standard: 0 확률 약 22%
      if (Math.random() < 0.22) {
        digit = '0';
      } else {
        digit = (Math.floor(Math.random() * 9) + 1).toString();
      }
    }

    digits.push(digit);
  }

  // Guard: if zero_trap makes all following digits 0, ensure at least one non-zero to make it interesting
  if (difficulty === 'zero_trap' && digits.slice(1).every((d) => d === '0')) {
    const randomIdx = Math.floor(Math.random() * (length - 1)) + 1;
    digits[randomIdx] = (Math.floor(Math.random() * 9) + 1).toString();
  }

  return digits.join('');
}

/**
 * Converts a 4-digit block into standard Korean pronunciation text.
 * @param block 4-character string e.g. "0420"
 * @param isHighestGroup whether this is the highest non-zero unit block in the number
 * @param unit '조' | '억' | '만' | '일'
 */
function readFourDigits(
  block: string,
  isHighestGroup: boolean,
  unit: '조' | '억' | '만' | '일'
): string {
  const d1000 = parseInt(block[0], 10);
  const d100 = parseInt(block[1], 10);
  const d10 = parseInt(block[2], 10);
  const d1 = parseInt(block[3], 10);

  const total = d1000 * 1000 + d100 * 100 + d10 * 10 + d1;
  if (total === 0) return '';

  let result = '';

  // 천 자리 (1000)
  if (d1000 > 0) {
    if (d1000 === 1) {
      result += '천';
    } else {
      result += KOREAN_DIGITS[d1000] + '천';
    }
  }

  // 백 자리 (100)
  if (d100 > 0) {
    if (d100 === 1) {
      result += '백';
    } else {
      result += KOREAN_DIGITS[d100] + '백';
    }
  }

  // 십 자리 (10)
  if (d10 > 0) {
    if (d10 === 1) {
      result += '십';
    } else {
      result += KOREAN_DIGITS[d10] + '십';
    }
  }

  // 일 자리 (1)
  if (d1 > 0) {
    if (d1 === 1) {
      // 1의 자리 특별 규칙:
      if (unit === '일') {
        // 일의 자리군:
        // 만약 십/백/천 자리가 없고 전체 수가 1이면 '일', 아니면 '일' (예: 이십일, 삼천일)
        result += '일';
      } else {
        // 만, 억, 조 단위:
        // 만약 해당 4자리 블록이 정확히 1만 있는 경우 (e.g. 0001)
        if (total === 1) {
          if (unit === '만') {
            // 교과서 기준: '일만' (혼동 방지) or '만'
            // 단, 앞에 더 높은 자리수가 있을 때(예: 삼억 일만) '일만'이 명확
            result += '일';
          } else {
            // 일억, 일조
            result += '일';
          }
        } else {
          result += '일';
        }
      }
    } else {
      result += KOREAN_DIGITS[d1];
    }
  }

  return result;
}

const BLOCK_COLORS = {
  조: {
    badge: 'bg-purple-600 text-white',
    bg: 'bg-purple-50/70 border-purple-200',
    border: 'border-purple-300',
    text: 'text-purple-900',
    lightBg: 'bg-purple-100/70',
  },
  억: {
    badge: 'bg-blue-600 text-white',
    bg: 'bg-blue-50/70 border-blue-200',
    border: 'border-blue-300',
    text: 'text-blue-900',
    lightBg: 'bg-blue-100/70',
  },
  만: {
    badge: 'bg-emerald-600 text-white',
    bg: 'bg-emerald-50/70 border-emerald-200',
    border: 'border-emerald-300',
    text: 'text-emerald-900',
    lightBg: 'bg-emerald-100/70',
  },
  일: {
    badge: 'bg-slate-700 text-white',
    bg: 'bg-slate-50 border-slate-200',
    border: 'border-slate-300',
    text: 'text-slate-800',
    lightBg: 'bg-slate-100',
  },
};

/**
 * Analyzes a number string and generates full Korean readings, unit representations,
 * and 4-digit block structures.
 */
export function analyzeKoreanNumber(rawInput: string): NumberAnalysis {
  // Clean string to digits only
  const raw = rawInput.replace(/\D/g, '') || '0';

  // Standard 3-digit comma format
  const formattedWithComma = BigInt(raw).toLocaleString('en-US');

  // Pad to multiple of 4, up to 16 digits
  const padded = raw.padStart(16, '0');
  const blocksRaw = [
    { unit: '조' as const, str: padded.slice(0, 4) },
    { unit: '억' as const, str: padded.slice(4, 8) },
    { unit: '만' as const, str: padded.slice(8, 12) },
    { unit: '일' as const, str: padded.slice(12, 16) },
  ];

  // Find index of first non-zero block
  let firstActiveIdx = blocksRaw.findIndex((b) => parseInt(b.str, 10) > 0);
  if (firstActiveIdx === -1) firstActiveIdx = 3; // all zeroes

  const readingParts: string[] = [];
  const koreanUnitParts: string[] = [];
  const groupBlocks: GroupBlock[] = [];

  blocksRaw.forEach((item, idx) => {
    const valNum = parseInt(item.str, 10);
    const hasValue = valNum > 0;
    const isHighest = idx === firstActiveIdx;

    const readText = readFourDigits(item.str, isHighest, item.unit);

    if (hasValue) {
      if (item.unit === '일') {
        readingParts.push(readText);
        koreanUnitParts.push(`${valNum}`);
      } else {
        readingParts.push(`${readText}${item.unit}`);
        koreanUnitParts.push(`${valNum}${item.unit}`);
      }
    }

    const d1000 = item.str[0];
    const d100 = item.str[1];
    const d10 = item.str[2];
    const d1 = item.str[3];

    groupBlocks.push({
      unit: item.unit,
      fullValueStr: item.str,
      valueNumber: valNum,
      hasValue: idx >= firstActiveIdx,
      koreanText: hasValue ? (item.unit === '일' ? readText : `${readText}${item.unit}`) : '',
      digits: [
        { label: '천', digit: d1000, isZero: d1000 === '0' },
        { label: '백', digit: d100, isZero: d100 === '0' },
        { label: '십', digit: d10, isZero: d10 === '0' },
        { label: '일', digit: d1, isZero: d1 === '0' },
      ],
      colorClass: BLOCK_COLORS[item.unit],
    });
  });

  // Filter out any blocks before the highest active block for display
  const visibleBlocks = groupBlocks.filter((_, idx) => idx >= firstActiveIdx);

  const koreanReading = readingParts.length > 0 ? readingParts.join(' ') : '영';
  const formattedKoreanUnit = koreanUnitParts.length > 0 ? koreanUnitParts.join(' ') : '0';

  return {
    raw,
    formattedWithComma,
    formattedKoreanUnit,
    koreanReading,
    blocks: visibleBlocks,
    activeUnitsCount: readingParts.length,
  };
}

/**
 * Text-to-speech for reading the Korean number aloud
 */
export function speakKoreanText(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (!('speechSynthesis' in window)) return false;

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.9; // Slightly slower, clear pace for children
    utterance.pitch = 1.05;

    // Pick a high-quality Korean voice if available
    const voices = window.speechSynthesis.getVoices();
    const koreanVoice = voices.find((v) => v.lang === 'ko-KR' || v.lang.startsWith('ko'));
    if (koreanVoice) {
      utterance.voice = koreanVoice;
    }

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    if (onEnd) onEnd();
    return false;
  }
}
