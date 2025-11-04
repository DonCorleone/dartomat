import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../services/game-state';
import { ScoreService } from '../../services/score';

@Component({
  selector: 'app-input-mode',
  imports: [CommonModule],
  templateUrl: './input-mode.html',
  styleUrl: './input-mode.css',
})
export class InputMode {
  protected readonly gameState = inject(GameStateService);
  protected readonly scoreService = inject(ScoreService);

  protected readonly errorMessage = signal<string>('');

  // Dart values in dartboard order (20 at top, clockwise)
  protected readonly dartValues = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

  /**
   * Add a throw with specific value and multiplier
   */
  protected addDartThrow(value: number, multiplier: 1 | 2 | 3): void {
    const dartThrow = this.scoreService.createThrow(value, multiplier);

    const success = this.gameState.addThrow(dartThrow);

    if (!success) {
      this.errorMessage.set('Maximum 3 darts per round');
      setTimeout(() => this.errorMessage.set(''), 2000);
    } else {
      this.errorMessage.set('');
    }
  }

  /**
   * Undo the last throw
   */
  protected undoLastThrow(): void {
    const round = this.gameState.activeRound();
    if (round.throws.length > 0) {
      const updatedThrows = round.throws.slice(0, -1);
      this.gameState.clearCurrentRound();
      updatedThrows.forEach(dartThrow => this.gameState.addThrow(dartThrow));
      this.errorMessage.set('');
    }
  }

  /**
   * Submit the current round (allows 0 throws)
   */
  protected submitRound(): void {
    this.gameState.submitRound();
    this.errorMessage.set('');
  }

  /**
   * Clear the current round
   */
  protected clearRound(): void {
    this.gameState.clearCurrentRound();
    this.errorMessage.set('');
  }
}
