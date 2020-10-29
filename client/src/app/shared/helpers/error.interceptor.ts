import { Injectable, Inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { NotificationsService } from '../services/notifications.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private notifications: NotificationsService,
        private authService: AuthService
    ) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError(err => {
                if (err.status && err.status === 401) {
                    return throwError(err);
                }

                // this.notifications.error('Error on sending request: ' + err.statusText || err.message || err);

                return throwError(err);
        }));
    }
}

