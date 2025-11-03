import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-touch-mode',
  imports: [CommonModule],
  templateUrl: './touch-mode.html',
  styleUrl: './touch-mode.css',
})
export class TouchMode {
  // Placeholder for future visual dartboard implementation
  protected readonly message = 'Touch Mode - Visual Dartboard Coming Soon!';
  protected readonly description = 'This mode will feature an interactive dartboard where you can tap directly on the board to record your throws.';
}
