import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../../domain/models/user'; 
import { Token } from '../../domain/models/token';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiBaseUrl = environment.apiUrl;
  private tokenKey = 'auth_token';

  // BehaviorSubject to hold the current user state
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // A simple observable for checking if the user is authenticated
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    // When the service is initialized, check if a token exists and get user profile
    this.checkInitialSession();
  }

  private checkInitialSession(): void {
    const token = this.getToken();
    if (token) {
      this.http.get<User>(`${this.apiBaseUrl}/auth/users/me`).subscribe({
        next: (user) => {
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        },
        error: () => {
          // Token is invalid or expired, so log out
          this.logout();
        }
      });
    }
  }

  // --- Core API Methods ---

  register(userData: any): Observable<User> {
    return this.http.post<User>(`${this.apiBaseUrl}/auth/register`, userData);
  }

  login(credentials: any): Observable<Token> {
    const formData = new URLSearchParams();
    formData.set('username', credentials.email);
    formData.set('password', credentials.password);

    return this.http.post<Token>(`${this.apiBaseUrl}/auth/login`, formData.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).pipe(
      tap(response => this.handleAuthSuccess(response.access_token))
    );
  }

  getAllUsers(): Observable<User[]> {
    // The AuthInterceptor will automatically add the Bearer token to this request
    return this.http.get<User[]>(`${this.apiBaseUrl}/auth/users/`);
  }

  loginWithGoogle(code: string): Observable<Token> {
    return this.http.post<Token>(`${this.apiBaseUrl}/auth/google/login`, { code }).pipe(
      tap(response => this.handleAuthSuccess(response.access_token))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth']); // Navigate to a safe page after logout
  }

  // --- Helper Methods ---

  private handleAuthSuccess(token: string): void {
    this.saveToken(token);
    this.checkInitialSession(); // Fetch user profile after getting token
  }

  private saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  } 
}