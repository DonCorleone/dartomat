import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../services/game-state';

@Component({
  selector: 'app-calculating-mode',
  imports: [CommonModule],
  templateUrl: './calculating-mode.html',
  styleUrl: './calculating-mode.css',
})
export class CalculatingMode {
  protected readonly gameState = inject(GameStateService);
  protected readonly displayValue = signal<string>('');
  protected readonly errorMessage = signal<string>('');

  /**
   * Append a digit to the display
   */
  protected appendDigit(digit: string): void {
    const current = this.displayValue();
    const newValue = current + digit;
    const numValue = parseInt(newValue, 10);

    // Don't allow more than 3 digits or values over 180
    if (newValue.length <= 3 && numValue <= 180) {
      this.displayValue.set(newValue);
      this.errorMessage.set('');
    } else if (numValue > 180) {
      this.errorMessage.set('Maximum possible score is 180');
    }
  }

  /**
   * Remove the last digit
   */
  protected backspace(): void {
    const current = this.displayValue();
    this.displayValue.set(current.slice(0, -1));
    this.errorMessage.set('');
  }

  /**
   * Clear the display
   */
  protected clear(): void {
    this.displayValue.set('');
    this.errorMessage.set('');
  }

  /**
   * Submit the entered score
   */
  protected submitScore(): void {
    const displayStr = this.displayValue();
    const player = this.gameState.currentPlayer();

    // Allow empty input to be treated as 0
    const score = displayStr === '' ? 0 : parseInt(displayStr, 10);

    if (isNaN(score) || score < 0) {
      this.errorMessage.set('Please enter a valid score');
      return;
    }

    if (!player) {
      this.errorMessage.set('No active player');
      return;
    }

    // Check if score is too high
    if (score > 180) {
      this.errorMessage.set('Maximum possible score is 180');
      return;
    }

    // Submit the score (game state service handles bust logic)
    this.gameState.submitManualScore(score);
    this.displayValue.set('');
    this.errorMessage.set('');
  }
}
