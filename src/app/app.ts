import { Component, inject } from '@angular/core';
import { GameContainer } from './components/game-container/game-container';
import { ThemeService } from './services/theme';

@Component({
  selector: 'app-root',
  imports: [GameContainer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Inject ThemeService to ensure it initializes and detects system theme
  private readonly themeService = inject(ThemeService);
}
