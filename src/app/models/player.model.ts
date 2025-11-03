import { Round } from './throw.model';

export interface Player {
  id: string;
  name: string;
  currentScore: number;
  rounds: Round[];
  hasWon: boolean;
}
