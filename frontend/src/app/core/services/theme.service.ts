import { effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  // We need PLATFORM_ID to safely access browser-only APIs like `localStorage`.
  private platformId = inject(PLATFORM_ID);
  
  // A signal to hold the current theme.
  // We initialize it by checking localStorage or system preference.
  theme = signal<Theme>(this.getInitialTheme());
  
  themeModeString = 'dark-mode';
  
  constructor() {
    if(environment.debug) this.themeModeString = 'debug-mode'
    // An effect that runs whenever the theme signal changes.
    // This is where we update the DOM and localStorage.
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('theme', this.theme());
        if (this.theme() === 'dark') {
          document.body.classList.add(this.themeModeString);
          document.documentElement.classList.add(this.themeModeString);
        } else {
          document.body.classList.remove(this.themeModeString);
          document.documentElement.classList.remove(this.themeModeString);
        }
        document.documentElement.offsetHeight;
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
