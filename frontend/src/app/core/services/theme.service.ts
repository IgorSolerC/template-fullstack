import { effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as jsonData from '../../styles/themes.json';


export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  // We need PLATFORM_ID to safely access browser-only APIs like `localStorage`.
  private platformId = inject(PLATFORM_ID);

  // A signal to hold the current theme.
  // We initialize it by checking localStorage or system preference.
  theme = signal<Theme>(this.getInitialTheme());

  constructor() {
    // An effect that runs whenever the theme signal changes.
    // This is where we update the DOM and localStorage.
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('theme', this.theme());

        if (this.theme() === 'dark') {
          document.documentElement.classList.add('dark-mode');
        } else {
          document.documentElement.classList.remove('dark-mode');
        }

        const themeJson = JSON.parse(JSON.stringify(jsonData));
        const currentThemeObject = themeJson.themes[this.theme()];

        if (currentThemeObject) {
          Object.entries(currentThemeObject).forEach(([property, value]) => {
            document.documentElement.style.setProperty(`--${property}`, value as string);
          });
        }
      }
    });
  }

  private getInitialTheme(): Theme {
    if (isPlatformBrowser(this.platformId)) {
      // 1. Check for a saved theme in localStorage
      const storedTheme = localStorage.getItem('theme') as Theme | null;
      if (storedTheme) {
        return storedTheme;
      }
      // 2. Check for the user's OS preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    // 3. Default to light theme
    return 'light';
  }

  /** Toggles the theme between 'light' and 'dark'. */
  toggleTheme(): void {
    this.theme.update((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
  }
}