import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../services/game-state';
import { GameConfig } from '../../models/game-config.model';
import { GameSetup } from '../game-setup/game-setup';
import { Scoreboard } from '../scoreboard/scoreboard';
import { CalculatingMode } from '../calculating-mode/calculating-mode';
import { InputMode } from '../input-mode/input-mode';
import { TouchMode } from '../touch-mode/touch-mode';

@Component({
  selector: 'app-game-container',
  imports: [
    CommonModule,
    GameSetup,
    Scoreboard,
    CalculatingMode,
    InputMode,
    TouchMode
  ],
  templateUrl: './game-container.html',
  styleUrl: './game-container.css',
})
export class GameContainer {
  protected readonly gameState = inject(GameStateService);

  /**
   * Handle game start from setup component
   */
  protected onGameStart(config: GameConfig): void {
    this.gameState.startGame(config);
  }

  /**
   * Reset the game
   */
  protected resetGame(): void {
    this.gameState.resetGame();
  }
}
