import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, AbstractControl, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Observable } from 'rxjs';
import { ValidatorsExtensions } from '@cov/shared/helpers';
import { ROUTES } from '@cov/routes';

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
        public snackBar: MatSnackBar,
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

        this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
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
                this.snackBar.open('Incorrect username or password.', 'OK', {
                    duration: 5000
                });
            }
        } catch (e) {
            this.snackBar.open('Incorrect username or password.', 'OK', {
                duration: 5000
            });
            console.log(e);
        }
        this.loading = false;
    }
}
