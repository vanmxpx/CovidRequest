import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { LoginUser } from '../models/BL/login-user';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ROUTES } from '@cov/routes';
import { LocalStorgeKey as LocalStorageKey } from '../constants/local-storage-keys';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {

    defaultErrorConfig: NotificationProperties = { buttonText: 'OK', class: 'cov-notification-error', duration: 5000 };
    defaultInfoConfig: NotificationProperties = { buttonText: 'OK', class: 'cov-notification-info', duration: 5000 };
    defaultWarnConfig: NotificationProperties = { buttonText: 'OK', class: 'cov-notification-warn', duration: 5000 };

    constructor(
        private snackbar: MatSnackBar
    ) {
    }

    public error(message: string, config?: NotificationProperties): void {
        config = {...this.defaultErrorConfig, ...config};
        this.snackbar.open(message, 'OK', {
            duration: config.duration,
            panelClass: config.class,
        });
    }
    public info(message: string, config?: NotificationProperties): void {
        config = {...this.defaultInfoConfig, ...config};
        this.snackbar.open(message, 'OK', {
            duration: config.duration,
            panelClass: config.class,
        });
    }
    public warn(message: string, config?: NotificationProperties): void {
        config = {...this.defaultWarnConfig, ...config};
        this.snackbar.open(message, 'OK', {
            duration: config.duration,
            panelClass: config.class,
        });
    }
}

export interface NotificationProperties {
    buttonText?: string;
    class?: string;
    duration?: number;
}
