import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../services/game-state';
import { ScoreService } from '../../services/score';

@Component({
  selector: 'app-input-mode',
  imports: [CommonModule, FormsModule],
  templateUrl: './input-mode.html',
  styleUrl: './input-mode.css',
})
export class InputMode {
  protected readonly gameState = inject(GameStateService);
  protected readonly scoreService = inject(ScoreService);

  protected readonly dartValue = signal<number | null>(null);
  protected readonly dartMultiplier = signal<1 | 2 | 3>(1);
  protected readonly errorMessage = signal<string>('');

  /**
   * Add a throw to the current round
   */
  protected addThrow(): void {
    const value = this.dartValue();
    const multiplier = this.dartMultiplier();

    if (value === null) {
      this.errorMessage.set('Please enter a dart value');
      return;
    }

    if (value < 1 || value > 20) {
      if (value !== 25) {
        this.errorMessage.set('Valid values: 1-20 or 25 (bull)');
        return;
      }
    }

    const dartThrow = this.scoreService.createThrow(value, multiplier);

    if (!this.scoreService.validateThrow(dartThrow)) {
      this.errorMessage.set('Invalid throw');
      return;
    }

    const success = this.gameState.addThrow(dartThrow);

    if (!success) {
      this.errorMessage.set('Maximum 3 darts per round');
      return;
    }

    // Reset inputs
    this.dartValue.set(null);
    this.dartMultiplier.set(1);
    this.errorMessage.set('');
  }

  /**
   * Submit the current round
   */
  protected submitRound(): void {
    const round = this.gameState.activeRound();

    if (round.throws.length === 0) {
      this.errorMessage.set('Add at least one throw before submitting');
      return;
    }

    this.gameState.submitRound();
    this.errorMessage.set('');
  }

  /**
   * Clear the current round
   */
  protected clearRound(): void {
    this.gameState.clearCurrentRound();
    this.dartValue.set(null);
    this.dartMultiplier.set(1);
    this.errorMessage.set('');
  }

  /**
   * Quick number pad for dart values
   */
  protected setDartValue(value: number): void {
    this.dartValue.set(value);
  }

  /**
   * Set multiplier
   */
  protected setMultiplier(multiplier: 1 | 2 | 3): void {
    this.dartMultiplier.set(multiplier);
  }
}
