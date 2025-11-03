import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../services/game-state';

@Component({
  selector: 'app-calculating-mode',
  imports: [CommonModule, FormsModule],
  templateUrl: './calculating-mode.html',
  styleUrl: './calculating-mode.css',
})
export class CalculatingMode {
  protected readonly gameState = inject(GameStateService);
  protected readonly scoreInput = signal<number | null>(null);
  protected readonly errorMessage = signal<string>('');

  /**
   * Submit the manually entered score
   */
  protected submitScore(): void {
    const score = this.scoreInput();
    const player = this.gameState.currentPlayer();

    if (score === null || score < 0) {
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

    // Check if score would result in bust
    const newScore = player.currentScore - score;
    if (newScore < 0) {
      this.errorMessage.set(`Score too high! (${player.currentScore} remaining)`);
      // Submit anyway - the game state service will handle the bust
      this.gameState.submitManualScore(score);
      this.scoreInput.set(null);
      this.errorMessage.set('');
      return;
    }

    // Submit the score
    this.gameState.submitManualScore(score);
    this.scoreInput.set(null);
    this.errorMessage.set('');
  }

  /**
   * Quick score buttons for common scores
   */
  protected quickScore(score: number): void {
    this.scoreInput.set(score);
  }
}
