import { Injectable } from '@angular/core';
import { Throw, Round } from '../models/throw.model';

@Injectable({
  providedIn: 'root',
})
export class ScoreService {

  /**
   * Validates if a throw is possible in darts
   */
  validateThrow(dartThrow: Throw): boolean {
    const { value, multiplier } = dartThrow;

    // Valid numbers: 1-20 and 25 (bull)
    if (value < 1 || value > 25 || (value > 20 && value < 25)) {
      return false;
    }

    // Bull (25) can only be single (inner bull = 25) or double (outer bull = 50)
    // Regular bulls are typically: outer (25, multiplier 1) and inner (25, multiplier 2)
    if (value === 25 && multiplier === 3) {
      return false;
    }

    return true;
  }

  /**
   * Calculates the score for a single throw
   */
  calculateThrowScore(value: number, multiplier: 1 | 2 | 3): number {
    return value * multiplier;
  }

  /**
   * Calculates the total score for a round
   */
  calculateRoundScore(round: Round): number {
    return round.throws.reduce((sum, t) => sum + t.score, 0);
  }

  /**
   * Validates if a score can be subtracted (must not go below 0 or 1)
   * In standard darts, you must finish on exactly 0 with a double
   */
  canSubtractScore(currentScore: number, roundScore: number): boolean {
    const newScore = currentScore - roundScore;
    return newScore >= 0;
  }

  /**
   * Checks if a player has won (reached exactly 0)
   * In standard rules, must finish with a double
   */
  checkWinCondition(currentScore: number, lastThrow: Throw | null): boolean {
    if (currentScore !== 0) {
      return false;
    }

    // For now, simple rule: just reach 0
    // Can be extended to require double finish
    return true;
  }

  /**
   * Creates a throw object
   */
  createThrow(value: number, multiplier: 1 | 2 | 3): Throw {
    return {
      value,
      multiplier,
      score: this.calculateThrowScore(value, multiplier)
    };
  }
}
