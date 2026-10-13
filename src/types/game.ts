import { NumberRangeKey, ZeroDifficulty } from '../utils/koreanNumber';

export interface GameRecord {
  id: string;
  numberRaw: string;
  formattedWithComma: string;
  formattedKoreanUnit: string;
  koreanReading: string;
  rangeKey: NumberRangeKey;
  rangeLabel: string;
  timeSeconds: number;
  timestamp: number;
  difficulty: ZeroDifficulty;
}

export type DisplayMode = 'plain' | 'standard' | 'korean_unit' | 'block_breakdown';

export type GameStatus = 'idle' | 'running' | 'completed';
