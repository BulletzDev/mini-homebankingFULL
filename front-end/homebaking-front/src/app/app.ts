import { Component, signal, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('homebaking-front');
  darkMode = signal(this.getInitialDarkMode());

  constructor() {
    effect(() => {
      const isDark = this.darkMode();
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      localStorage.setItem('darkMode', isDark ? 'true' : 'false');
    });
  }

  private getInitialDarkMode(): boolean {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return saved === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  toggleDarkMode(): void {
    this.darkMode.update(val => !val);
  }
}
