import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../services/game-state';

@Component({
  selector: 'app-scoreboard',
  imports: [CommonModule],
  templateUrl: './scoreboard.html',
  styleUrl: './scoreboard.css',
})
export class Scoreboard {
  protected readonly gameState = inject(GameStateService);

  protected readonly columnCount = computed(() => {
    const playerCount = this.gameState.allPlayers().length;
    if (playerCount <= 2) return 1;
    if (playerCount <= 4) return 2;
    if (playerCount <= 6) return 3;
    return 4;
  });
}
