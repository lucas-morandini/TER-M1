import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  isLoggedIn(): boolean {
    if (this.isBrowser) {
      return localStorage.getItem('isConnected') === 'true';
    }
    return false;
  }

  login(access_token : string, userId: number): void {
    if (this.isBrowser) {
      localStorage.setItem('isConnected', 'true');
      localStorage.setItem('userId', String(userId));
      localStorage.setItem('access_token', access_token);
    }
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('isConnected');
      localStorage.removeItem('userId');
      localStorage.removeItem('access_token');
    }
  }

  getUserId(): number {
    if (this.isBrowser) {
      return parseInt(localStorage.getItem('userId') ?? '-1', 10);
    }
    return -1;
  }
}
