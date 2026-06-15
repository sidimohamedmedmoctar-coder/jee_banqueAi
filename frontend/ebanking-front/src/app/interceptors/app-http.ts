import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Laisser passer la requête de login sans token
    if (req.url.includes('/auth/login')) {
      return next.handle(req);
    }

    // Cloner la requête en ajoutant le header Authorization
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authService.accessToken}`,
      },
    });

    return next.handle(cloned).pipe(
      catchError(err => {
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
        return throwError(() => err);
      })
    );
  }
}
