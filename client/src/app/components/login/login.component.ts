import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, AbstractControl, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Observable } from 'rxjs';
import { ValidatorsExtensions } from '@cov/shared/helpers';
import { ROUTES } from '@cov/routes';
import { NotificationsService } from '@cov/shared/services/notifications.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
    selector: 'cov-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    authGroup: FormGroup;
    hide: boolean = true;
    returnUrl: any;
    authControl(value: string): AbstractControl | null { return this.authGroup ? this.authGroup.get(value) : null; }
    loading: boolean = false;
    constructor(
        public authService: AuthService,
        public notifications: NotificationsService,
        private route: ActivatedRoute,
        private router: Router,
    ) {
        if (this.authService.currentUser) {
            this.router.navigate([ROUTES.ROOT]);
        }
        this.authGroup = new FormGroup({
            loginControl: new FormControl('', [Validators.required, ValidatorsExtensions.empty]),
            passwordControl: new FormControl('', [Validators.required])
        });

        this.returnUrl = this.route.snapshot.queryParams.returnUrl || '';
    }
    async sendGoogleData(googleUser: gapi.auth2.GoogleUser) {
        try {
            this.router.navigate([this.returnUrl || ROUTES.ROOT]);
            return;
            
            let res = await this.authService.loginByGoogle(googleUser.getAuthResponse().id_token);
            if (res) {
                this.router.navigate([this.returnUrl || ROUTES.ROOT]);
            } else {
                this.notifications.error('Невiрний логiн чи пароль.');
            }
        } catch (error) {
            this.notifications.error('Помилка авторизацii', { duration: 50000 } );
        }
        this.loading = false;
    }
    async authGoogle(authInstance: gapi.auth2.GoogleAuth) {

        this.loading = true;

        if (authInstance.isSignedIn.get()) {
            this.sendGoogleData(authInstance.currentUser.get());
            return;
        }

        authInstance.signIn({}).then(
            async googleUser => {
                this.sendGoogleData(googleUser);
            },
            error => {
                this.onLoginError(error);
                this.loading = false;
            }
        );
    }

    async auth() {
        this.authGroup.markAllAsTouched();
        this.authGroup.updateValueAndValidity();
        if (!this.authGroup.valid) {
            return;
        }
        this.loading = true;
        try {
            let res = await this.authService.auth(
                this.authControl('loginControl').value,
                this.authControl('passwordControl').value
            );
            if (res) {
                this.router.navigate(this.returnUrl || ROUTES.ROOT);
            } else {
                this.notifications.error('Невiрний логiн чи пароль.');
            }
        } catch (e) {
            this.notifications.error('Невiрний логiн чи пароль.');
            console.log(e);
        }
        this.loading = false;
    }

    onLoginError(error) {
        let message = 'FAILED_TO_LOGIN';
        if (error && error.error === 'popup_blocked_by_browser') {
            message = 'POPUP_BLOCKED_BY_BROWSER';
        } else if (error && error.message && error.message === 'USER_DELETED') {
            message = 'User deleted';
        } else if (error.message && error.message === 'USER_BLOCKED') {
            // this.sessionService.openUserBlockedPupup();
            message = null;
        } else if (error && error.error === 'popup_closed_by_user') {
            message = null;
        }
        if (message) {
            this.notifications.error(message);
        }
    }
}
