import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/login';

  isAutenticated = signal<boolean>(!!localStorage.getItem('token'));

  login(email: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>(this.apiUrl, { email, password }).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        this.isAutenticated.set(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isAutenticated.set(false);
  }
}
