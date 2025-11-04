import { Injectable, signal, effect } from '@angular/core';

export type ThemePreference = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // User's theme preference (light/dark/auto)
  private readonly themePreference = signal<ThemePreference>('auto');

  // Actual applied theme (light or dark)
  readonly appliedTheme = signal<'light' | 'dark'>('light');

  constructor() {
    // Load saved preference from localStorage
    this.loadThemePreference();

    // Apply theme on changes
    effect(() => {
      this.applyTheme();
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.themePreference() === 'auto') {
        this.applyTheme();
      }
    });
  }

  /**
   * Get current theme preference
   */
  getThemePreference(): ThemePreference {
    return this.themePreference();
  }

  /**
   * Set theme preference
   */
  setThemePreference(theme: ThemePreference): void {
    this.themePreference.set(theme);
    localStorage.setItem('theme-preference', theme);
    this.applyTheme();
  }

  /**
   * Toggle between light and dark (sets manual preference)
   */
  toggleTheme(): void {
    const current = this.appliedTheme();
    const newTheme: ThemePreference = current === 'light' ? 'dark' : 'light';
    this.setThemePreference(newTheme);
  }

  /**
   * Load theme preference from localStorage
   */
  private loadThemePreference(): void {
    const saved = localStorage.getItem('theme-preference') as ThemePreference | null;
    if (saved && ['light', 'dark', 'auto'].includes(saved)) {
      this.themePreference.set(saved);
    }
    this.applyTheme();
  }

  /**
   * Apply the theme to the document
   */
  private applyTheme(): void {
    const preference = this.themePreference();
    let theme: 'light' | 'dark';

    if (preference === 'auto') {
      // Use system preference
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      theme = preference;
    }

    // Apply to document
    document.documentElement.setAttribute('data-theme', theme);
    this.appliedTheme.set(theme);
  }
}
