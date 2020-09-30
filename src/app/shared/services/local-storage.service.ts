import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { LoginUser } from '../models/BL/login-user';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ROUTES } from '@cov/routes';
import { LocalStorgeKey as LocalStorageKey } from '../constants/local-storage-keys';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    constructor(
    ) {
    }

    public loadFromLS<T>(key: string): T {
        return JSON.parse(localStorage.getItem(key));
    }
    public saveToLS<T>(key: string, value: T): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

}

