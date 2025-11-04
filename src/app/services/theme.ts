import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // Actual applied theme (light or dark)
  readonly appliedTheme = signal<'light' | 'dark'>('light');

  constructor() {
    // Apply theme based on system preference
    this.applyTheme();

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      this.applyTheme();
    });
  }

  /**
   * Apply the theme based on system preference
   */
  private applyTheme(): void {
    const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    // Apply to document
    document.documentElement.setAttribute('data-theme', theme);
    this.appliedTheme.set(theme);
  }
}
