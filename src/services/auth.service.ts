import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly isLoggedIn = signal(false);
  readonly username = signal<string | null>(null);

  constructor() {
    // Check for existing session
    const storedAuth = localStorage.getItem('taskflow_auth');
    if (storedAuth === 'true') {
      this.isLoggedIn.set(true);
      this.username.set('submish');
    }
  }

  login(user: string, pass: string): boolean {
    // Hardcoded credentials as requested
    if (user === 'submish' && pass === 'webbuild@123') {
      this.isLoggedIn.set(true);
      this.username.set(user);
      localStorage.setItem('taskflow_auth', 'true');
      return true;
    }
    return false;
  }

  logout() {
    this.isLoggedIn.set(false);
    this.username.set(null);
    localStorage.removeItem('taskflow_auth');
  }
}