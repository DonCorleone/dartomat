export type GameType = 101 | 301 | 501 | 701;

export type InputMode = 'calculating' | 'input' | 'touch';

export interface GameConfig {
  gameType: GameType;
  startingScore: number;
  playerNames: string[];
  inputMode: InputMode;
}
