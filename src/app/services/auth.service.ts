import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { 
  User, 
  LoginRequest, 
  LoginResponse, 
  CreateUserRequest, 
  EmailAvailabilityRequest,
  EmailAvailabilityResponse 
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://api.escuelajs.co/api/v1';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredAuth();
  }

  private loadStoredAuth(): void {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('current_user');
    
    if (token) {
      this.tokenSubject.next(token);
    }
    
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  private saveAuthToStorage(token: string, user: User): void {
    localStorage.setItem('access_token', token);
    localStorage.setItem('current_user', JSON.stringify(user));
  }

  private clearStoredAuth(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('current_user');
    localStorage.removeItem('refresh_token');
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('refresh_token', response.refresh_token);
          this.tokenSubject.next(response.access_token);
          this.loadUserProfile();
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
    this.clearStoredAuth();
  }

  loadUserProfile(): void {
    const token = this.tokenSubject.value;
    if (token) {
      this.http.get<User>(`${this.apiUrl}/auth/profile`)
        .subscribe({
          next: (user) => {
            this.currentUserSubject.next(user);
            localStorage.setItem('current_user', JSON.stringify(user));
          },
          error: (error) => {
            console.error('Error loading user profile:', error);
            if (error.status === 401) {
              this.logout();
            }
          }
        });
    }
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/refresh-token`, {
      refreshToken: refreshToken
    }).pipe(
      tap(response => {
        localStorage.setItem('refresh_token', response.refresh_token);
        this.tokenSubject.next(response.access_token);
      }),
      catchError(error => {
        console.error('Token refresh error:', error);
        this.logout();
        return throwError(() => error);
      })
    );
  }

  createUser(userData: CreateUserRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, userData)
      .pipe(
        catchError(error => {
          console.error('User creation error:', error);
          return throwError(() => error);
        })
      );
  }

  checkEmailAvailability(email: string): Observable<EmailAvailabilityResponse> {
    const request: EmailAvailabilityRequest = { email };
    return this.http.post<EmailAvailabilityResponse>(`${this.apiUrl}/users/is-available`, request)
      .pipe(
        catchError(error => {
          console.error('Email availability check error:', error);
          return throwError(() => error);
        })
      );
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`)
      .pipe(
        catchError(error => {
          console.error('Get users error:', error);
          return throwError(() => error);
        })
      );
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`)
      .pipe(
        catchError(error => {
          console.error('Get user error:', error);
          return throwError(() => error);
        })
      );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.tokenSubject.value && !!this.currentUserSubject.value;
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }
} 