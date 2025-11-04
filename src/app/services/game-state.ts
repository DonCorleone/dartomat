import { Injectable, signal, computed } from '@angular/core';
import { Player } from '../models/player.model';
import { GameConfig, InputMode } from '../models/game-config.model';
import { Round, Throw } from '../models/throw.model';
import { ScoreService } from './score';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  // Game configuration
  private readonly gameConfig = signal<GameConfig | null>(null);

  // Players
  private readonly players = signal<Player[]>([]);

  // Current player index
  private readonly currentPlayerIndex = signal<number>(0);

  // Current round being played (before submission)
  private readonly currentRound = signal<Round>({ throws: [], totalScore: 0 });

  // Game status
  private readonly gameStarted = signal<boolean>(false);
  private readonly gameFinished = signal<boolean>(false);
  private readonly winner = signal<Player | null>(null);

  // Computed values
  readonly config = this.gameConfig.asReadonly();
  readonly allPlayers = this.players.asReadonly();
  readonly currentPlayer = computed(() => {
    const players = this.players();
    const index = this.currentPlayerIndex();
    return players[index] || null;
  });
  readonly activeRound = this.currentRound.asReadonly();
  readonly isGameStarted = this.gameStarted.asReadonly();
  readonly isGameFinished = this.gameFinished.asReadonly();
  readonly gameWinner = this.winner.asReadonly();

  constructor(private scoreService: ScoreService) {}

  /**
   * Initialize a new game
   */
  startGame(config: GameConfig): void {
    this.gameConfig.set(config);

    const players: Player[] = config.playerNames.map((name, index) => ({
      id: `player-${index}`,
      name,
      currentScore: config.startingScore,
      rounds: [],
      hasWon: false
    }));

    this.players.set(players);
    this.currentPlayerIndex.set(0);
    this.currentRound.set({ throws: [], totalScore: 0 });
    this.gameStarted.set(true);
    this.gameFinished.set(false);
    this.winner.set(null);
  }

  /**
   * Add a throw to the current round
   */
  addThrow(dartThrow: Throw): boolean {
    const round = this.currentRound();

    // Max 3 throws per round
    if (round.throws.length >= 3) {
      return false;
    }

    // Validate throw
    if (!this.scoreService.validateThrow(dartThrow)) {
      return false;
    }

    const updatedRound: Round = {
      throws: [...round.throws, dartThrow],
      totalScore: round.totalScore + dartThrow.score
    };

    this.currentRound.set(updatedRound);
    return true;
  }

  /**
   * Submit the current round and move to next player
   * Allows submitting rounds with 0 throws (for 0 points)
   */
  submitRound(): void {
    const player = this.currentPlayer();
    const round = this.currentRound();

    if (!player) {
      return;
    }

    // Calculate new score
    const newScore = player.currentScore - round.totalScore;

    // Check if valid score (can't go negative or to 1)
    if (newScore < 0) {
      // Bust - reset round but move to next player
      this.currentRound.set({ throws: [], totalScore: 0 });
      this.nextPlayer();
      return;
    }

    // Update player
    const updatedPlayer: Player = {
      ...player,
      currentScore: newScore,
      rounds: [...player.rounds, round],
      hasWon: newScore === 0
    };

    // Update players array
    this.updatePlayer(updatedPlayer);

    // Check win condition
    if (updatedPlayer.hasWon) {
      this.gameFinished.set(true);
      this.winner.set(updatedPlayer);
    } else {
      // Reset round and move to next player
      this.currentRound.set({ throws: [], totalScore: 0 });
      this.nextPlayer();
    }
  }

  /**
   * Submit round with manual score (for calculating mode)
   */
  submitManualScore(score: number): void {
    const player = this.currentPlayer();

    if (!player) {
      return;
    }

    const newScore = player.currentScore - score;

    if (newScore < 0) {
      // Bust - just move to next player
      this.nextPlayer();
      return;
    }

    const round: Round = {
      throws: [], // No individual throws in calculating mode
      totalScore: score
    };

    const updatedPlayer: Player = {
      ...player,
      currentScore: newScore,
      rounds: [...player.rounds, round],
      hasWon: newScore === 0
    };

    this.updatePlayer(updatedPlayer);

    if (updatedPlayer.hasWon) {
      this.gameFinished.set(true);
      this.winner.set(updatedPlayer);
    } else {
      this.nextPlayer();
    }
  }

  /**
   * Clear the current round
   */
  clearCurrentRound(): void {
    this.currentRound.set({ throws: [], totalScore: 0 });
  }

  /**
   * Reset the game
   */
  resetGame(): void {
    this.gameConfig.set(null);
    this.players.set([]);
    this.currentPlayerIndex.set(0);
    this.currentRound.set({ throws: [], totalScore: 0 });
    this.gameStarted.set(false);
    this.gameFinished.set(false);
    this.winner.set(null);
  }

  /**
   * Move to next player
   */
  private nextPlayer(): void {
    const players = this.players();
    const nextIndex = (this.currentPlayerIndex() + 1) % players.length;
    this.currentPlayerIndex.set(nextIndex);
  }

  /**
   * Update a specific player in the players array
   */
  private updatePlayer(updatedPlayer: Player): void {
    const players = this.players();
    const index = players.findIndex(p => p.id === updatedPlayer.id);

    if (index !== -1) {
      const newPlayers = [...players];
      newPlayers[index] = updatedPlayer;
      this.players.set(newPlayers);
    }
  }
}
