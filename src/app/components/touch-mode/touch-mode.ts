import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../services/game-state';
import { ScoreService } from '../../services/score';
import { ThemeService } from '../../services/theme';
import { Scoreboard } from '../scoreboard/scoreboard';

interface DartHit {
  x: number;
  y: number;
  value: number;
  multiplier: 1 | 2 | 3;
  score: number;
}

@Component({
  selector: 'app-touch-mode',
  imports: [CommonModule, Scoreboard],
  templateUrl: './touch-mode.html',
  styleUrl: './touch-mode.css',
})
export class TouchMode {
  protected readonly gameState = inject(GameStateService);
  protected readonly scoreService = inject(ScoreService);
  protected readonly themeService = inject(ThemeService);

  // Expose Math for template
  protected readonly Math = Math;

  // Dartboard configuration
  protected readonly dartboardSize = 650;
  protected readonly centerX = 325;
  protected readonly centerY = 325;

  // Dartboard segment numbers (clockwise from top)
  protected readonly segments = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

  // Hit markers for visual feedback
  protected readonly hits = signal<DartHit[]>([]);
  protected readonly errorMessage = signal<string>('');

  /**
   * Handle dartboard click/tap
   */
  protected onDartboardClick(event: MouseEvent): void {
    const svg = event.currentTarget as SVGElement;
    const rect = svg.getBoundingClientRect();

    // Get click position relative to SVG
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convert to dartboard coordinates (center is 0,0)
    const dx = x - this.centerX;
    const dy = y - this.centerY;

    const result = this.calculateHit(dx, dy);

    if (result) {
      const dartThrow = this.scoreService.createThrow(result.value, result.multiplier);
      const success = this.gameState.addThrow(dartThrow);

      if (success) {
        // Add visual marker
        this.hits.update(current => [...current, { x, y, ...result }]);
        this.errorMessage.set('');
      } else {
        this.errorMessage.set('Maximum 3 darts per round');
      }
    }
  }

  /**
   * Calculate which segment was hit based on coordinates
   */
  private calculateHit(dx: number, dy: number): { value: number; multiplier: 1 | 2 | 3; score: number } | null {
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Radius definitions (relative to 325px radius)
    const innerBullRadius = 16;
    const outerBullRadius = 41;
    const tripleInnerRadius = 154;
    const tripleOuterRadius = 171;
    const doubleInnerRadius = 252;
    const doubleOuterRadius = 268;
    const boardRadius = 268;

    // Check if outside the board
    if (distance > boardRadius) {
      this.errorMessage.set('Missed the board!');
      return null;
    }

    // Inner bull (50 points)
    if (distance <= innerBullRadius) {
      return { value: 25, multiplier: 2, score: 50 };
    }

    // Outer bull (25 points)
    if (distance <= outerBullRadius) {
      return { value: 25, multiplier: 1, score: 25 };
    }

    // Calculate angle (0 degrees is at top, clockwise)
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    angle = (angle + 90 + 360) % 360; // Convert to 0-360 starting from top

    // Each segment is 18 degrees (360 / 20)
    // Segments are offset by 9 degrees (half a segment)
    const segmentAngle = 18;
    const segmentIndex = Math.floor((angle + segmentAngle / 2) / segmentAngle) % 20;
    const segmentValue = this.segments[segmentIndex];

    // Determine multiplier based on distance
    let multiplier: 1 | 2 | 3 = 1;

    if (distance >= tripleInnerRadius && distance <= tripleOuterRadius) {
      multiplier = 3; // Triple ring
    } else if (distance >= doubleInnerRadius && distance <= doubleOuterRadius) {
      multiplier = 2; // Double ring
    }

    return {
      value: segmentValue,
      multiplier,
      score: segmentValue * multiplier
    };
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
    this.hits.set([]);
    this.errorMessage.set('');
  }

  /**
   * Clear the current round
   */
  protected clearRound(): void {
    this.gameState.clearCurrentRound();
    this.hits.set([]);
    this.errorMessage.set('');
  }

  /**
   * Reset the game
   */
  protected resetGame(): void {
    this.gameState.resetGame();
    this.hits.set([]);
    this.errorMessage.set('');
  }

  /**
   * Toggle theme
   */
  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
