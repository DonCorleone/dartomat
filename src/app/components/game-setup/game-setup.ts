import { Component, signal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GameConfig, GameType, InputMode } from '../../models/game-config.model';

@Component({
  selector: 'app-game-setup',
  imports: [CommonModule, FormsModule],
  templateUrl: './game-setup.html',
  styleUrl: './game-setup.css',
})
export class GameSetup {
  // Form data
  protected readonly playerNames = signal<string[]>(['']);
  protected readonly selectedGameType = signal<GameType>(301);
  protected readonly selectedInputMode = signal<InputMode>('calculating');
  protected readonly newPlayerName = signal<string>('');

  // Available options
  protected readonly gameTypes: GameType[] = [101, 301, 501, 701];
  protected readonly inputModes: { value: InputMode; label: string }[] = [
    { value: 'calculating', label: 'Calculating Mode' },
    { value: 'input', label: 'Input Mode' },
    { value: 'touch', label: 'Touch Mode' }
  ];

  // Output event when game starts
  readonly gameStart = output<GameConfig>();

  /**
   * Add a new player
   */
  protected addPlayer(): void {
    const name = this.newPlayerName().trim();

    if (name && !this.playerNames().includes(name)) {
      this.playerNames.update(names => [...names, name]);
      this.newPlayerName.set('');
    }
  }

  /**
   * Remove a player by index
   */
  protected removePlayer(index: number): void {
    this.playerNames.update(names => names.filter((_, i) => i !== index));
  }

  /**
   * Check if we can start the game
   */
  protected canStartGame(): boolean {
    const names = this.playerNames().filter(name => name.trim() !== '');
    return names.length >= 1;
  }

  /**
   * Start the game
   */
  protected startGame(): void {
    if (!this.canStartGame()) {
      return;
    }

    const validNames = this.playerNames()
      .map(name => name.trim())
      .filter(name => name !== '');

    const config: GameConfig = {
      gameType: this.selectedGameType(),
      startingScore: this.selectedGameType(),
      playerNames: validNames,
      inputMode: this.selectedInputMode()
    };

    this.gameStart.emit(config);
  }
}
