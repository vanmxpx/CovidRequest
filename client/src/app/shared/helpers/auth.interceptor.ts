import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LoginUser } from '../models/BL/login-user';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService,
        private snackBar: MatSnackBar
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        try {
            if (this.authService.authorized) {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${this.authService.currentUser.token}`
                    }
                });
            }
        } catch (error) {
            if (error.status && error.status === 401) {
                this.authService.logout();
            }
            return;
            // throw error;
        }

        return next.handle(request);
    }
}
